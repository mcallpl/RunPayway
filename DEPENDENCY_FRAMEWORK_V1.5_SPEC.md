# RunPayway™ Dependency Framework V1.5
## Implementation-Ready Specification

**Date**: June 17, 2026  
**Version**: V1.5 (Enhancement to V1.0)  
**Status**: READY FOR DEVELOPMENT  
**Scope**: Add dependency architecture without modifying RP-2.0  
**Release Timeline**: 2–3 weeks  

---

# ARCHITECTURE OVERVIEW

## The 3-Layer Model

### Layer 1: Dependency Types
Foundational classification of income sources.

### Layer 2: Dependency Composition
Backend analytical layer. Calculated automatically. Stored. Used for derivation and auditability.

### Layer 3: Primary Dependency Hierarchy
Customer-facing default. Shows priority structure. Replaces MIXED.

**Key Principle**: Layer 2 exists in backend. Layer 3 is customer-facing default. Layer 2 shown only when it materially improves clarity.

---

# PART 1: BACKEND SCHEMA

## Data Model

```typescript
interface DependencyProfile {
  // Layer 1: Dependency Types
  income_types: IncomeTypeBreakdown[];

  // Layer 2: Dependency Composition (backend)
  dependency_composition: DependencyComposition;

  // Layer 3: Primary + Secondary Hierarchy
  primary_dependency: PrimaryDependency;
  secondary_dependencies: SecondaryDependency[];

  // Metadata
  derived_at: timestamp;
  derived_from_rp2_snapshot: string; // snapshot ID for auditability
  classification_notes: string; // edge case documentation
}

interface IncomeTypeBreakdown {
  income_source_id: string;
  income_source_name: string;
  earnings_annual: number;
  earnings_monthly_avg: number;
  type: DependencyType;
  stability_period: number; // months of consistent history
}

interface DependencyComposition {
  // Layer 2: The analytical breakdown
  by_type: {
    [key in DependencyType]: {
      total_earnings: number;
      percentage_of_total: number; // 0.0 to 1.0
      source_count: number;
      largest_source_pct: number; // concentration within this type
      stability_score: number; // 0–1, derived from RP-2.0
      variability_score: number; // 0–1, derived from RP-2.0
    }
  };
  
  total_earnings: number;
  source_count: number;
  type_count: number; // how many types represented
  
  // Derived metrics for auditability
  concentration_gini: number; // 0–1, concentration metric
  diversification_index: number; // 0–1, inverse of concentration
  labor_vs_passive_ratio: number; // 0–1, from RP-2.0
  
  // Tracking
  created_at: timestamp;
  source_data_version: string; // RP-2.0 version used
}

interface PrimaryDependency {
  // Layer 3: Customer-facing primary
  type: DependencyType;
  percentage: number; // 0.0 to 1.0
  annual_earnings: number;
  label: string; // Human-readable ("Employment", "Client-Based", etc.)
}

interface SecondaryDependency {
  type: DependencyType;
  percentage: number; // 0.0 to 1.0
  annual_earnings: number;
  label: string;
  rank: number; // 1 (first secondary), 2 (second secondary), etc.
}
```

---

# PART 2: ENUM STRUCTURE

## Dependency Type Enum

```typescript
enum DependencyType {
  EMPLOYER = "employer",         // W-2, employment income
  CLIENT = "client",             // 1099, consulting retainers/retainer-like
  PLATFORM = "platform",         // Gig platform (Upwork, DoorDash, Uber, etc.)
  TRANSACTION = "transaction",   // Commission, deal-based, project-based
  ASSET = "asset"                // Passive: rental, AUM, royalties, dividends
}
```

## Classification Rules

**EMPLOYER**: 
- W-2 employment income
- Salary, wages, bonuses (paid by employer)
- Include: 401k match, benefits, stock grants (equity compensation)
- Exclude: Freelance work, 1099 commissions

**CLIENT**: 
- 1099 income from consulting retainers or recurring client relationships
- Key: Relationship-dependent (losing client = losing revenue)
- Include: Consulting retainers, retainer-like contracts
- Include: Law firm partnerships, accounting partnerships
- Exclude: One-off project work (→ TRANSACTION)
- Exclude: Platform-mediated work (→ PLATFORM)

**PLATFORM**: 
- Gig platform-sourced income
- Key: Algorithm-dependent (platform controls access)
- Include: Upwork, Fiverr, DoorDash, Uber, Airbnb, Etsy, Amazon Marketplace
- Include: Staffing platforms (Medtech, nursing gigs)
- Exclude: One-off client projects not on platform (→ TRANSACTION)
- Exclude: Retainer clients found through platform but directly managed (→ CLIENT)

**TRANSACTION**: 
- Deal-based, commission-based, project-based income
- Key: Transactional (each deal = revenue; no deal = no revenue)
- Include: Real estate commissions, sales commissions, deal flow
- Include: One-off project work (consulting projects, freelance projects)
- Include: Royalties (per-transaction model)
- Exclude: Recurring retainers (→ CLIENT)
- Exclude: Platform-mediated gigs (→ PLATFORM)

**ASSET**: 
- Passive, ownership-based income
- Key: Asset-dependent (asset generates revenue)
- Include: Rental property income, AUM fees (asset management)
- Include: Dividend income, interest income
- Include: Royalties (recurring per-unit model)
- Include: REITs, structured returns
- Exclude: Labor-based income (→ other types)

---

# PART 3: DERIVATION LOGIC

## Step 1: Classify All Income Sources

**Input**: RP-2.0 income sources (already classified in RP-2.0 schema)

**Process**:
```
FOR EACH income_source IN customer.income_sources:
  IF source_type NOT IN {employer, client, platform, transaction, asset}:
    CLASSIFY using rules above
  ELSE:
    USE existing source_type
  
  ADD to income_types array
```

**Output**: income_types array with classifications

---

## Step 2: Calculate Dependency Composition (Layer 2)

