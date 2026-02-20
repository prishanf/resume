---
title: "AI Data & Security Governance Checklist: A Practical Guide by Organisation Type"
description: "A comprehensive, actionable governance checklist for deploying AI tools responsibly — tailored specifically for Enterprise, Small Business, Government, Healthcare, and Financial Services organisations."
date: 2026-02-20
excerpt: "Before your organisation sends a single prompt to an AI tool, there are questions your legal, security, and compliance teams need to answer. This checklist makes that process systematic — and specific to your industry."
image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
tags: ["AI Governance", "Data Security", "Compliance", "Enterprise AI", "Healthcare AI", "FinTech", "Government AI", "SMB", "Risk Management", "GDPR", "HIPAA"]
published: true
---

# AI Data & Security Governance Checklist: A Practical Guide by Organisation Type

*Deploying AI responsibly isn't a single conversation — it's a structured process. This checklist gives legal, security, IT, and compliance teams a practical framework for evaluating AI tools before deployment, organised by the unique regulatory and risk context of each organisation type.*

---

## How to Use This Checklist

Every section is structured around four governance layers that apply universally, regardless of organisation type:

1. **Data Classification** — What data will touch the AI system, and how sensitive is it?
2. **Vendor Assessment** — Does the vendor meet your legal and security requirements?
3. **Access & Controls** — Who can use the AI tool, under what conditions?
4. **Compliance & Regulation** — What laws, frameworks, or standards govern your use case?





### Workflow
Start with the **Universal Baseline Checklist** (applies to all organisations), then move to the section specific to your organisation type.

**What the markers mean:**

| Marker | Meaning |
|--------|--------|
| 🔴 | **Critical blocker** — do not proceed without resolving these. |
| 🟡 | **Strongly recommended** — address where possible. |
| 🟢 | **Best practice** — adopt where resources allow. |

**Key terms and acronyms** (used throughout this checklist):
- **DPA** — Data Processing Addendum: a contract governing how a vendor processes personal data on your behalf (required under GDPR and similar laws).
- **BAA** — Business Associate Agreement: under US HIPAA, a contract required when a vendor handles Protected Health Information (PHI).
- **SCCs** — Standard Contractual Clauses: EU-approved clauses for lawful cross-border transfer of personal data under GDPR.
- **DPIA / PIA** — Data Protection Impact Assessment / Privacy Impact Assessment: a structured assessment of privacy risks before deploying a system that processes personal data.
- **PHI** — Protected Health Information: individually identifiable health information, regulated under HIPAA in the US and equivalent frameworks elsewhere.
- **SSO** — Single Sign-On. **RBAC** — Role-Based Access Control. **SIEM** — Security Information and Event Management.

---

## Universal Baseline Checklist
*Apply this to every AI deployment, regardless of organisation type.*

### Data Classification
- 🔴 Have you identified what categories of data will be sent to the AI tool (personal data, proprietary business data, confidential communications)?
- 🔴 Do you have a data classification policy that labels data as Public, Internal, Confidential, or Restricted — and does it explicitly address AI tools?
- 🟡 Have you established a policy on what data employees are *not* permitted to input into AI systems (e.g. PII, financial records, credentials)?
- 🟡 Is there a process for employees to flag uncertainty about whether a given data type is permitted in AI tools?

### Vendor Assessment
- 🔴 Has the vendor provided a Data Processing Addendum (DPA) that you have reviewed and signed?
- 🔴 Do you understand where your data is stored, for how long, and who has access to it at the vendor?
- 🔴 Has the vendor confirmed whether your data is used for AI model training, and have you opted out if required?
- 🟡 Does the vendor hold relevant security certifications (SOC 2 Type II, ISO 27001, CSA STAR)?
- 🟡 Does the vendor have a published breach notification policy with defined timelines?
- 🟡 Have you reviewed the vendor's subprocessor list to understand the full data supply chain?
- 🟢 Have you reviewed the vendor's transparency and trust documentation (e.g. [Anthropic Trust Portal](https://trust.anthropic.com/), AWS Compliance Centre)?

