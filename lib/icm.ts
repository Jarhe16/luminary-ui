// ICM Methodology constants — extracted to avoid Turbopack template-literal parse conflicts

export const SYSTEM_DIRECTIVES = [
  '# System Directive: ICM Orchestration & Chain-of-Compliance',
  '',
  '## Purpose',
  'This framework governs the automated analysis of incoming fund prospectuses against RIA internal rules and SEC constraints. The primary mandate is zero-variance execution: every claim made by an agent must map to an immutable disk artifact.',
  '',
  '## Operational Pipeline',
  '1. **Ingestion Loop:** Data must be pulled cleanly from the provided document text.',
  '2. **Context Sequential Read:** Agents must evaluate text using the explicit rules provided.',
  '3. **Strict Citation Mapping:** Any identified variance, risk warning, or rule breach must be logged using the following exact format:',
  '   [RULE_ID] -> [PROSPECTUS_SECTION/LINE] -> VARIANCE_DESCRIPTION -> RISK_SEVERITY (LOW/MED/HIGH)',
  '',
  '## State Control Guidelines',
  '* Agents are strictly forbidden from fabricating regulatory standards. If a rule is not explicitly declared in the compliance rules provided, it does not exist for the scope of the current execution loop.',
].join('\n');

export const COMPLIANCE_RULES = [
  '# Luminary Financial - RIA Compliance Mandates',
  '',
  '## Investment Concentration Limits',
  '* **Rule RIA-01-CONC:** No single underlying asset exposure may exceed 10% of total portfolio net asset value (NAV) unless explicitly authorized in the prospectus\'s special situations section.',
  '* **Rule RIA-02-LEV:** Total portfolio leverage ratios must not cross 2:1 relative to net equity assets.',
  '',
  '## Fiduciary Alignment Verify',
  '* **Rule RIA-03-FEES:** Ensure fee structures disclosed match the baseline Advisory Services Agreement templates. Mark performance fee structures that lack high-water mark provisions.',
].join('\n');