**Input**: 
- income_types array
- RP-2.0 factors (earnings_variability_score, labor_dependence_pct, etc.)

**Process**:

```
AGGREGATE by DependencyType:
  FOR EACH type IN {employer, client, platform, transaction, asset}:
    total_earnings = SUM(earnings FOR source WHERE type = type)
    source_count = COUNT(sources WHERE type = type)
    percentage = total_earnings / TOTAL_EARNINGS
    largest_source_pct = MAX(source_earnings) / total_earnings
    
    stability_score = MEDIAN(stability_period FOR sources OF this type)
    variability_score = AVG(earnings_variability_score FOR sources OF this type)

CALCULATE metrics:
  type_count = COUNT(types WITH percentage > 0)
  concentration_gini = GINI_COEFFICIENT(all earnings) [0–1]
  diversification_index = 1 - concentration_gini
  labor_vs_passive_ratio = SUM(labor types) / TOTAL
```

**Example Output**:
```json
{
  "by_type": {
    "employer": {
      "total_earnings": 80000,
      "percentage_of_total": 0.571,
      "source_count": 1,
      "largest_source_pct": 1.0,
      "stability_score": 0.95,
      "variability_score": 0.1
    },
    "asset": {
      "total_earnings": 40000,
      "percentage_of_total": 0.286,
      "source_count": 1,
      "largest_source_pct": 1.0,
      "stability_score": 0.8,
      "variability_score": 0.35
    },
    "transaction": {
      "total_earnings": 20000,
      "percentage_of_total": 0.143,
      "source_count": 1,
      "largest_source_pct": 1.0,
      "stability_score": 0.6,
      "variability_score": 0.6
    }
  },
  "total_earnings": 140000,
  "type_count": 3,
  "diversification_index": 0.65
}
```

**Output**: dependency_composition object

---

## Step 3: Derive Primary + Secondary Hierarchy (Layer 3)

**Input**: dependency_composition

**Process**:

```
SORT types by percentage_of_total (descending):
  types_sorted = SORT(by_type, key=percentage_of_total)

PRIMARY:
  primary_type = types_sorted[0]
  primary_percentage = primary_type.percentage_of_total
  primary_earnings = primary_type.total_earnings

SECONDARY:
  secondary_types = []
  FOR EACH type IN types_sorted[1:]:
    IF type.percentage_of_total > THRESHOLD (e.g., 2%):
      secondary_types.APPEND({
        type: type,
        percentage: type.percentage_of_total,
        earnings: type.total_earnings,
        rank: index
      })
```

**Secondary Threshold**: Show secondary types only if ≥2% of total income. 
- Reason: Ignore trivial income sources (occasional freelance = 0.5% of total is noise)
- Rationale: Keeps hierarchy focused on material risks

**Example**:
```
Primary: Employer (57.1%)
Secondary: Asset (28.6%), Transaction (14.3%)
```

**Output**: primary_dependency + secondary_dependencies array

---

# PART 4: DISPLAY RULES

## Rule 1: When to Show Composition (Layer 2)

**Show Composition if ANY of these conditions are true**:

✅ **SHOW composition if**:
1. Customer has 3+ types (genuinely complex structure)
2. Customer requested "See detailed breakdown" (opt-in)
3. Advisor viewing report (B2B context)
4. Enterprise/institutional report (API)
5. Customer classification has edge case notes (auditability)
6. Composition materially differs from RP-2.0 largest_source_pct (inconsistency flag)

✅ **SHOW composition breakdown specifically for**:
- Multi-earner households (show per-earner + household summary)
- Seasonal workers (show composition + seasonality context)
- Customers with 2+ secondary types (show why secondary types matter)

---

## Rule 2: When NOT to Show Composition (Layer 2)

❌ **HIDE composition if**:
1. Single-type customer (composition = "100%"; just adds clutter)
2. Two-type customer with one <5% (composition = "95% + 5%"; hierarchy already shows this)
3. Consumer default report (keep simple)
4. Mobile report (limited screen space)
5. Quick assessment view (not deep-dive)

---

## Rule 3: Always Show Hierarchy (Layer 3)

✅ **ALWAYS show**:
- Primary Dependency (with percentage and label)
- Secondary Dependencies (if any)
- Decision-type-specific interpretation
- No composition unless explicitly requested or flagged

---

# PART 5: DISPLAY LOGIC PSEUDOCODE

```typescript
function renderDependencySection(customer, context) {
  const composition = customer.dependency.dependency_composition;
  const hierarchy = {
    primary: customer.dependency.primary_dependency,
    secondary: customer.dependency.secondary_dependencies
  };

  // Determine what to show
  const showComposition = shouldShowComposition(customer, context);
  
  // Always render hierarchy
  renderHierarchy(hierarchy, context);
  
  // Conditionally render composition
  if (showComposition) {
    renderCompositionBreakdown(composition, context);
  } else if (context === "advisor" || context === "enterprise") {
    // Hidden by default in consumer view; show in advisor context
    renderCompositionToggle(); // "See detailed breakdown"
  }
}

function shouldShowComposition(customer, context) {
  // Consumer default view
  if (context === "consumer_default") {
    const typeCount = customer.dependency.dependency_composition.type_count;
    return typeCount >= 3; // Only for genuinely complex
  }
  
  // Advisor/enterprise always sees composition
  if (context === "advisor" || context === "enterprise") {
    return true;
  }
  
  // Opt-in view
  if (customer.preferences.show_detailed_breakdown === true) {
    return true;
  }
  
  // Edge case flagged
  if (customer.dependency.classification_notes) {
    return true;
  }
  
  // Default: hide
  return false;
}
```

---

# PART 6: EXAMPLES ACROSS 8 TEST PROFILES

## Profile 1: Software Sales Engineer

