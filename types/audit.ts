export type FlagSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | 'PASSED';

export interface ComplianceRuleMatch {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: FlagSeverity;
  extractedClause: string;
  pageNumber: number;
  explanation: string;
  overrideStatus?: 'APPROVED' | 'FLAGGED' | 'PENDING';
}

export interface ProspectusAuditPayload {
  auditId: string;
  fundName: string;
  ticker?: string;
  documentName: string;
  uploadTimestamp: string;
  overallRiskScore: number;
  status: 'PROCESSING' | 'COMPLETED' | 'NEEDS_REVIEW' | 'FAILED';
  summary: string;
  ruleMatches: ComplianceRuleMatch[];
  waiverRequired: boolean;
  waiverDraftText?: string;
}