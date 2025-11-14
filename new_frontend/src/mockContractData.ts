import { Contract } from './types';

export const mockContracts: Contract[] = [
  // Contract 1: High Risk MSA
  {
    id: 'contract_1',
    emailId: 'biz_17',
    contractDetails: {
      title: 'Master Service Agreement - Retail Client',
      client: 'Retail Client Inc',
      value: 500000,
      currency: 'USD',
      type: 'msa',
      status: 'pending_review',
      deadline: '2025-11-25',
      receivedDate: '2025-11-13',
      duration: '12 months',
      keyTerms: [
        'All IP belongs to client',
        '2-year non-compete in retail',
        '$10,000/day penalty for delays',
        'Net 45 payment terms',
        '5-year confidentiality'
      ]
    },
    riskAnalysis: {
      overallScore: 8.5,
      riskLevel: 'high',
      criticalRisks: [
        {
          title: 'Intellectual Property Transfer',
          description: 'All work product and intellectual property belongs exclusively to client. Company loses all IP rights to deliverables.',
          recommendation: 'Negotiate for shared IP rights or significantly higher fees (suggest 40% premium) to compensate for IP loss.',
          priority: 1
        },
        {
          title: 'Non-Compete Clause - 2 Years',
          description: '2-year restriction in entire retail sector. This blocks us from working with any retail clients during and after contract period.',
          recommendation: 'Reduce to 6 months or limit to specific direct competitors only. Current clause too broad.',
          priority: 2
        },
        {
          title: 'Aggressive Penalty Clause',
          description: '$10,000 per day for missed deadlines. No grace period or reasonable force majeure exceptions included.',
          recommendation: 'Cap total penalties at $50,000 or 10% of contract value. Add force majeure clause for external factors.',
          priority: 3
        }
      ],
      moderateRisks: [
        'Net 45 payment terms (industry standard is Net 30)',
        '5-year confidentiality period (longer than typical 3 years)',
        'No provisions for scope changes or client delays'
      ],
      favorableTerms: [
        '$500,000 total contract value',
        '12-month duration with clear deliverables',
        'Monthly payment schedule'
      ]
    },
    attachments: [
      {
        id: 'att11',
        name: 'MSA_Retail_Client_2025.docx',
        size: 456000,
        type: 'application/msword'
      }
    ]
  },

  // Contract 2: Medium Risk Software License
  {
    id: 'contract_2',
    emailId: 'biz_16',
    contractDetails: {
      title: 'Software License Agreement 2026',
      client: 'Vendor Software Ltd',
      value: 150000,
      currency: 'USD',
      type: 'license',
      status: 'pending_review',
      deadline: '2025-12-01',
      receivedDate: '2025-11-14',
      duration: 'Jan 1 - Dec 31, 2026',
      keyTerms: [
        'Annual fee: $150,000 (15% increase)',
        'Auto-renewal with 90-day notice',
        'GDPR & SOC2 compliant',
        'Liability capped at 12-month fees',
        'Modified indemnification clause'
      ]
    },
    riskAnalysis: {
      overallScore: 6.5,
      riskLevel: 'medium',
      criticalRisks: [
        {
          title: 'Auto-Renewal Clause',
          description: 'Contract automatically renews for another year unless terminated 90 days prior to expiry. Risk of unwanted renewal if notification is missed.',
          recommendation: 'Set calendar reminder for August 1, 2026. Request removal of auto-renewal or reduce notice period to 30 days.',
          priority: 1
        },
        {
          title: 'Indemnification Changes (Page 8)',
          description: 'Indemnification clause has been modified from 2025 version. Broader liability exposure for company compared to previous agreement.',
          recommendation: 'Legal team must review changes in detail. Request revert to 2025 language or negotiate specific liability limits.',
          priority: 2
        }
      ],
      moderateRisks: [
        '15% price increase (above market average of 8-10%)',
        'Early termination penalty: 50% of remaining contract value',
        '60-day termination notice (industry average is 30 days)'
      ],
      favorableTerms: [
        'GDPR & SOC2 compliance included at no extra cost',
        'Liability capped at 12-month fees paid',
        '2-year price lock after initial increase',
        'Annual security audits included'
      ]
    },
    attachments: [
      {
        id: 'att10',
        name: 'Software_License_Agreement_2026.pdf',
        size: 845000,
        type: 'application/pdf'
      }
    ]
  },

  // Contract 3: Low Risk NDA
  {
    id: 'contract_3',
    emailId: 'biz_14',
    contractDetails: {
      title: 'Non-Disclosure Agreement - API Integration',
      client: 'Partner Corp',
      value: 0,
      currency: 'USD',
      type: 'nda',
      status: 'approved',
      deadline: '2025-11-20',
      receivedDate: '2025-11-14',
      duration: '3 years from signing',
      keyTerms: [
        'Mutual NDA (both parties protected)',
        '3-year confidentiality period',
        'Standard industry terms',
        'No exclusivity requirements'
      ]
    },
    riskAnalysis: {
      overallScore: 2.0,
      riskLevel: 'low',
      criticalRisks: [],
      moderateRisks: [
        '3-year term (standard but could negotiate for 2 years)',
        'No provisions for publicly disclosed information exceptions'
      ],
      favorableTerms: [
        'Mutual NDA - both parties equally protected',
        'No financial penalties',
        'Clear definition of confidential information',
        'Standard carve-outs for independently developed information',
        'No exclusivity or non-compete restrictions',
        'Reasonable disclosure obligations'
      ]
    },
    attachments: [
      {
        id: 'att_nda1',
        name: 'NDA_Partner_Corp.pdf',
        size: 125000,
        type: 'application/pdf'
      }
    ]
  },

  // Contract 4: High Risk Employment Agreement
  {
    id: 'contract_4',
    emailId: 'biz_3',
    contractDetails: {
      title: 'Senior Developer Employment Contract',
      client: 'Alex Nguyen (Candidate)',
      value: 180000,
      currency: 'USD',
      type: 'employment',
      status: 'under_negotiation',
      receivedDate: '2025-11-13',
      duration: 'Indefinite (at-will)',
      keyTerms: [
        'Annual salary: $180,000',
        '1-year non-compete',
        'IP assignment clause',
        '6-month probation',
        'Stock options: 10,000 shares'
      ]
    },
    riskAnalysis: {
      overallScore: 7.0,
      riskLevel: 'high',
      criticalRisks: [
        {
          title: 'Broad IP Assignment',
          description: 'Employee must assign ALL inventions created during employment, even those on personal time unrelated to company business.',
          recommendation: 'Limit IP assignment to work-related inventions only. Add carve-out for personal projects unrelated to business.',
          priority: 1
        },
        {
          title: 'Non-Compete Enforceability',
          description: '1-year non-compete may not be enforceable in California and several other states. Creates legal uncertainty.',
          recommendation: 'Replace with non-solicitation clause or remove entirely if employee is in California.',
          priority: 2
        }
      ],
      moderateRisks: [
        'No remote work provisions specified',
        '6-month probation period (longer than standard 3 months)',
        'Stock options vesting schedule not detailed'
      ],
      favorableTerms: [
        'Competitive salary for senior role',
        '10,000 stock options',
        'Standard benefits package',
        'At-will employment (flexibility for both parties)'
      ]
    },
    attachments: [
      {
        id: 'att3',
        name: 'Alex_Nguyen_Employment_Agreement.pdf',
        size: 280000,
        type: 'application/pdf'
      }
    ]
  },

  // Contract 5: Medium Risk SLA
  {
    id: 'contract_5',
    emailId: 'biz_25',
    contractDetails: {
      title: 'Service Level Agreement - MegaRetail',
      client: 'MegaRetail Inc',
      value: 0,
      currency: 'USD',
      type: 'sla',
      status: 'signed',
      receivedDate: '2025-01-15',
      duration: 'Annual renewal',
      keyTerms: [
        '99.9% uptime guarantee',
        '2-hour response time',
        '$25K base penalty for breach',
        '$5K per hour beyond SLA',
        'Quarterly service reviews'
      ]
    },
    riskAnalysis: {
      overallScore: 6.0,
      riskLevel: 'medium',
      criticalRisks: [
        {
          title: 'Escalating Penalty Structure',
          description: 'Base penalty of $25,000 for any SLA breach, plus $5,000 per hour beyond 2-hour response. Recent 6-hour outage resulted in $45,000 liability.',
          recommendation: 'Negotiate caps on total penalties per incident ($50K max) and per year ($200K max). Add force majeure exceptions.',
          priority: 1
        }
      ],
      moderateRisks: [
        '99.9% uptime is aggressive (allows only 8.7 hours downtime per year)',
        '2-hour response time challenging for after-hours issues',
        'No exclusions for planned maintenance windows'
      ],
      favorableTerms: [
        'Clear performance metrics',
        'Quarterly review meetings for continuous improvement',
        'Mutual termination rights with 60-day notice',
        'Client provides advance notice of major events'
      ]
    },
    attachments: [
      {
        id: 'att_sla1',
        name: 'SLA_MegaRetail_2025.pdf',
        size: 234000,
        type: 'application/pdf'
      }
    ]
  },

  // Contract 6: Low Risk Amendment
  {
    id: 'contract_6',
    emailId: 'biz_1',
    contractDetails: {
      title: 'Q4 Contract Renewal Amendment - TechCorp',
      client: 'TechCorp Inc',
      value: 380000,
      currency: 'USD',
      type: 'other',
      status: 'under_negotiation',
      deadline: '2025-12-15',
      receivedDate: '2025-11-14',
      duration: 'Q4 2025 extension',
      keyTerms: [
        'Contract extension to Dec 31, 2025',
        'Updated pricing: $380K',
        'New features included',
        'Same terms as original contract'
      ]
    },
    riskAnalysis: {
      overallScore: 3.5,
      riskLevel: 'low',
      criticalRisks: [],
      moderateRisks: [
        'Price increase from previous quarter (need to verify ROI)',
        'Short deadline for signature (Dec 15)',
        'Extension ties us through year-end'
      ],
      favorableTerms: [
        'Existing client with good relationship',
        'All other terms remain favorable',
        'New features add value without extra cost',
        'Extension allows time to negotiate 2026 contract',
        'No penalties or unusual clauses',
        'Standard payment terms (Net 30)'
      ]
    },
    attachments: [
      {
        id: 'att1',
        name: 'TechCorp_Q4_Amendment.pdf',
        size: 450000,
        type: 'application/pdf'
      }
    ]
  }
];