**Income Structure**: W-2 $100k + Bonus $20k

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {
      "income_source_id": "emp_001",
      "income_source_name": "Employer W-2 + Bonus",
      "earnings_annual": 120000,
      "type": "employer"
    }
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "employer": {
        "total_earnings": 120000,
        "percentage_of_total": 1.0,
        "source_count": 1,
        "stability_score": 0.95
      }
    },
    "type_count": 1,
    "diversification_index": 0.0
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "employer",
    "percentage": 1.0,
    "annual_earnings": 120000,
    "label": "Employment"
  },
  "secondary_dependencies": []
}
```

### Display Logic
- **showComposition**: FALSE (single-type, composition adds no value)
- **Consumer view**: Show hierarchy only
- **Advisor view**: Can toggle to see composition, but hierarchy is primary

### Customer-Facing Report
```
DEPENDENCY STRUCTURE

Your income is employment-dependent.

Primary Income: Employment ($120,000 annually)

PRIMARY RISK: Job loss = 100% income impact

FOR YOUR HOME PURCHASE:
Your employment income is stable and straightforward. 
Lenders prioritize W-2 income stability. Your income 
is a strong foundation for qualification.
```

---

## Profile 2: Real Estate Agent

**Income Structure**: Commission-only, $80k annual, 70% from broker A, 30% from broker B

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {
      "income_source_id": "trans_001",
      "income_source_name": "Broker A Commissions",
      "earnings_annual": 56000,
      "type": "transaction"
    },
    {
      "income_source_id": "trans_002",
      "income_source_name": "Broker B Commissions",
      "earnings_annual": 24000,
      "type": "transaction"
    }
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "transaction": {
        "total_earnings": 80000,
        "percentage_of_total": 1.0,
        "source_count": 2,
        "largest_source_pct": 0.70,
        "stability_score": 0.55,
        "variability_score": 0.72
      }
    },
    "type_count": 1,
    "diversification_index": 0.3
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "transaction",
    "percentage": 1.0,
    "annual_earnings": 80000,
    "label": "Transaction/Commission-Based"
  },
  "secondary_dependencies": []
}
```

### Display Logic
- **showComposition**: FALSE (single type, composition adds no value)
- **Consumer view**: Show hierarchy only
- **Advisor view**: Can see composition showing transaction concentration breakdown

### Customer-Facing Report
```
DEPENDENCY STRUCTURE

Your income is transaction-dependent (commission-based).

Primary Income: Commissions ($80,000 annually)

PRIMARY RISK: Deal flow loss = 100% income impact
Deal concentration: 70% from primary broker

FOR YOUR HOME PURCHASE:
Lenders assess commission income carefully. Demonstrate 
2-year history and pipeline stability. Variable income 
may require higher qualification thresholds.
```

---

## Profile 3: Financial Advisor

**Income Structure**: W-2 $80k + AUM $40k + Commission $20k

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {
      "income_source_id": "emp_001",
      "income_source_name": "W-2 Salary",
      "earnings_annual": 80000,
      "type": "employer"
    },
    {
      "income_source_id": "asset_001",
      "income_source_name": "AUM Fees",
      "earnings_annual": 40000,
      "type": "asset"
    },
    {
      "income_source_id": "trans_001",
      "income_source_name": "Commissions",
      "earnings_annual": 20000,
      "type": "transaction"
    }
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "employer": {
        "total_earnings": 80000,
        "percentage_of_total": 0.571,
        "source_count": 1,
        "stability_score": 0.95,
        "variability_score": 0.1
      },
      "asset": {
        "total_earnings": 40000,
        "percentage_of_total": 0.286,
        "source_count": 1,
        "stability_score": 0.8,
        "variability_score": 0.35
      },
      "transaction": {
        "total_earnings": 20000,
        "percentage_of_total": 0.143,
        "source_count": 1,
        "stability_score": 0.6,
        "variability_score": 0.6
      }
    },
    "type_count": 3,
    "diversification_index": 0.65
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "employer",
    "percentage": 0.571,
    "annual_earnings": 80000,
    "label": "Employment"
  },
  "secondary_dependencies": [
    {
      "type": "asset",
      "percentage": 0.286,
      "annual_earnings": 40000,
      "label": "Asset-Based (AUM)",
      "rank": 1
    },
    {
      "type": "transaction",
      "percentage": 0.143,
      "annual_earnings": 20000,
      "label": "Transaction-Based (Commission)",
      "rank": 2
    }
  ]
}
```

### Display Logic
- **showComposition**: TRUE (3 types, genuinely complex)
- **Consumer default**: Show hierarchy + optional composition detail
- **Advisor view**: Show both; highlight layered income structure

### Customer-Facing Report (Default)
```
DEPENDENCY STRUCTURE

Your income is primarily employment-dependent with 
supplemental asset and transaction income.

Primary Income: Employment ($80,000, 57%)
Secondary Income: 
  • Asset-Based AUM Fees ($40,000, 29%)
  • Commissions ($20,000, 14%)

PRIMARY RISK: Job loss = 57% income impact
SECONDARY RISKS: Market performance (asset income), 
                 client retention/sales (commission)

FOR YOUR HOME PURCHASE:
Your employment income ($80k) is your mortgage foundation. 
Supplemental income may enhance qualification. Stability 
of secondary income sources matters.
```

### Customer-Facing Report (With Composition - Optional)
```
[As above, plus]

INCOME BREAKDOWN BY TYPE:

Employment:     $80,000 (57%) — Steady W-2 base
Asset-Based:    $40,000 (29%) — Market-dependent
Transaction:    $20,000 (14%) — Sales-dependent

