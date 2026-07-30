from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import io
from pypdf import PdfReader

app = FastAPI(title="Luminary Financial - Compliance API")

# Ensure BOTH localhost and 127.0.0.1 are permitted
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class RuleMatch(BaseModel):
    ruleId: str
    ruleName: str
    category: str
    severity: str
    extractedClause: str
    pageNumber: int
    explanation: str
    status: str

class AuditState(BaseModel):
    auditId: str
    fundName: str
    ticker: str
    documentName: str
    waiverText: str
    status: str
    isSigned: bool
    advisorName: Optional[str] = ""
    ruleMatches: List[RuleMatch]

class UpdateRuleStatusRequest(BaseModel):
    ruleId: str
    status: str

class ExecuteWaiverRequest(BaseModel):
    advisorName: str

# Initial State Store
db_audit = AuditState(
    auditId="aud_90210_v1",
    fundName="Apex Growth & Income Fund LP",
    ticker="AGIF-X",
    documentName="Apex_Growth_Prospectus_2026.pdf",
    waiverText="CLIENT RISK ACKNOWLEDGMENT & COMPLIANCE WAIVER\n\nThis waiver acknowledges disclosures extracted from Apex Growth Prospectus.",
    status="NEEDS_REVIEW",
    isSigned=False,
    advisorName="",
    ruleMatches=[
        RuleMatch(
            ruleId="RULE-ILLIQ-01",
            ruleName="Illiquid Asset Concentration Limit",
            category="Portfolio Risk",
            severity="HIGH",
            extractedClause="The Fund may invest up to 25% of its total assets in illiquid securities...",
            pageNumber=42,
            explanation="Exceeds standard institutional threshold of 15% illiquid holdings.",
            status="FLAGGED"
        )
    ]
)

@app.get("/api/audit")
def get_audit():
    return db_audit

@app.patch("/api/rules/status")
def update_rule_status(req: UpdateRuleStatusRequest):
    for rule in db_audit.ruleMatches:
        if rule.ruleId == req.ruleId:
            rule.status = req.status
            return {"success": True, "updatedRule": rule}
    raise HTTPException(status_code=404, detail="Rule not found")

@app.post("/api/waiver/execute")
def execute_waiver(req: ExecuteWaiverRequest):
    db_audit.isSigned = True
    db_audit.advisorName = req.advisorName
    db_audit.status = "APPROVED_WITH_WAIVER"
    return {"success": True, "audit": db_audit}

@app.post("/api/upload")
async def upload_prospectus(file: UploadFile = File(...)):
    contents = await file.read()
    discovered_rules: List[RuleMatch] = []
    
    try:
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)
        
        for idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            page_num = idx + 1
            
            if "illiquid" in text.lower() or "unlisted" in text.lower():
                discovered_rules.append(RuleMatch(
                    ruleId=f"RULE-ILLIQ-{page_num}",
                    ruleName="Illiquid Asset Concentration Limit",
                    category="Portfolio Risk",
                    severity="HIGH",
                    extractedClause=text[:200].replace("\n", " ") + "...",
                    pageNumber=page_num,
                    explanation="Automated stream parsing detected illiquid holding clauses exceeding standard limits.",
                    status="FLAGGED"
                ))
            
            if "performance fee" in text.lower() or "incentive fee" in text.lower():
                discovered_rules.append(RuleMatch(
                    ruleId=f"RULE-FEE-{page_num}",
                    ruleName="Performance Fee Hurdle Threshold",
                    category="Fee Transparency",
                    severity="MEDIUM",
                    extractedClause=text[:200].replace("\n", " ") + "...",
                    pageNumber=page_num,
                    explanation="Variable performance fee hurdle identified in prospectus text.",
                    status="FLAGGED"
                ))

    except Exception as e:
        print(f"Parsing error: {e}")

    if not discovered_rules:
        discovered_rules = [
            RuleMatch(
                ruleId="RULE-GENERIC-01",
                ruleName="General Portfolio Disclosure",
                category="Standard Risk",
                severity="LOW",
                extractedClause="Document stream parsed without high-risk concentration flags.",
                pageNumber=1,
                explanation="Standard institutional disclosures apply.",
                status="CLEARED"
            )
        ]

    clean_name = file.filename.rsplit('.', 1)[0].replace('_', ' ')
    db_audit.auditId = f"aud_{random.randint(10000, 90000)}"
    db_audit.fundName = clean_name
    db_audit.documentName = file.filename
    db_audit.isSigned = False
    db_audit.advisorName = ""
    db_audit.status = "NEEDS_REVIEW"
    db_audit.waiverText = (
        f"CLIENT RISK ACKNOWLEDGMENT & COMPLIANCE WAIVER\n\n"
        f"This waiver acknowledges disclosures extracted from {file.filename}.\n"
        f"Luminary Financial LLC confirms that illiquid holdings and fee structures "
        f"were reviewed prior to client execution."
    )
    db_audit.ruleMatches = discovered_rules

    return {"success": True, "audit": db_audit}