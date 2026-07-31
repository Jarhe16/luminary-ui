import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import sql from '@/lib/db';
import { getMonthlyLimit, getNextTier, TIER_LABELS, TIER_PRICES } from '@/lib/tiers';
import { SYSTEM_DIRECTIVES, COMPLIANCE_RULES } from '@/lib/icm';
import Anthropic from '@anthropic-ai/sdk';

// ── Text extraction helpers ──────────────────────────────────────────────────

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  if (ext === 'pdf') {
    const pdfParse = await import('pdf-parse');
    const parseFn = (pdfParse as any).default ?? pdfParse;
    const data = await parseFn(buffer);
    return data.text;
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type: .' + ext);
}

// ── Audit handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  // Fetch fresh user record for tier info
  const userId = session.user.id as string;
  const rows = await sql`SELECT tier FROM users WHERE id = ${userId}`;
  const user = rows[0] as any;
  const tier = user?.tier ?? 'foundation';
  const limit = getMonthlyLimit(tier);

  // Count audits this calendar month
  const now = new Date();
  const monthStart = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';

  const countRows = await sql`
    SELECT COUNT(*) as count
    FROM audit_runs
    WHERE user_id = ${userId}
      AND created_at >= ${monthStart}
  `;
  const count = Number((countRows[0] as any).count);

  // Enforce tier limit
  if (limit !== null && count >= limit) {
    const nextTier = getNextTier(tier);
    return NextResponse.json({
      success: false,
      limitReached: true,
      tier,
      tierLabel: TIER_LABELS[tier as keyof typeof TIER_LABELS],
      used: count,
      limit,
      nextTier,
      nextTierLabel: nextTier ? TIER_LABELS[nextTier] : null,
      nextTierPrice: nextTier ? TIER_PRICES[nextTier] : null,
    }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    // Extract text from uploaded file
    const buffer = Buffer.from(await file.arrayBuffer());
    const documentText = await extractText(buffer, file.name);

    // Assemble ICM prompt
    const systemPrompt = [
      SYSTEM_DIRECTIVES,
      COMPLIANCE_RULES,
      '',
      'RESPONSE FORMAT INSTRUCTIONS:',
      'You must respond with valid JSON only — no markdown, no explanation outside the JSON.',
      'Return a JSON object with this exact structure:',
      '{',
      '  "status": "Audit Complete",',
      '  "findings": [',
      '    {',
      '      "rule_id": "<RULE_ID>",',
      '      "clause_found": "<exact quoted text from the document>",',
      '      "variance": "<explanation of the violation>",',
      '      "severity": "HIGH | MED | LOW"',
      '    }',
      '  ]',
      '}',
      'If no violations are found, return an empty findings array.',
    ].join('\n');

    const userPrompt =
      'Analyze the following document text against the active compliance rules. ' +
      'Identify every rule violation. Return only the JSON object described.\n\n' +
      documentText;

    // Call Claude via Anthropic SDK
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    let rawResponse = (message.content[0] as any).text.trim();

    // Strip markdown fences if present
    const fence = '\x60\x60\x60';
    if (rawResponse.startsWith(fence)) {
      rawResponse = rawResponse.replace(/^\x60{3}[a-z]*\n?/, '').replace(/\x60{3}$/, '').trim();
    }

    let auditData: any;
    try {
      auditData = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to parse audit response.' }, { status: 500 });
    }

    // Save run to database
    const findings = auditData.findings ?? [];
    const high = findings.filter((f: any) => f.severity === 'HIGH').length;
    const med  = findings.filter((f: any) => f.severity === 'MED').length;
    const low  = findings.filter((f: any) => f.severity === 'LOW').length;

    await sql`
      INSERT INTO audit_runs
        (user_id, filename, file_size_kb, finding_count, high_count, med_count, low_count, findings_json)
      VALUES (
        ${userId},
        ${file.name},
        ${Math.round(file.size / 1024 * 10) / 10},
        ${findings.length},
        ${high}, ${med}, ${low},
        ${JSON.stringify(findings)}
      )
    `;

    return NextResponse.json({
      success: true,
      ...auditData,
      usage: { used: count + 1, limit, tier, tierLabel: TIER_LABELS[tier as keyof typeof TIER_LABELS] },
    });

  } catch (error: any) {
    console.error('Audit Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Audit failed.' },
      { status: 500 }
    );
  }
}