### Access & Controls
- 🔴 Is access to AI tools restricted to authorised users via SSO or identity management (e.g. Azure AD, Okta)?
- 🔴 Is there a process for revoking access when employees leave the organisation?
- 🟡 Are usage logs being captured so you know who used the AI tool, when, and for what purpose?
- 🟡 Have you defined acceptable use guidelines for AI tools and communicated them to all users?
- 🟢 Is there a review process for AI-generated outputs before they are used in business-critical decisions?

### Compliance & Regulation
- 🔴 Have your legal and compliance teams reviewed the vendor's terms of service and commercial agreements?
- 🟡 Have you conducted a Data Protection Impact Assessment (DPIA) or Privacy Impact Assessment (PIA) for the AI deployment?
- 🟡 Is there an incident response plan that covers AI-related data breaches or misuse?
- 🟢 Has the AI governance framework been reviewed by your board or executive leadership?

---

## Enterprise (Large Commercial Organisation)

*Enterprises typically have complex data environments, international operations, large workforces, and existing SaaS ecosystems. The primary risks are data sprawl, inconsistent adoption across business units, and cross-border data flows.*

### Data Classification
- 🔴 Have you mapped which business units will use AI tools and what data types each unit will interact with?
- 🔴 Is there a central data governance function (CDO or equivalent) that has approved the AI deployment?
- 🟡 Have you assessed whether AI tool usage across departments creates data aggregation risks — i.e. combining data from multiple systems in a single prompt?
- 🟡 Are there controls preventing employees from uploading data from systems governed by stricter retention policies (e.g. legal hold data, M&A-related documents)?
- 🟢 Is your data classification policy integrated into your DLP (Data Loss Prevention) tooling so that restricted data is flagged before it reaches an AI tool?

### Vendor Assessment
- 🔴 Does the vendor support enterprise SSO and SCIM provisioning for user lifecycle management at scale?
- 🔴 Have you negotiated data residency requirements into the commercial contract, specifying where data is stored geographically?
- 🟡 Does the vendor offer a dedicated enterprise instance or private deployment option (e.g. Amazon Bedrock, Azure OpenAI Service, Google Vertex AI) that keeps data within your existing cloud environment?
- 🟡 Does the vendor participate in enterprise procurement frameworks your organisation uses (e.g. AWS Marketplace, Microsoft commercial agreements)?
- 🟢 Has the vendor completed your organisation's standard third-party risk assessment questionnaire (e.g. SIG, CAIQ)?

### Access & Controls
- 🔴 Is AI tool access governed by your existing IAM policy, including role-based access control (RBAC)?
- 🔴 Is there a formal approval workflow for new AI tool procurement, preventing shadow IT adoption?
- 🟡 Are AI usage logs integrated into your SIEM (Security Information and Event Management) platform?
- 🟡 Have you established a Centre of Excellence or AI steering committee to govern adoption and share best practices?
- 🟢 Are you using API-based access rather than consumer UI interfaces for sensitive workloads, to retain programmatic control?

### Compliance & Regulation
- 🔴 If operating in the EU, have you confirmed the vendor provides Standard Contractual Clauses (SCCs) for cross-border data transfers under GDPR?
- 🟡 Have you reviewed obligations under the EU AI Act, particularly if the AI system is used in high-risk contexts (HR decisions, credit scoring, access control)?
- 🟡 Does your enterprise risk register include AI-specific risks?
- 🟢 Have you mapped AI usage against industry-specific regulations (e.g. FCA/PRA guidance for financial services, FDA guidance for healthcare-adjacent use cases)?