This shows the composition of your income sources, not 
a rating or recommendation. All types are valid income.
```

---

## Profile 4: Consultant

**Income Structure**: 3 retainer clients ($30k, $25k, $20k) + project work ($25k)

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {"income_source_id": "client_001", "income_source_name": "Client A Retainer", "earnings_annual": 30000, "type": "client"},
    {"income_source_id": "client_002", "income_source_name": "Client B Retainer", "earnings_annual": 25000, "type": "client"},
    {"income_source_id": "client_003", "income_source_name": "Client C Retainer", "earnings_annual": 20000, "type": "client"},
    {"income_source_id": "trans_001", "income_source_name": "Project Work", "earnings_annual": 25000, "type": "transaction"}
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "client": {
        "total_earnings": 75000,
        "percentage_of_total": 0.75,
        "source_count": 3,
        "largest_source_pct": 0.40,
        "stability_score": 0.85
      },
      "transaction": {
        "total_earnings": 25000,
        "percentage_of_total": 0.25,
        "source_count": 1,
        "largest_source_pct": 1.0,
        "stability_score": 0.60
      }
    },
    "type_count": 2,
    "diversification_index": 0.5
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "client",
    "percentage": 0.75,
    "annual_earnings": 75000,
    "label": "Client-Based (Retainers)"
  },
  "secondary_dependencies": [
    {
      "type": "transaction",
      "percentage": 0.25,
      "annual_earnings": 25000,
      "label": "Project-Based",
      "rank": 1
    }
  ]
}
```

### Display Logic
- **showComposition**: FALSE (2 types, secondary >5%, but composition doesn't add decision-relevant insight)
- **Consumer default**: Show hierarchy only
- **Advisor view**: Can see composition; note multiple clients within "client" type

### Customer-Facing Report
```
DEPENDENCY STRUCTURE

Your income is primarily client-dependent (retainers) 
with supplemental project income.

Primary Income: Client Retainers ($75,000, 75%)
Secondary Income: Project Work ($25,000, 25%)

PRIMARY RISK: Client concentration
Client A represents 40% of income. Loss of largest 
client = 40% income impact. Mitigated by 3 retainer 
clients and project pipeline.

SECONDARY RISK: Project pipeline volatility

FOR YOUR BUSINESS LAUNCH:
You already manage income diversification across 
multiple clients and revenue types. You understand 
revenue concentration and client retention risks.
```

---

## Profile 5: Physician

**Income Structure**: W-2 hospital $300k + call stipend $20k + occasional locum tenens $10k

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {"income_source_id": "emp_001", "income_source_name": "Hospital W-2", "earnings_annual": 300000, "type": "employer"},
    {"income_source_id": "emp_002", "income_source_name": "Call Stipend", "earnings_annual": 20000, "type": "employer"},
    {"income_source_id": "plat_001", "income_source_name": "Locum Tenens Platform", "earnings_annual": 10000, "type": "platform"}
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "employer": {
        "total_earnings": 320000,
        "percentage_of_total": 0.97,
        "source_count": 2,
        "stability_score": 0.95
      },
      "platform": {
        "total_earnings": 10000,
        "percentage_of_total": 0.03,
        "source_count": 1,
        "stability_score": 0.5
      }
    },
    "type_count": 2,
    "diversification_index": 0.06
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "employer",
    "percentage": 0.97,
    "annual_earnings": 320000,
    "label": "Employment"
  },
  "secondary_dependencies": [
    {
      "type": "platform",
      "percentage": 0.03,
      "annual_earnings": 10000,
      "label": "Locum Tenens (Platform)",
      "rank": 1
    }
  ]
}
```

### Display Logic
- **showComposition**: FALSE (near-single-type; secondary <5%)
- **Consumer default**: Show hierarchy only
- **Flag**: Platform income is incidental; note credential portability

### Customer-Facing Report
```
DEPENDENCY STRUCTURE

Your income is 97% employment-dependent, with minimal 
supplemental platform income.

Primary Income: Hospital Employment ($320,000)
Secondary Income: Locum Tenens (3%, $10,000)

PRIMARY RISK: Employment loss = 97% income impact
Mitigating factor: Medical credential provides 
portability across employers.

FOR YOUR HOME PURCHASE:
Your employment income is strong and stable. Lenders 
prefer W-2 physician income. Your credential portability 
reduces employment risk.
```

---

## Profile 6: Business Owner

**Income Structure**: Single major client $450k (90%) + market clients $50k (10%), all commission-based

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {"income_source_id": "trans_001", "income_source_name": "Major Client Commission", "earnings_annual": 450000, "type": "transaction"},
    {"income_source_id": "trans_002", "income_source_name": "Market Clients Commissions", "earnings_annual": 50000, "type": "transaction"}
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "transaction": {
        "total_earnings": 500000,
        "percentage_of_total": 1.0,
        "source_count": 2,
        "largest_source_pct": 0.90,
        "stability_score": 0.65,
        "variability_score": 0.75
      }
    },
    "type_count": 1,
    "diversification_index": 0.2
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "transaction",
    "percentage": 1.0,
    "annual_earnings": 500000,
    "label": "Transaction-Based (Commission)"
  },
  "secondary_dependencies": []
}
```

### Display Logic
- **showComposition**: FALSE (single type)
- **Consumer default**: Show hierarchy only
- **Flag**: Concentration risk (90% from one client) flagged separately in RP-2.0

### Customer-Facing Report
```
DEPENDENCY STRUCTURE

Your income is 100% transaction-dependent 
(commission-based).

Primary Income: Commission ($500,000)

PRIMARY RISK: Deal flow loss = 100% income impact
Client concentration: 90% from major client

CRITICAL: Single-client concentration represents 
significant revenue risk.

FOR YOUR INVESTMENT PROPERTY LOAN:
Lenders view concentrated commission income as 
high-volatility. Demonstrate 3+ year track record. 
Diversification strategy needed for qualification.
```

---

## Profile 7: Freelancer

**Income Structure**: 70% platform-sourced (Upwork) $70k + 30% direct clients $30k

### Backend Layer 1: Dependency Types
```json
{
  "income_types": [
    {"income_source_id": "plat_001", "income_source_name": "Upwork Projects", "earnings_annual": 70000, "type": "platform"},
    {"income_source_id": "client_001", "income_source_name": "Direct Clients", "earnings_annual": 30000, "type": "client"}
  ]
}
```

### Backend Layer 2: Dependency Composition
```json
{
  "dependency_composition": {
    "by_type": {
      "platform": {
        "total_earnings": 70000,
        "percentage_of_total": 0.70,
        "source_count": 1,
        "stability_score": 0.65,
        "variability_score": 0.65
      },
      "client": {
        "total_earnings": 30000,
        "percentage_of_total": 0.30,
        "source_count": 1,
        "stability_score": 0.75,
        "variability_score": 0.55
      }
    },
    "type_count": 2,
    "diversification_index": 0.42
  }
}
```

### Layer 3: Primary + Secondary Hierarchy
```json
{
  "primary_dependency": {
    "type": "platform",
    "percentage": 0.70,
    "annual_earnings": 70000,
    "label": "Platform-Based (Upwork)"
  },
  "secondary_dependencies": [
    {
      "type": "client",
      "percentage": 0.30,
      "annual_earnings": 30000,
      "label": "Direct Clients",
      "rank": 1
    }
  ]
}
```

### Display Logic
- **showComposition**: TRUE (2 types, platform/client distinction materially affects risk)
- **Consumer default**: Show hierarchy + composition (brief)
- **Reason**: Platform vs. direct client are operationally different risks

### Customer-Facing Report (Default)
```
DEPENDENCY STRUCTURE

Your income is primarily platform-dependent with 
supplemental direct client income.

Primary Income: Platform (Upwork, 70%)
Secondary Income: Direct Clients (30%)

PRIMARY RISK: Platform algorithm changes, ranking loss
SECONDARY RISK: Direct client retention

FOR YOUR EDUCATION INVESTMENT:
Gig income volatility may complicate loan qualification. 
Demonstrate 2+ years consistent income. Direct client 
work is more stable; platform work is volatile.
```

### Customer-Facing Report (With Composition - Default shown)
```
[As above, plus]

INCOME COMPOSITION:

Platform Income (Upwork): $70,000 (70%)
  Dependent on: algorithm visibility, platform changes

Direct Client Income: $30,000 (30%)
  Dependent on: client relationships, project availability
```

---

## Profile 8: Mixed Income Household

**Structure**: Spouse A: W-2 $120k | Spouse B: Consulting $80k + Rental Property $20k

### Assessment: Individual-Level (Recommended)

#### Spouse A: W-2 Employee

**Layer 3 Hierarchy**:
```json
{
  "primary_dependency": {
    "type": "employer",
    "percentage": 1.0,
    "annual_earnings": 120000
  },
  "secondary_dependencies": []
}
```

**Display**: 
```
SPOUSE A INCOME

Dependency: Employment-Dependent (100%)

Primary Income: Employment ($120,000)

PRIMARY RISK: Job loss = 100% income impact
```

#### Spouse B: Self-Employed + Real Estate

**Layer 2: Dependency Composition**:
```json
{
  "by_type": {
    "client": {
      "total_earnings": 80000,
      "percentage_of_total": 0.80
    },
    "asset": {
      "total_earnings": 20000,
      "percentage_of_total": 0.20
    }
  },
  "type_count": 2
}
```

**Layer 3 Hierarchy**:
```json
{
  "primary_dependency": {
    "type": "client",
    "percentage": 0.80,
    "annual_earnings": 80000
  },
  "secondary_dependencies": [
    {
      "type": "asset",
      "percentage": 0.20,
      "annual_earnings": 20000,
      "rank": 1
    }
  ]
}
```

**Display**:
```
SPOUSE B INCOME

Dependency: Primarily Client-Dependent with Asset Income

Primary Income: Consulting Clients ($80,000, 80%)
Secondary Income: Rental Property ($20,000, 20%)

PRIMARY RISK: Client concentration / loss
SECONDARY RISK: Property performance
```

#### Household-Level Summary

**Combined Layer 2: Dependency Composition**:
```json
{
  "household": {
    "by_type": {
      "employer": {
        "total_earnings": 120000,
        "percentage_of_total": 0.545
      },
      "client": {
        "total_earnings": 80000,
        "percentage_of_total": 0.364
      },
      "asset": {
        "total_earnings": 20000,
        "percentage_of_total": 0.091
      }
    },
    "type_count": 3,
    "total_household_earnings": 220000
  }
}
```

**Display** (Household View):
```
HOUSEHOLD DEPENDENCY STRUCTURE

Individual Structures:
  Spouse A: Employment-Dependent (100%)
  Spouse B: Primarily Client-Dependent with Asset Income

Household Overview:
  Employment Base: $120,000 (55%)
  Client-Based: $80,000 (36%)
  Asset Income: $20,000 (9%)

HOUSEHOLD RISK PROFILE:
  Primary Risk: Loss of Spouse A's employment
  Secondary Risks: Spouse B client concentration, property performance
  Resilience: Diversified by earner and income type
```

### Display Logic
- **showComposition**: TRUE (household-level; 3 types; multi-earner context)
- **Consumer default**: Show individual structures + household summary
- **Composition shown**: Yes, for clarity on household structure

---

# PART 7: REPORT COPY TEMPLATES

## Template 1: Single-Type Customer

```
DEPENDENCY STRUCTURE

Your income is [PRIMARY_TYPE]-dependent.

Primary Income: [PRIMARY_TYPE] ($[AMOUNT], 100%)

PRIMARY RISK: [RISK_DESCRIPTION]

FOR YOUR [DECISION_TYPE]:
[DECISION_CONTEXT]
```

**Example**:
```
DEPENDENCY STRUCTURE

Your income is employment-dependent.

Primary Income: Employment ($120,000, 100%)

PRIMARY RISK: Job loss = 100% income impact

FOR YOUR HOME PURCHASE:
Your employment income is stable and straightforward. 
Lenders prioritize W-2 income stability.
```

---

## Template 2: Two-Type Customer