**Key References:**
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
- [Anthropic Data Processing Addendum](https://www.anthropic.com/legal/data-processing-addendum)
- [EU AI Act Overview](https://artificialintelligenceact.eu/)
- [GDPR SCCs](https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en)

---

## Small Business (SMB)

*Small businesses often lack dedicated security or legal teams, making AI adoption simultaneously easier (less bureaucracy) and riskier (less oversight). The priority is simple, enforceable policies that don't require specialist resources to implement.*

### Data Classification
- 🔴 Have you identified the most sensitive data your business holds (customer records, payment information, employee data, contracts) and established a rule that this data does not go into consumer AI tools?
- 🟡 Have you created a simple one-page "AI Acceptable Use Policy" that tells staff what they can and cannot do with AI tools?
- 🟡 Do you understand whether your clients' data is subject to privacy laws (GDPR, Australian Privacy Act, CCPA) that restrict how you can use or share it?
- 🟢 Have you considered whether AI-generated content in client-facing work needs to be disclosed?

### Vendor Assessment
- 🔴 Are you using the business or team tier of AI tools rather than free consumer plans, so that a DPA is in place?
- 🟡 Have you read the privacy policy of every AI tool your staff use — including free browser extensions and productivity add-ons?
- 🟡 Have you checked that the AI vendor does not use your data for model training by default, and opted out if needed?
- 🟢 If you handle EU citizen data, does the vendor offer GDPR-compliant terms even on SMB plans?

### Access & Controls
- 🔴 Are staff using business accounts for AI tools rather than personal accounts, so that usage stays within organisational control?
- 🟡 Do you have a process for managing access if a staff member leaves — including revoking AI tool accounts promptly?
- 🟢 Consider using one approved AI platform rather than allowing staff to adopt any tool they choose — this limits your vendor risk surface.

### Compliance & Regulation
- 🟡 If you operate in a regulated industry (even as a small provider), check whether AI tool usage triggers compliance obligations — e.g. a small accounting firm is still subject to client confidentiality rules.
- 🟡 Does your professional indemnity or cyber insurance policy address AI-related incidents?
- 🟢 Stay informed about AI-specific regulations emerging in your jurisdiction — the pace of regulatory change is fast.

**Key References:**
- [NCSC (UK) SMB Cyber Security Guidance](https://www.ncsc.gov.uk/section/information-for/small-medium-sized-organisations)
- [Australian Privacy Act — Small Business Guide](https://www.oaic.gov.au/privacy/your-privacy-rights/small-business)
- [CCPA for Small Businesses](https://cppa.ca.gov/)

---

## Government & Public Sector

*Government agencies face the highest scrutiny around data handling, often manage citizen data at massive scale, and operate under strict procurement and security frameworks. Shadow AI adoption is a significant risk, and any AI deployment typically requires formal approval processes.*

### Data Classification
- 🔴 Has the data to be processed by AI been formally classified under your agency's security classification framework (e.g. OFFICIAL, SENSITIVE, SECRET in Australian government; UNCLASSIFIED through SECRET in US Federal)?
- 🔴 Is the AI system prohibited from processing data above a specific classification level, and is this technically enforced — not just policy-reliant?
- 🔴 Is citizen-identifiable data (names, addresses, tax IDs, benefit records) explicitly excluded from AI tool inputs unless the system has been formally approved for that data type?
- 🟡 Have you conducted a formal risk assessment under your government's AI ethics and risk framework (e.g. Australia's AI Ethics Principles, US Executive Order on AI, UK AI Regulation framework)?

### Vendor Assessment
- 🔴 Is the AI vendor listed on your government's approved supplier register or equivalent (e.g. AusCyber, UK G-Cloud, US FedRAMP)?
- 🔴 Does the vendor hold government-specific certifications required in your jurisdiction (e.g. FedRAMP Moderate/High for US federal, IRAP for Australian government, Cyber Essentials Plus for UK government)?
- 🔴 Is data sovereignty guaranteed — meaning citizen data does not leave the country or specified region?
- 🟡 Has the vendor undergone a government-specific security assessment, not just commercial SOC 2?
- 🟢 Consider sovereign AI cloud options (e.g. AWS GovCloud, Azure Government, Google Public Sector) that are purpose-built for government data requirements.

### Access & Controls
- 🔴 Is access to AI tools restricted to government-issued devices and government identity credentials?
- 🔴 Is there a complete audit trail of all AI interactions for records management and Freedom of Information (FOI) compliance?
- 🟡 Have you established whether AI-generated outputs used in decisions affecting citizens constitute an official government record, and if so, how they must be stored and disclosed?
- 🟡 Is there human review required before any AI-generated output influences a decision affecting citizen rights or entitlements?
- 🟢 Is AI usage monitored for misuse or exfiltration of sensitive government information?

### Compliance & Regulation
- 🔴 Does the AI deployment comply with your government's procurement regulations — has it gone through appropriate tender or panel processes?
- 🔴 Have you assessed obligations under public records legislation — AI interaction logs may be subject to retention requirements or FOI requests?
- 🟡 Have you considered algorithmic transparency obligations — in some jurisdictions, citizens have the right to know when AI influenced a decision about them?
- 🟢 Engage your agency's legal counsel and privacy commissioner early — don't treat AI governance as an IT project alone.

**Key References:**
- [US NIST AI Risk Management Framework](https://www.nist.gov/system/files/documents/2023/01/26/AI%20RMF%201.0.pdf)
- [UK Government AI Framework](https://www.gov.uk/government/publications/ai-framework-for-the-uk-government)
- [Australian Government AI Ethics Principles](https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework)
- [FedRAMP Marketplace](https://marketplace.fedramp.gov/)

---

## Healthcare

*Healthcare organisations face some of the strictest data protection requirements globally. Patient data is among the most sensitive data type in existence, and the consequences of a breach — financial, legal, and human — are severe. AI adoption in healthcare is accelerating, which makes governance even more urgent.*

### Data Classification
- 🔴 Have you identified whether any data sent to an AI tool constitutes Protected Health Information (PHI) under HIPAA, or equivalent under your national framework (e.g. My Health Records Act in Australia, NHS Data Security Standards in the UK)?
- 🔴 Is there a technical or policy control preventing clinical data, patient records, diagnostic information, or any individually identifiable health information from being entered into non-approved AI tools?
- 🔴 Have you de-identified data appropriately (per HIPAA Safe Harbor or Expert Determination methods) before using it in any AI context that hasn't been specifically approved for PHI?
- 🟡 Is there a clear policy distinguishing between administrative AI use (scheduling, billing, HR) and clinical AI use — with different governance requirements for each?

### Vendor Assessment
- 🔴 Has the AI vendor signed a Business Associate Agreement (BAA) as required under HIPAA? Without a signed BAA, using PHI with that vendor is a HIPAA violation.
- 🔴 Does the vendor's infrastructure comply with HIPAA Security Rule requirements for administrative, physical, and technical safeguards?
- 🟡 Has the vendor undergone a healthcare-specific security assessment or HITRUST certification?
- 🟡 Is the vendor's data retention policy compatible with your jurisdiction's health record retention requirements?
- 🟢 For clinical AI tools (diagnostic support, imaging analysis, clinical decision support), has the tool been assessed against medical device regulations where applicable (e.g. FDA SaMD guidance, TGA in Australia)?

### Access & Controls
- 🔴 Is access to AI tools with PHI exposure limited to clinical and administrative staff with a legitimate need, consistent with minimum necessary standards under HIPAA?
- 🔴 Are AI interactions involving patient data logged with sufficient detail to support breach investigation if required?
- 🟡 Is there a process for patients to be informed if AI tools were used in their care or in processing their data?
- 🟢 For clinical decision support AI, is there mandatory clinician review before any AI output influences patient care?

### Compliance & Regulation
- 🔴 Has your Privacy Officer reviewed the AI deployment against HIPAA Privacy and Security Rules (US), GDPR health data provisions (EU), or equivalent national health data legislation?
- 🔴 If the AI tool constitutes a clinical decision support tool or medical device, has it undergone appropriate regulatory clearance?
- 🟡 Does your AI deployment plan address the ONC's information blocking rules and patient data access rights?
- 🟢 Have you reviewed the HHS Office for Civil Rights guidance on AI and HIPAA?

**Key References:**
- [HHS HIPAA and Cloud Computing Guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/cloud-computing/index.html)
- [HITRUST Alliance](https://hitrustalliance.net/)
- [FDA Guidance on AI/ML-Based Software as a Medical Device](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device)
- [NHS Data Security and Protection Toolkit](https://www.dsptoolkit.nhs.uk/)

---

## Financial Services

*Financial services organisations operate under some of the most comprehensive regulatory regimes in the world. AI introduces specific risks around model explainability, fairness, and auditability that go well beyond general data security. Regulators are actively developing AI-specific guidance, and enforcement is accelerating.*

### Data Classification
- 🔴 Have you identified whether data sent to AI tools constitutes non-public material information (MNPI), and is there a control preventing this from reaching external AI systems where it could create insider trading or market manipulation risks?
- 🔴 Is customer financial data — account numbers, transaction history, credit scores, investment positions — explicitly excluded from consumer or non-approved AI tools?
- 🟡 Have you assessed whether AI usage in customer interactions (chatbots, automated advice) triggers financial advice regulations in your jurisdiction?
- 🟡 Is there a policy governing AI use in credit decisions, fraud detection, or KYC/AML processes — where fairness and explainability obligations apply?

### Vendor Assessment
- 🔴 Has the vendor undergone a financial services-grade third-party risk assessment, aligned to frameworks such as the EBA ICT Risk Framework, MAS TRM Guidelines, APRA CPS 234, or the FFIEC IT Examination Handbook?
- 🔴 Does the vendor provide contractual commitments on data residency that satisfy your regulatory requirements — e.g. that EU customer data stays within the EU?
- 🟡 Does the vendor maintain operational resilience standards consistent with your regulatory expectations (recovery time objectives, incident response SLAs)?
- 🟢 Has the vendor been assessed for concentration risk — i.e. if many financial institutions rely on the same AI provider, a vendor outage creates systemic risk?

### Access & Controls
- 🔴 Is AI usage in regulated activities — trading, lending, insurance underwriting — subject to the same supervisory controls as other model-based decisions, including model risk management (MRM) review?
- 🔴 Are AI-generated outputs that influence financial decisions auditable, explainable, and documentable for regulatory examination purposes?
- 🟡 Is there a model governance framework that applies to AI models used in decision-making, consistent with SR 11-7 (US), SS1/23 (UK PRA), or equivalent guidance?
- 🟡 Are there human-in-the-loop controls for high-impact decisions — loan approvals, large transactions, customer exclusions?
- 🟢 Is AI model performance monitored on an ongoing basis for drift, bias, or unexpected behaviour?

### Compliance & Regulation
- 🔴 Have you assessed the AI deployment against applicable regulations: FCA/PRA (UK), SEC/FINRA (US), ASIC (Australia), MAS (Singapore), ECB/EBA (EU)?
- 🔴 If the AI tool is used in consumer-facing decisions (credit, insurance pricing, investment advice), have you assessed obligations under consumer protection and anti-discrimination laws?
- 🟡 Have you reviewed the Basel Committee on Banking Supervision's principles for operational resilience and their applicability to AI-dependent systems?
- 🟢 Engage your regulator proactively — many financial regulators now have innovation offices or regulatory sandboxes specifically for AI experimentation.

**Key References:**
- [Federal Reserve SR 11-7: Guidance on Model Risk Management](https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm)
- [FCA/PRA AI and Machine Learning Discussion Paper](https://www.bankofengland.co.uk/prudential-regulation/publication/2022/october/artificial-intelligence-and-machine-learning)
- [MAS Principles for AI in Financial Services (FEAT)](https://www.mas.gov.sg/news/media-releases/2019/mas-introduces-principles-to-promote-fairness-ethics-accountability-and-transparency-in-the-use-of-ai)
- [APRA CPS 234 Information Security](https://www.apra.gov.au/sites/default/files/cps_234_july_2019_for_public_release.pdf)

---

## Education

*Education institutions handle data on minors, academic records, and research — each with distinct sensitivity. The growing use of AI in learning raises specific questions about academic integrity and the rights of students.*

### Data Classification
- 🔴 Does any data sent to AI tools include student records protected under FERPA (US), or equivalent student privacy laws in your jurisdiction? If so, a formal agreement with the AI vendor is required before any data is shared.
- 🔴 Is student data involving minors (under 18) subject to additional protections — e.g. COPPA (US), GDPR special provisions for children — and are AI vendors compliant?
- 🟡 Is unpublished research data, grant-funded IP, or commercially sensitive academic work excluded from AI tools until institutional data governance approval is obtained?
- 🟢 Have you established a policy on student use of AI tools in academic work, including disclosure requirements and academic integrity implications?

### Vendor Assessment
- 🔴 Does the vendor offer education-specific data agreements (e.g. Google Workspace for Education DPA, Microsoft Education agreements) that include explicit student data protections?
- 🟢 Is there institutional-level oversight of AI tool procurement to prevent individual academics or departments from adopting tools that violate student data protections?

### Access & Controls
- 🔴 Is access to AI tools that handle student data restricted to staff and systems with a legitimate educational purpose, and are student accounts (where applicable) governed by the same privacy safeguards?
- 🟡 Are AI usage logs retained in line with student record retention and potential FERPA/FOI obligations?

### Compliance & Regulation
- 🟡 Have you reviewed obligations under state-level student privacy laws if operating in the US (e.g. SOPIPA in California)?
- 🟢 Stay informed about emerging guidance on AI in education from your education authority or data protection regulator.

**Key References:**
- [FERPA (Family Educational Rights and Privacy Act)](https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html)
- [COPPA (Children's Online Privacy Protection Rule)](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
- [Student Privacy Resource (SOPIPA and state laws)](https://studentprivacy.ed.gov/)

---

## Summary Comparison Table

| Governance Area | Enterprise | SMB | Government | Healthcare | Financial Services | Education |
|---|---|---|---|---|---|---|
| Data classification policy | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required |
| Signed DPA with vendor | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required |
| Model training opt-out | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required |
| BAA (HIPAA) | ➖ N/A | ➖ Context | ➖ Context | 🔴 Required | ➖ Context | ➖ Context |
| Education data agreement (e.g. FERPA) | ➖ N/A | ➖ N/A | ➖ Context | ➖ N/A | ➖ N/A | 🔴 Required |
| FedRAMP / Gov Certification | ➖ Context | ➖ N/A | 🔴 Required | ➖ Context | ➖ Context | ➖ N/A |
| SOC 2 Type II | 🟡 Recommended | 🟢 Best practice | 🔴 Required | 🔴 Required | 🔴 Required | 🟡 Recommended |
| Data residency controls | 🔴 Required | 🟡 Recommended | 🔴 Required | 🔴 Required | 🔴 Required | 🟡 Recommended |
| DPIA / PIA | 🟡 Recommended | 🟡 Recommended | 🔴 Required | 🔴 Required | 🔴 Required | 🟡 Recommended |
| Model risk governance | 🟡 Recommended | 🟢 Best practice | 🟡 Recommended | 🟡 Recommended | 🔴 Required | ➖ N/A |
| Human-in-the-loop controls | 🟡 Recommended | 🟢 Best practice | 🔴 Required | 🔴 Required | 🔴 Required | 🟡 Recommended |
| AI acceptable use policy | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required | 🔴 Required |
| Audit logging of AI usage | 🟡 Recommended | 🟢 Best practice | 🔴 Required | 🔴 Required | 🔴 Required | 🟡 Recommended |

*🔴 Critical / Required &nbsp;&nbsp; 🟡 Strongly Recommended &nbsp;&nbsp; 🟢 Best Practice &nbsp;&nbsp; ➖ Context-dependent or Not Applicable*

---

## Universal References

**AI Governance Frameworks**
- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework)
- [ISO/IEC 42001 — AI Management Systems Standard](https://www.iso.org/standard/81230.html)
- [EU AI Act](https://artificialintelligenceact.eu/)
- [OECD AI Principles](https://oecd.ai/en/ai-principles)

**Anthropic-Specific Documentation**
- [Anthropic Trust Portal](https://trust.anthropic.com/)
- [Anthropic Data Processing Addendum](https://www.anthropic.com/legal/data-processing-addendum)
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
- [Anthropic Transparency](https://www.anthropic.com/transparency)

**Cloud Provider Trust & Compliance**
- [AWS Compliance Centre](https://aws.amazon.com/compliance/)
- [Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center)
- [Google Cloud Compliance](https://cloud.google.com/compliance)
- [Salesforce Trust](https://www.salesforce.com/company/trust/)

---

*This checklist is intended as a practical governance starting point and does not constitute legal advice. Organisations should engage qualified legal, privacy, and security professionals to adapt these frameworks to their specific regulatory context and risk profile.*