```
DEPENDENCY STRUCTURE

Your income is primarily [PRIMARY_TYPE]-dependent 
with supplemental [SECONDARY_TYPE] income.

Primary Income: [PRIMARY_TYPE] ($[AMOUNT], [PCT]%)
Secondary Income: [SECONDARY_TYPE] ($[AMOUNT], [PCT]%)

PRIMARY RISK: [PRIMARY_RISK_DESCRIPTION]
SECONDARY RISK: [SECONDARY_RISK_DESCRIPTION]

FOR YOUR [DECISION_TYPE]:
[DECISION_CONTEXT]
```

**Example**:
```
DEPENDENCY STRUCTURE

Your income is primarily employment-dependent 
with supplemental asset income.

Primary Income: Employment ($80,000, 57%)
Secondary Income: Asset-Based (AUM) ($40,000, 29%)
                  Transaction-Based (Commission) ($20,000, 14%)

PRIMARY RISK: Job loss = 57% income impact
SECONDARY RISKS: Market performance (asset), 
                 sales performance (commission)

FOR YOUR HOME PURCHASE:
Your employment income is your mortgage foundation. 
Supplemental income may enhance qualification.
```

---

## Template 3: Multi-Type Customer (3+)

```
DEPENDENCY STRUCTURE

Your income is primarily [PRIMARY_TYPE]-dependent 
with supplemental [SECONDARY_TYPES].

Primary Income: [PRIMARY_TYPE] ($[AMOUNT], [PCT]%)

Secondary Income:
  • [SECONDARY_1] ($[AMOUNT], [PCT]%)
  • [SECONDARY_2] ($[AMOUNT], [PCT]%)
  [etc.]

PRIMARY RISK: [PRIMARY_RISK]
SECONDARY RISKS: [SECONDARY_RISKS_ENUMERATED]

FOR YOUR [DECISION_TYPE]:
[DECISION_CONTEXT]

[OPTIONAL] See Income Breakdown ↓
```

---

## Template 4: Composition Breakdown (Optional)

```
INCOME BREAKDOWN BY TYPE

[TYPE_1]: $[AMOUNT] ([PCT]%)
  Structure: [DESCRIPTION]
  Stability: [SCORE]
  
[TYPE_2]: $[AMOUNT] ([PCT]%)
  Structure: [DESCRIPTION]
  Stability: [SCORE]

This shows the composition of your income sources, 
not a rating or recommendation. All types are valid.
```

**Example**:
```
INCOME BREAKDOWN BY TYPE

Employment: $80,000 (57%)
  Structure: W-2 salary and bonus
  Stability: High
  
Asset-Based: $40,000 (29%)
  Structure: Recurring AUM fees (market-dependent)
  Stability: Moderate
  
Transaction: $20,000 (14%)
  Structure: Performance-based commissions
  Stability: Moderate-to-Low

This shows the composition of your income, not a 
rating or advice. All types are equally valid.
```

---

## Template 5: Decision-Type-Specific Interpretation

**For Home Purchase**:
```
FOR YOUR HOME PURCHASE:
[Primary type] income is your qualification foundation. 
Lenders focus on [primary type] stability. [Secondary types] 
may enhance qualification but are secondary. [Specific risks/strengths].
```

**For Career Change**:
```
FOR YOUR CAREER CHANGE:
Your primary income source is [primary type]. This decision 
affects [primary %] of your income. Plan a runway based on 
[secondary types]. [Transition timeline guidance].
```

**For Business Launch**:
```
FOR YOUR BUSINESS LAUNCH:
Your current income structure is [composition]. You already 
manage [complexity level] income diversification. New business 
income will add to your dependency profile. [Launch considerations].
```

**For Education Investment**:
```
FOR YOUR EDUCATION INVESTMENT:
Your income is [primary]-dependent, providing a [stability] 
foundation. [Primary type] income can support education costs. 
[Secondary types] may reduce during studies. [Investment timeline].
```

**For Investment Property**:
```
FOR YOUR INVESTMENT PROPERTY:
Your income structure is [composition]. Asset-based income 
([asset %] of your income) shows you understand property returns. 
[Primary type] income supports loan qualification. [Property considerations].
```

---

# PART 8: EDGE CASES & CLASSIFICATION AMBIGUITIES

## Edge Case 1: Retainer vs. Project Work

**Problem**: Consultant with clients paid in two ways.
- Client A: $30k retainer (recurring)
- Client A: $10k project work (one-time, same client)

**Solution**: Classify separately by frequency/structure, not by relationship.
- Retainer portion → CLIENT (recurring, relationship-dependent)
- Project portion → TRANSACTION (one-time, deal-dependent)

**Implementation**:
```
Income Sources:
  - Client A Retainer: $30k → type: CLIENT
  - Client A Project: $10k → type: TRANSACTION
  
Composition:
  CLIENT: 75% ($30k retainer)
  TRANSACTION: 25% ($10k project)
  
Hierarchy:
  Primary: CLIENT (75%)
  Secondary: TRANSACTION (25%)
  
Note: [classification_notes]: "Same client, split by payment structure"
```

---

## Edge Case 2: Platform-Mediated Client Work

**Problem**: Upwork project from repeat client.
- Is this PLATFORM income (sourced via Upwork)?
- Or CLIENT income (delivered to a recurring client)?

**Solution**: If algorithm/platform is the bottleneck, classify as PLATFORM.
- Reason: Loss of platform access = loss of income
- Alternative: If you maintain direct client relationship outside platform, may re-classify when direct work begins

**Implementation**:
```
Income Source: Upwork Repeat Client
Classification: PLATFORM

Rationale: Primary dependency is platform visibility/algorithm.
If platform ranking drops, client availability drops.
Note: Monitor for direct relationship development.
Classification review trigger: If >50% of work becomes off-platform.
```

---

## Edge Case 3: Equity Compensation / Stock Options

**Problem**: Employee with W-2 $100k + stock grants $25k/year (vested).

**Solution**: If vested and recurring, classify as EMPLOYER (equity compensation from employer).
- If not yet vested (volatility, risk), may classify as ASSET if received as dividends/appreciation.
- Conservative: Classify as EMPLOYER until vested and stable.

**Implementation**:
```
Income Sources:
  - W-2 Salary: $100k → type: EMPLOYER
  - Stock Grants (vested): $25k → type: EMPLOYER (or ASSET if treating as dividend)
  
Classification Note: "Equity compensation treated as stable income 
due to vesting schedule. Revert to ASSET if treatment changes."
```

---

## Edge Case 4: Spouse Employment + Household Assessment

**Problem**: Household view vs. individual view.

**Solution**: Report both.
- Individual-level assessment: Each earner's dependency structure
- Household-level summary: Combined composition

**Implementation**:
```
Report sections:
  1. Spouse A Dependency (individual)
  2. Spouse B Dependency (individual)
  3. Household Composition (combined)
  
Allows Decision Check™ to contextualize risk at household level
while maintaining clarity on individual vulnerabilities.
```

---

## Edge Case 5: Highly Seasonal Income

**Problem**: Consultant with huge Q4, minimal off-season.
- Income structure is CLIENT-dependent year-round.
- But seasonality creates within-year volatility.

**Solution**: Classify by type (CLIENT). Note seasonality separately.
- Composition classifies structural dependency.
- Seasonality is captured in RP-2.0 variability_score.

**Implementation**:
```
Income Type: CLIENT ($100k annual, but highly seasonal)

Composition shows: CLIENT 100%
RP-2.0 shows: earnings_variability_score: 0.75 (high)

Report together:
"Your income is client-dependent ($100k annual). 
Income is highly seasonal (Q4-heavy). Ensure 
cash flow management for off-season months."
```

---

## Edge Case 6: Asset Income Without Active Management

**Problem**: Landlord with rental property ($20k/year net) but also W-2 employment.
- Is rental property income "active" (landlording) or "passive" (ownership)?
- Should it be ASSET or TRANSACTION (if lots of active management)?

**Solution**: Classify as ASSET (ownership-based revenue generation).
- Rent collection is ownership income, not labor or transaction income.
- Active property management doesn't change the income type (though it affects stability).

**Implementation**:
```
Income Source: Rental Property ($20k net annual)
Classification: ASSET (passive ownership income)

Stability Score: 0.75 (steady tenant, regular maintenance)
Variability Score: 0.25 (low—rental income is stable)

Composition: ASSET 20% (of total $100k household income)
```

---

# PART 9: TESTING REQUIREMENTS

## Unit Test Cases

### Test Suite 1: Classification Logic

**Test**: Each income source classifies correctly
```
Test Case 1.1: W-2 Employment → EMPLOYER ✓
Test Case 1.2: Consulting Retainer → CLIENT ✓
Test Case 1.3: Upwork Project → PLATFORM ✓
Test Case 1.4: Real Estate Commission → TRANSACTION ✓
Test Case 1.5: Rental Income → ASSET ✓
Test Case 1.6: AUM Fees → ASSET ✓
Test Case 1.7: Stock Options (Vested) → EMPLOYER ✓
Test Case 1.8: Locum Tenens (Platform) → PLATFORM ✓
```

### Test Suite 2: Composition Calculation

**Test**: Composition sums and percentages are correct
```
Test Case 2.1: Single-source sums to 100%
Test Case 2.2: Multi-source percentages sum to 100%
Test Case 2.3: Gini coefficient calculated correctly
Test Case 2.4: Type-level concentration correct
Test Case 2.5: Stability score aggregation correct
Test Case 2.6: Variability score aggregation correct
```

### Test Suite 3: Hierarchy Derivation

**Test**: Primary and Secondary dependencies derived correctly
```
Test Case 3.1: Primary = largest type by earnings
Test Case 3.2: Secondary ordered descending by percentage
Test Case 3.3: Secondary filtered by >2% threshold
Test Case 3.4: Single-type has no secondary
Test Case 3.5: Multi-type correctly ordered
```

### Test Suite 4: Display Logic

**Test**: Composition shown/hidden correctly
```
Test Case 4.1: Single-type → hide composition (consumer)
Test Case 4.2: Three-types → show composition (consumer)
Test Case 4.3: Advisor context → always show composition
Test Case 4.4: Edge case flagged → show composition
Test Case 4.5: Opt-in toggled → show composition
```

### Test Suite 5: 8-Profile End-to-End

**Test**: All 8 test profiles classify, calculate, and derive correctly
```
Test Case 5.1: Software Sales → 100% Employer
Test Case 5.2: Real Estate Agent → 100% Transaction
Test Case 5.3: Financial Advisor → 57% Employer, 29% Asset, 14% Transaction
Test Case 5.4: Consultant → 75% Client, 25% Transaction
Test Case 5.5: Physician → 97% Employer, 3% Platform
Test Case 5.6: Business Owner → 90% Transaction concentration flag
Test Case 5.7: Freelancer → 70% Platform, 30% Client
Test Case 5.8: Mixed Household → Multi-earner individual + household summary
```

### Test Suite 6: Edge Cases

**Test**: Edge cases handle gracefully
```
Test Case 6.1: Retainer + Project same client → split classification
Test Case 6.2: Platform repeat client → classify as PLATFORM
Test Case 6.3: Equity compensation → classify as EMPLOYER
Test Case 6.4: Household multi-earner → individual + household views
Test Case 6.5: Highly seasonal → composition + variability_score
Test Case 6.6: Passive income (landlord) → classify as ASSET
Test Case 6.7: Zero income in a type → handle gracefully
Test Case 6.8: Rounding errors → no off-by-one-cent issues
```

## Integration Test Cases

**Test**: Dependency framework integrates with Decision Check™
```
Integration 1: RP-2.0 inputs flow correctly to classification
Integration 2: Composition stored and retrievable
Integration 3: Hierarchy derivable from composition
Integration 4: Report templates render correctly
Integration 5: Advisor view shows composition toggle
Integration 6: Mobile report hides composition (default)
Integration 7: Enterprise API returns all three layers
```

## Acceptance Test Cases

**Test**: Customer understands output
```
Acceptance 1: Single-type customer sees one-line hierarchy (5s comprehension)
Acceptance 2: Multi-type customer sees hierarchy + optional composition
Acceptance 3: No customer misinterprets composition as advice
Acceptance 4: Advisor can use composition for client discussion
Acceptance 5: Institutional users can extract all three layers
```

---

# PART 10: V1.5 RELEASE SCOPE

## What's Included in V1.5

✅ **Layer 1: Dependency Types**
- Classify all income sources into 5 types
- Write explicit classification rules
- Document edge cases

✅ **Layer 2: Dependency Composition**
- Calculate automatically from RP-2.0 data
- Store in backend
- Derive metrics (Gini, diversification, etc.)
- DO NOT display prominently to consumers by default

✅ **Layer 3: Primary + Secondary Hierarchy**
- Derive from composition
- Customer-facing default
- Replace MIXED entirely
- Implement display logic (show/hide composition based on rules)

✅ **Decision Check™ Report Enhancement**
- Add dependency hierarchy to all 5 decision types
- Decision-type-specific interpretation templates
- Composition detail available on request (not default)

✅ **Backend API**
- Return all three layers (for advisor/enterprise use)
- Auditability: show how hierarchy was derived

## What's NOT Included in V1.5

❌ **No new questions** (all derived from RP-2.0)
❌ **No changes to RP-2.0 scoring engine** (frozen)
❌ **No financial advice logic** (stays measurement-only)
❌ **No prediction or readiness scoring** (pure structure measurement)
❌ **No frontend wizard redesign** (diagnostic flow unchanged)
❌ **No PressureMap changes** (separate initiative)

## Implementation Tasks

### Week 1: Foundation
- [ ] Define classification rules document
- [ ] Design backend schema
- [ ] Implement classification logic (Layer 1)
- [ ] Implement composition calculation (Layer 2)
- [ ] Write unit tests (6 test suites)

### Week 2: Derivation & Display
- [ ] Implement hierarchy derivation (Layer 3)
- [ ] Implement display logic (show/hide)
- [ ] Design report templates
- [ ] Update Decision Check™ report queries
- [ ] Implement advisor/enterprise API

### Week 2.5: QA & Integration
- [ ] Integration testing (Decision Check™)
- [ ] Edge case testing (8 profiles + 6 edge cases)
- [ ] Acceptance testing (customer comprehension)
- [ ] Mobile/responsive testing
- [ ] Performance testing (composition calculation speed)

### Week 3: Deployment
- [ ] Code review
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Monitor error rates (target: 0% classification errors)
- [ ] Gather initial customer feedback

## Success Criteria for V1.5 Release

✅ **Correctness**:
- 100% of customers classified correctly
- 0 classification errors in first week
- Composition sums to 100% ± 0.1%
- Hierarchy matches composition correctly

✅ **Customer Understanding**:
- 95%+ of customers understand their primary dependency in <5 seconds
- 0 customer complaints about "composition looks like a score"
- Advisor feedback: "This helps me guide clients"

✅ **System Performance**:
- Classification runs <100ms per customer
- Composition calculation <500ms
- Report renders <1 second
- No database query performance regression

✅ **Report Value**:
- Decision Check™ reports show 15–20% improvement in clarity
- Customers report "This explains my income structure clearly"
- Advisors report "This is useful context"

## Post-Release (V1.6 Considerations)

⚠️ **Monitor for Layer 2 Value**:
- If multi-type customers request composition detail → prioritize composition UX in V1.6
- If field data shows composition adds >20% value → consider more prominent display
- Otherwise, keep composition hidden by default

⚠️ **Audit Trail Improvement**:
- Add composition versioning (track how hierarchy changes over time)
- Implement classification change notifications (alert when type changes)
- Build composer audit log (show why a customer was classified as Platform vs. Client)

---

# APPENDIX: INSTITUTIONAL INTEGRATION POINTS

## For Advisors (B2B)

**Report includes**:
- Customer-facing hierarchy section (default)
- Toggle: "See detailed income breakdown"
- Composition breakdown (if toggled)
- Advisor notes on dependency risks
- Conversation starters

**API endpoint**: `/customer/{id}/dependency/advisor`
```json
{
  "primary_dependency": {...},
  "secondary_dependencies": [...],
  "composition": {...},
  "risks_by_type": {...},
  "recommendations": {...}
}
```

---

## For Institutional Lenders (B2B)

**API endpoint**: `/customer/{id}/dependency/institution`
```json
{
  "layers": {
    "types": [...],
    "composition": {...},
    "hierarchy": {...}
  },
  "auditability": {
    "derived_at": timestamp,
    "derived_from_rp2_snapshot": id,
    "classification_rules_version": "1.0"
  },
  "risk_assessment": {
    "concentration_index": 0.9,
    "diversification_index": 0.1,
    "primary_type_risk": {...},
    "secondary_type_risks": [...]
  }
}
```

---

## For Credit Bureaus (Future)

**Potential integration** (post-V1.5):
- Dependency type as tradeline enrichment
- Composition as risk modifier
- Hierarchy for underwriting decisioning

**Note**: Requires regulatory approval; not in V1.5 scope.

---

# CONCLUSION

This specification is implementation-ready.

**Core principle**: Layer 2 (Composition) is a backend analytical layer—calculated, stored, auditable—but shown to consumers only when it materially improves clarity.

**Default experience**: Layer 3 (Hierarchy) is clean, simple, and sufficient for 90%+ of customers.

**Advanced experience**: Advisors, enterprises, and detail-oriented consumers can access composition.

**Result**: Measurement architecture that scales from consumer simplicity to institutional depth.

Ready to develop.

