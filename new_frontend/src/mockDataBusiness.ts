import { Email, EmailFolder, GmailLabel } from './types';

// Business Mock Emails - Enterprise scenario
export const mockBusinessEmails: Email[] = [
  // SALES DEPARTMENT
  {
    id: 'biz_1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@client-techcorp.com',
      avatar: '👩‍💼'
    },
    to: ['sales@company.com', 'john.doe@company.com'],
    cc: ['manager.sales@company.com'],
    subject: '[URGENT] Q4 Contract Renewal - TechCorp Inc.',
    body: `<p>Hi Sales Team,</p>
<p>We need to discuss the Q4 contract renewal. Our current contract expires on Dec 15, 2025.</p>
<p>Please prepare a proposal with updated pricing and new features.</p>
<p>Let's schedule a call this week.</p>`,
    snippet: 'Q4 contract renewal discussion needed. Current contract expires Dec 15...',
    date: new Date('2025-11-14T09:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_sales', 'label_urgent'],
    hasAttachments: true,
    attachments: [
      { id: 'att1', name: 'Current_Contract.pdf', size: 450000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'sales',
      clientId: 'CLIENT-001',
      clientName: 'TechCorp Inc.',
      projectName: 'Q4 Contract Renewal',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_2',
    from: {
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      avatar: '👨‍💼'
    },
    to: ['sales@company.com'],
    cc: ['ceo@company.com'],
    subject: 'Weekly Sales Report - Week 46',
    body: `<p>Team,</p>
<p>Weekly metrics:</p>
<ul>
<li>New leads: 45</li>
<li>Closed deals: 12</li>
<li>Revenue: $245K</li>
<li>Pipeline: $1.2M</li>
</ul>`,
    snippet: 'Weekly sales report: 45 new leads, 12 closed deals, $245K revenue...',
    date: new Date('2025-11-13T16:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_sales', 'label_reports'],
    hasAttachments: true,
    attachments: [
      { id: 'att2', name: 'Weekly_Sales_Report.xlsx', size: 125000, type: 'application/vnd.ms-excel' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'sales',
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // HR DEPARTMENT
  {
    id: 'biz_3',
    from: {
      name: 'Emma Wilson',
      email: 'emma.wilson@recruitment.com',
      avatar: '👩'
    },
    to: ['hr@company.com'],
    subject: 'Candidate Interview - Senior Developer Position',
    body: `<p>Hello HR Team,</p>
<p>I have a strong candidate for the Senior Developer role:</p>
<p><strong>Name:</strong> Alex Nguyen<br>
<strong>Experience:</strong> 8 years<br>
<strong>Skills:</strong> React, Node.js, AWS</p>
<p>Available for interview next week.</p>`,
    snippet: 'Strong candidate for Senior Developer: Alex Nguyen, 8 years experience...',
    date: new Date('2025-11-13T11:20:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_hr', 'label_recruitment'],
    hasAttachments: true,
    attachments: [
      { id: 'att3', name: 'Alex_Nguyen_Resume.pdf', size: 280000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'hr',
      ticketId: 'HR-2025-089',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_4',
    from: {
      name: 'HR Department',
      email: 'hr@company.com',
      avatar: '🏢'
    },
    to: ['all@company.com'],
    subject: '[ANNOUNCEMENT] Company Holiday Schedule 2025',
    body: `<p>Dear All,</p>
<p>Company holidays for December 2025:</p>
<ul>
<li>Dec 24-26: Christmas Break</li>
<li>Dec 31 - Jan 1: New Year</li>
</ul>
<p>Office will reopen on Jan 2, 2026.</p>`,
    snippet: 'Company holiday schedule: Christmas Dec 24-26, New Year Dec 31-Jan 1...',
    date: new Date('2025-11-12T09:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_hr', 'label_announcement'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'normal',
      department: 'hr',
      isInternal: true,
      confidentiality: 'public'
    }
  },

  // TECH DEPARTMENT
  {
    id: 'biz_5',
    from: {
      name: 'DevOps Team',
      email: 'devops@company.com',
      avatar: '⚙️'
    },
    to: ['tech@company.com'],
    subject: '[CRITICAL] Production Server Down - Immediate Action Required',
    body: `<p>ALERT: Production server app-prod-01 is down!</p>
<p><strong>Status:</strong> Unresponsive<br>
<strong>Started:</strong> 10:45 AM<br>
<strong>Impact:</strong> All users affected</p>
<p>Emergency response team activated.</p>`,
    snippet: 'CRITICAL: Production server down since 10:45 AM, all users affected...',
    date: new Date('2025-11-14T10:50:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_tech', 'label_critical'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'tech',
      ticketId: 'INCIDENT-2025-034',
      isInternal: true,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_6',
    from: {
      name: 'David Park',
      email: 'david.park@company.com',
      avatar: '👨‍💻'
    },
    to: ['tech@company.com'],
    cc: ['cto@company.com'],
    subject: 'Code Review Request - Feature: Email AI Integration',
    body: `<p>Hi Team,</p>
<p>Please review my PR for the new Email AI Integration feature.</p>
<p><strong>PR:</strong> #456<br>
<strong>Branch:</strong> feature/email-ai<br>
<strong>Changes:</strong> 1,245 lines</p>
<p>Deadline: End of week</p>`,
    snippet: 'Code review needed for Email AI Integration feature, PR #456...',
    date: new Date('2025-11-13T14:30:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_tech', 'label_code_review'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'tech',
      projectId: 'PROJ-AI-2025',
      projectName: 'Email AI Integration',
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // FINANCE DEPARTMENT
  {
    id: 'biz_7',
    from: {
      name: 'Accounting Services',
      email: 'billing@vendor-cloudserve.com',
      avatar: '💼'
    },
    to: ['finance@company.com'],
    subject: 'Invoice #INV-2025-1145 - Cloud Services November',
    body: `<p>Dear Finance Team,</p>
<p>Please find attached invoice for November cloud services.</p>
<p><strong>Invoice:</strong> INV-2025-1145<br>
<strong>Amount:</strong> $12,450.00<br>
<strong>Due Date:</strong> December 1, 2025</p>
<p>Payment methods: Wire transfer or ACH.</p>`,
    snippet: 'Invoice for November cloud services: $12,450.00, due Dec 1...',
    date: new Date('2025-11-13T08:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_invoice'],
    hasAttachments: true,
    attachments: [
      { id: 'att4', name: 'Invoice_INV-2025-1145.pdf', size: 185000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'finance',
      isInternal: false,
      requiresApproval: true,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_8',
    from: {
      name: 'Lisa Chen',
      email: 'lisa.chen@company.com',
      avatar: '👩‍💼'
    },
    to: ['cfo@company.com'],
    cc: ['finance@company.com'],
    subject: 'Budget Approval Request - Marketing Q1 2026',
    body: `<p>Dear CFO,</p>
<p>Requesting approval for Q1 2026 Marketing budget:</p>
<p><strong>Total:</strong> $350,000<br>
<strong>Breakdown:</strong><br>
- Digital Ads: $150K<br>
- Events: $100K<br>
- Content: $100K</p>
<p>Please review and approve.</p>`,
    snippet: 'Budget approval request: Marketing Q1 2026, $350K total...',
    date: new Date('2025-11-12T15:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_approval'],
    hasAttachments: true,
    attachments: [
      { id: 'att5', name: 'Q1_2026_Marketing_Budget.xlsx', size: 245000, type: 'application/vnd.ms-excel' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'finance',
      projectName: 'Q1 2026 Budget Planning',
      requiresApproval: true,
      isInternal: true,
      confidentiality: 'confidential'
    }
  },

  // SUPPORT DEPARTMENT
  {
    id: 'biz_9',
    from: {
      name: 'Customer',
      email: 'john.smith@customer.com',
      avatar: '👤'
    },
    to: ['support@company.com'],
    subject: '[TICKET-12345] Unable to login to dashboard',
    body: `<p>Hello Support,</p>
<p>I cannot login to my dashboard. Getting "Invalid credentials" error.</p>
<p><strong>Username:</strong> john.smith<br>
<strong>Error:</strong> Started yesterday<br>
<strong>Browser:</strong> Chrome 119</p>
<p>Please help urgently!</p>`,
    snippet: 'Login issue: Invalid credentials error since yesterday...',
    date: new Date('2025-11-14T08:15:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_support', 'label_ticket'],
    hasAttachments: true,
    attachments: [
      { id: 'att6', name: 'error_screenshot.png', size: 125000, type: 'image/png' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'support',
      ticketId: 'TICKET-12345',
      clientId: 'CUST-789',
      clientName: 'John Smith',
      isInternal: false,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_10',
    from: {
      name: 'Support Team',
      email: 'support@company.com',
      avatar: '🎧'
    },
    to: ['team@company.com'],
    subject: 'Support Metrics - Week 46',
    body: `<p>Team Performance:</p>
<ul>
<li>Tickets resolved: 89</li>
<li>Avg response time: 2.5 hours</li>
<li>Customer satisfaction: 4.8/5</li>
<li>Open tickets: 23</li>
</ul>
<p>Great work everyone!</p>`,
    snippet: 'Support metrics: 89 tickets resolved, 2.5h avg response, 4.8/5 satisfaction...',
    date: new Date('2025-11-13T17:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_support', 'label_reports'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'normal',
      department: 'support',
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // MARKETING DEPARTMENT
  {
    id: 'biz_11',
    from: {
      name: 'Emily Taylor',
      email: 'emily.taylor@company.com',
      avatar: '📱'
    },
    to: ['marketing@company.com'],
    cc: ['cmo@company.com'],
    subject: 'Black Friday Campaign - Final Review',
    body: `<p>Hi Marketing Team,</p>
<p>Black Friday campaign is ready for launch!</p>
<p><strong>Launch Date:</strong> Nov 24, 2025<br>
<strong>Budget:</strong> $50K<br>
<strong>Channels:</strong> Email, Social, Display Ads</p>
<p>Final approval needed from CMO.</p>`,
    snippet: 'Black Friday campaign ready: Launch Nov 24, $50K budget...',
    date: new Date('2025-11-13T10:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_marketing', 'label_campaign'],
    hasAttachments: true,
    attachments: [
      { id: 'att7', name: 'Black_Friday_Campaign.pptx', size: 3450000, type: 'application/vnd.ms-powerpoint' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'marketing',
      projectId: 'CAMP-BF-2025',
      projectName: 'Black Friday 2025',
      requiresApproval: true,
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // INTERNAL COLLABORATION
  {
    id: 'biz_12',
    from: {
      name: 'CEO',
      email: 'ceo@company.com',
      avatar: '👔'
    },
    to: ['all@company.com'],
    subject: '[IMPORTANT] All-Hands Meeting - Q4 Review',
    body: `<p>Dear Team,</p>
<p>All-hands meeting for Q4 review:</p>
<p><strong>Date:</strong> Friday, Nov 17<br>
<strong>Time:</strong> 3:00 PM<br>
<strong>Location:</strong> Main Conference Room / Zoom</p>
<p>Topics: Q4 results, 2026 strategy, team awards.</p>
<p>Attendance mandatory.</p>`,
    snippet: 'All-hands meeting Nov 17 at 3PM: Q4 review, 2026 strategy...',
    date: new Date('2025-11-12T12:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_announcement', 'label_meeting'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'general',
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // PROJECT-BASED EMAIL
  {
    id: 'biz_13',
    from: {
      name: 'Project Manager',
      email: 'pm@company.com',
      avatar: '📊'
    },
    to: ['project-alpha@company.com'],
    cc: ['tech@company.com', 'design@company.com'],
    subject: '[Project Alpha] Sprint 12 Planning',
    body: `<p>Team Alpha,</p>
<p>Sprint 12 planning session:</p>
<p><strong>When:</strong> Monday 9 AM<br>
<strong>Where:</strong> Room B301<br>
<strong>Focus:</strong> User dashboard redesign</p>
<p>Please prepare your story points.</p>`,
    snippet: 'Sprint 12 planning Monday 9AM: User dashboard redesign...',
    date: new Date('2025-11-13T16:30:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_project', 'label_tech'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'normal',
      department: 'tech',
      projectId: 'PROJ-ALPHA',
      projectName: 'Project Alpha',
      isInternal: true,
      confidentiality: 'internal'
    }
  },

  // SENT EMAIL EXAMPLES
  {
    id: 'biz_sent_1',
    from: {
      name: 'Me',
      email: 'me@company.com',
      avatar: '👤'
    },
    to: ['client@external.com'],
    cc: ['sales@company.com'],
    subject: 'Re: Contract Proposal - Partnership Discussion',
    body: `<p>Dear Client,</p>
<p>Thank you for your interest in our services.</p>
<p>I've attached our proposal with pricing and timeline.</p>
<p>Looking forward to our partnership!</p>`,
    snippet: 'Proposal sent with pricing and timeline details...',
    date: new Date('2025-11-13T11:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_sales'],
    hasAttachments: true,
    attachments: [
      { id: 'att8', name: 'Proposal_2025.pdf', size: 445000, type: 'application/pdf' }
    ],
    folder: 'sent',
    businessMetadata: {
      priority: 'high',
      department: 'sales',
      clientId: 'CLIENT-045',
      clientName: 'External Client Corp',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },

  // LLM5 - MEETING SCHEDULER DATA
  {
    id: 'biz_14',
    from: {
      name: 'Robert Martinez',
      email: 'robert.martinez@partner-corp.com',
      avatar: '👨‍💼'
    },
    to: ['sales@company.com', 'project-manager@company.com'],
    subject: 'Let\'s schedule a kick-off meeting for the new integration project',
    body: `<p>Hi Team,</p>
<p>We need to schedule a kick-off meeting to discuss the API integration project.</p>
<p>I'm available:</p>
<ul>
<li>Monday, Nov 20 - 2:00 PM to 5:00 PM</li>
<li>Tuesday, Nov 21 - 10:00 AM to 12:00 PM</li>
<li>Thursday, Nov 23 - 3:00 PM to 4:30 PM</li>
</ul>
<p>Agenda: Project scope, timeline, technical requirements, team roles</p>
<p>Please let me know what works best for everyone.</p>`,
    snippet: 'Need to schedule kick-off meeting for API integration project...',
    date: new Date('2025-11-14T09:15:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_meeting', 'label_tech'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'tech',
      projectId: 'PROJ-INT-2025',
      projectName: 'API Integration',
      clientId: 'CLIENT-088',
      clientName: 'Partner Corp',
      isInternal: false,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_15',
    from: {
      name: 'Executive Assistant',
      email: 'ea@company.com',
      avatar: '📅'
    },
    to: ['leadership@company.com'],
    subject: 'Board Meeting Reminder - Nov 18, 2025 at 9:00 AM',
    body: `<p>Dear Leadership Team,</p>
<p>This is a reminder for the upcoming Board Meeting:</p>
<p><strong>Date:</strong> Monday, November 18, 2025<br>
<strong>Time:</strong> 9:00 AM - 11:30 AM (PST)<br>
<strong>Location:</strong> Executive Boardroom (Floor 10)<br>
<strong>Video:</strong> Zoom link will be sent 15 mins before</p>
<p><strong>Agenda:</strong></p>
<ol>
<li>Q4 Financial Review (CFO)</li>
<li>2026 Strategic Planning (CEO)</li>
<li>Product Roadmap Update (CPO)</li>
<li>Risk Assessment (Legal)</li>
</ol>
<p>Please review the attached materials beforehand.</p>`,
    snippet: 'Board Meeting Nov 18 at 9AM: Q4 review, 2026 strategy, product roadmap...',
    date: new Date('2025-11-15T08:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_meeting', 'label_urgent'],
    hasAttachments: true,
    attachments: [
      { id: 'att9', name: 'Board_Meeting_Materials_Nov2025.pdf', size: 2340000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'general',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },

  // LLM6 - CONTRACT ANALYZER DATA
  {
    id: 'biz_16',
    from: {
      name: 'Legal Department',
      email: 'legal@vendor-software.com',
      avatar: '⚖️'
    },
    to: ['legal@company.com'],
    cc: ['ceo@company.com'],
    subject: 'Software License Agreement - Annual Renewal',
    body: `<p>Dear Legal Team,</p>
<p>Please find attached the Software License Agreement for annual renewal.</p>
<p><strong>Key Terms:</strong></p>
<ul>
<li>License Period: Jan 1, 2026 - Dec 31, 2026</li>
<li>Annual Fee: $150,000 (15% increase from 2025)</li>
<li>Auto-renewal clause: Agreement renews automatically unless terminated 90 days prior</li>
<li>Limitation of Liability: Capped at total fees paid in 12-month period</li>
<li>Data Privacy: GDPR and SOC2 compliance required</li>
<li>Termination: Either party may terminate with 60 days written notice</li>
</ul>
<p>Signature required by December 1, 2025.</p>
<p>Please review indemnification clause on page 8 - it has been modified from previous year.</p>`,
    snippet: 'Software license renewal: $150K/year, auto-renewal, 90-day termination notice...',
    date: new Date('2025-11-14T10:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_approval', 'label_finance'],
    hasAttachments: true,
    attachments: [
      { id: 'att10', name: 'Software_License_Agreement_2026.pdf', size: 845000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'finance',
      requiresApproval: true,
      isInternal: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_17',
    from: {
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@client-retail.com',
      avatar: '👩‍💼'
    },
    to: ['sales@company.com'],
    cc: ['legal@company.com'],
    subject: 'Master Service Agreement - Review Required',
    body: `<p>Hello,</p>
<p>Attached is our standard Master Service Agreement for the consulting engagement.</p>
<p><strong>Contract Value:</strong> $500,000 over 12 months<br>
<strong>Payment Terms:</strong> Net 45 days<br>
<strong>Deliverables:</strong> Monthly consulting reports + quarterly strategy sessions</p>
<p><strong>Special Clauses:</strong></p>
<ul>
<li>Intellectual Property: All work product belongs to client</li>
<li>Non-compete: 2-year restriction in retail sector</li>
<li>Confidentiality: 5-year non-disclosure period</li>
<li>Penalty Clause: $10,000/day for missed deadlines</li>
</ul>
<p>We need this signed by Nov 25 to start on Dec 1.</p>`,
    snippet: 'MSA review needed: $500K contract with IP transfer, non-compete, penalty clauses...',
    date: new Date('2025-11-13T14:45:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_sales', 'label_approval'],
    hasAttachments: true,
    attachments: [
      { id: 'att11', name: 'MSA_Retail_Client_2025.docx', size: 456000, type: 'application/msword' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'sales',
      clientId: 'CLIENT-092',
      clientName: 'Retail Client Inc',
      requiresApproval: true,
      isInternal: false,
      confidentiality: 'confidential'
    }
  },

  // LLM7 - CLIENT INTELLIGENCE DATA
  {
    id: 'biz_18',
    from: {
      name: 'Karen Thompson',
      email: 'karen.thompson@unhappy-client.com',
      avatar: '😠'
    },
    to: ['support@company.com'],
    cc: ['manager@company.com'],
    subject: 'EXTREMELY DISAPPOINTED - Third Time Reporting Same Issue!!!',
    body: `<p>I am absolutely FURIOUS right now!</p>
<p>This is the THIRD time I'm reporting the same billing error. Your team keeps saying "we'll fix it" but NOTHING has changed!</p>
<p>I've been charged $2,500 instead of $250 for THREE MONTHS IN A ROW. This is completely unacceptable!</p>
<p>I've wasted HOURS on the phone with your support team who seem clueless about how to resolve this.</p>
<p>If this is not fixed within 24 hours, I will:</p>
<ul>
<li>Cancel our contract immediately</li>
<li>File a complaint with the Better Business Bureau</li>
<li>Post negative reviews on every platform</li>
<li>Contact our lawyer about potential legal action</li>
</ul>
<p>I expect an immediate response from senior management, not another generic support response.</p>
<p>This is my final warning.</p>`,
    snippet: 'ANGRY CLIENT: Third billing error, threatening to cancel and file complaints...',
    date: new Date('2025-11-14T11:20:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_support', 'label_critical'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'support',
      ticketId: 'ESCALATION-2025-008',
      clientId: 'CLIENT-034',
      clientName: 'Karen Thompson',
      isInternal: false,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_19',
    from: {
      name: 'Michael Chen',
      email: 'michael.chen@happy-customer.com',
      avatar: '😊'
    },
    to: ['sales@company.com', 'support@company.com'],
    subject: 'Thank you for the amazing service!',
    body: `<p>Hi Team,</p>
<p>I just wanted to send a quick note to say THANK YOU for the exceptional service over the past 6 months!</p>
<p>Your support team (especially Jessica) has been incredibly responsive and helpful. Every issue was resolved within hours, not days.</p>
<p>The new features you released last month have saved us at least 20 hours per week. Our productivity has increased significantly.</p>
<p>I've already recommended your service to three other companies in our network, and they're all interested in demos.</p>
<p>We're looking to expand our subscription to the Enterprise plan next quarter. Could you send me pricing information?</p>
<p>Keep up the great work!</p>`,
    snippet: 'HAPPY CLIENT: Praising service, recommending to others, wants to upgrade to Enterprise...',
    date: new Date('2025-11-13T15:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_sales', 'label_support'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'sales',
      clientId: 'CLIENT-067',
      clientName: 'Michael Chen',
      isInternal: false,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_20',
    from: {
      name: 'Patricia Williams',
      email: 'pwilliams@enterprise-client.com',
      avatar: '💼'
    },
    to: ['sales@company.com'],
    subject: 'Following up on expansion opportunity',
    body: `<p>Hi Sales Team,</p>
<p>Following up on our conversation last week about expanding our usage.</p>
<p>We're currently using your platform for our US operations (250 users) and are very satisfied with the results.</p>
<p>We're now looking to roll out globally:</p>
<ul>
<li>Europe: 180 users</li>
<li>Asia Pacific: 120 users</li>
<li>Latin America: 80 users</li>
</ul>
<p>Total: 630 users globally</p>
<p>Could we schedule a call next week to discuss:</p>
<ul>
<li>Volume pricing for 600+ users</li>
<li>Multi-region deployment</li>
<li>Dedicated account manager</li>
<li>Custom SLA agreements</li>
</ul>
<p>Our budget for 2026 is approved, so we're ready to move forward quickly.</p>`,
    snippet: 'EXPANSION OPPORTUNITY: Current client wants to expand from 250 to 630 users globally...',
    date: new Date('2025-11-14T09:45:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_sales', 'label_urgent'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'sales',
      clientId: 'CLIENT-012',
      clientName: 'Enterprise Client Corp',
      projectName: 'Global Expansion 2026',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },

  // LLM8 - REPORT GENERATOR DATA
  {
    id: 'biz_21',
    from: {
      name: 'Analytics Team',
      email: 'analytics@company.com',
      avatar: '📊'
    },
    to: ['executive@company.com'],
    subject: 'Weekly Executive Summary - Week 46 (Nov 11-15)',
    body: `<p>Executive Summary for Week 46:</p>
<p><strong>SALES METRICS:</strong></p>
<ul>
<li>New Deals Closed: 18 ($1.2M total value)</li>
<li>Pipeline Growth: +$3.5M (28% increase)</li>
<li>Win Rate: 34% (up from 29% last week)</li>
<li>Avg Deal Size: $67K</li>
</ul>
<p><strong>CUSTOMER SUCCESS:</strong></p>
<ul>
<li>NPS Score: 72 (industry avg: 45)</li>
<li>Churn Rate: 2.1% (target: <3%)</li>
<li>Support Tickets: 234 resolved, 18 open</li>
<li>Avg Resolution Time: 3.2 hours</li>
</ul>
<p><strong>PRODUCT:</strong></p>
<ul>
<li>Active Users: 12,450 (12% growth MoM)</li>
<li>Feature Adoption: Email AI - 67%, Smart Labels - 82%</li>
<li>System Uptime: 99.97%</li>
</ul>
<p><strong>ACTION ITEMS:</strong></p>
<ul>
<li>Address 3 escalated client issues (see attached)</li>
<li>Review Q4 budget vs actuals</li>
<li>Approve 2 new hires for Support team</li>
</ul>`,
    snippet: 'Weekly summary: 18 deals closed, $1.2M revenue, 72 NPS score, 99.97% uptime...',
    date: new Date('2025-11-15T17:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_reports'],
    hasAttachments: true,
    attachments: [
      { id: 'att12', name: 'Executive_Summary_Week46.pdf', size: 567000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'general',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_22',
    from: {
      name: 'HR Analytics',
      email: 'hr-analytics@company.com',
      avatar: '📈'
    },
    to: ['hr@company.com', 'ceo@company.com'],
    subject: 'Monthly HR Report - October 2025',
    body: `<p>HR Monthly Report - October 2025:</p>
<p><strong>HEADCOUNT:</strong></p>
<ul>
<li>Total Employees: 287 (↑12 from Sept)</li>
<li>New Hires: 15</li>
<li>Departures: 3 (1.0% turnover)</li>
<li>Open Positions: 22</li>
</ul>
<p><strong>RECRUITMENT:</strong></p>
<ul>
<li>Applications Received: 456</li>
<li>Interviews Conducted: 89</li>
<li>Offers Extended: 18</li>
<li>Acceptance Rate: 83%</li>
<li>Avg Time to Hire: 28 days</li>
</ul>
<p><strong>EMPLOYEE ENGAGEMENT:</strong></p>
<ul>
<li>Satisfaction Score: 8.2/10</li>
<li>Training Hours: 1,245</li>
<li>Sick Days: 234 (avg 0.8 per employee)</li>
</ul>
<p><strong>DIVERSITY:</strong></p>
<ul>
<li>Gender: 48% female, 51% male, 1% non-binary</li>
<li>Leadership: 42% female representation</li>
</ul>
<p><strong>CONCERNS:</strong></p>
<ul>
<li>Engineering team struggling to fill 8 senior positions</li>
<li>Salary compression in Sales department needs review</li>
</ul>`,
    snippet: 'HR Report: 287 employees, 15 new hires, 8.2/10 satisfaction, hiring challenges in Engineering...',
    date: new Date('2025-11-01T09:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_hr', 'label_reports'],
    hasAttachments: true,
    attachments: [
      { id: 'att13', name: 'HR_Report_October_2025.xlsx', size: 234000, type: 'application/vnd.ms-excel' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'normal',
      department: 'hr',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },

  // LLM9 - PRIORITY CLASSIFIER DATA
  {
    id: 'biz_23',
    from: {
      name: 'Security Team',
      email: 'security@company.com',
      avatar: '🔒'
    },
    to: ['all@company.com'],
    cc: ['cto@company.com', 'ceo@company.com'],
    subject: '[SECURITY ALERT] Potential Data Breach Detected - IMMEDIATE ACTION REQUIRED',
    body: `<p><strong style="color: red;">URGENT SECURITY ALERT</strong></p>
<p>Our security monitoring system has detected unusual access patterns that may indicate a data breach attempt.</p>
<p><strong>INCIDENT DETAILS:</strong></p>
<ul>
<li>Detected: Nov 14, 2025 at 11:23 AM</li>
<li>Type: Unauthorized database access attempts</li>
<li>Source: Unknown external IP addresses</li>
<li>Target: Customer database</li>
<li>Status: Access blocked, investigation ongoing</li>
</ul>
<p><strong>IMMEDIATE ACTIONS REQUIRED:</strong></p>
<ol>
<li>Change all administrative passwords NOW</li>
<li>Enable 2FA if not already active</li>
<li>Do NOT access any suspicious emails or links</li>
<li>Report any unusual system behavior immediately</li>
</ol>
<p>Security team is conducting full forensic analysis. Further updates in 2 hours.</p>
<p><strong>DO NOT forward this email outside the company.</strong></p>`,
    snippet: 'SECURITY BREACH: Unauthorized database access detected, immediate password change required...',
    date: new Date('2025-11-14T11:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_critical', 'label_tech'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'tech',
      ticketId: 'SEC-2025-019',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_24',
    from: {
      name: 'VIP Client Services',
      email: 'vip@fortune500-client.com',
      avatar: '⭐'
    },
    to: ['sales@company.com'],
    cc: ['ceo@company.com'],
    subject: 'Fortune 500 Client - System Outage Affecting 5,000 Users',
    body: `<p>URGENT: Critical issue affecting our entire organization.</p>
<p>Our 5,000 employees cannot access your platform since 10:00 AM today.</p>
<p><strong>Business Impact:</strong></p>
<ul>
<li>Sales team cannot process orders ($500K+ in delayed transactions)</li>
<li>Customer service is down (300+ customers waiting)</li>
<li>Executive presentations postponed</li>
</ul>
<p>We need:</p>
<ul>
<li>Immediate root cause analysis</li>
<li>ETA for resolution</li>
<li>Hourly status updates</li>
<li>Executive call within 30 minutes</li>
</ul>
<p>This is our largest revenue day of the quarter. Every hour of downtime costs us approximately $75,000.</p>
<p>Our CEO is asking for explanation and compensation plan.</p>`,
    snippet: 'VIP CLIENT CRISIS: 5,000 users affected, $75K/hour loss, CEO escalation...',
    date: new Date('2025-11-14T10:45:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_critical', 'label_support'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'support',
      clientId: 'VIP-001',
      clientName: 'Fortune 500 Client',
      ticketId: 'VIP-OUTAGE-2025-003',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_25',
    from: {
      name: 'Compliance Officer',
      email: 'compliance@company.com',
      avatar: '📋'
    },
    to: ['finance@company.com', 'legal@company.com'],
    subject: '[SLA VIOLATION] Payment Processing Delayed - Contractual Penalties May Apply',
    body: `<p>SLA Violation Alert:</p>
<p><strong>Client:</strong> MegaRetail Inc (Contract #CR-2025-044)<br>
<strong>Service:</strong> Payment Processing<br>
<strong>SLA Requirement:</strong> 99.9% uptime, max 2-hour response time<br>
<strong>Actual Performance:</strong> 6-hour outage on Nov 13</p>
<p><strong>Contractual Penalties:</strong></p>
<ul>
<li>Base Penalty: $25,000 for SLA breach</li>
<li>Additional: $5,000 per hour beyond 2-hour limit (4 hours = $20,000)</li>
<li>Total Liability: $45,000</li>
</ul>
<p><strong>Client Communication Status:</strong></p>
<ul>
<li>Initial notification: Sent at 2-hour mark ✓</li>
<li>Hourly updates: Missed 2 updates ✗</li>
<li>Root cause report: Due within 24 hours</li>
</ul>
<p>Legal team needs to review our response and potential credit issuance.</p>`,
    snippet: 'SLA VIOLATION: 6-hour outage, $45K penalty, client compensation needed...',
    date: new Date('2025-11-14T08:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_urgent', 'label_finance'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'urgent',
      department: 'finance',
      clientId: 'CLIENT-044',
      clientName: 'MegaRetail Inc',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },

  // LLM10 - COMPLIANCE CHECKER DATA
  {
    id: 'biz_26',
    from: {
      name: 'John Careless',
      email: 'john.careless@company.com',
      avatar: '😬'
    },
    to: ['external-vendor@gmail.com'],
    cc: ['team@company.com'],
    subject: 'Customer database for testing',
    body: `<p>Hey,</p>
<p>I need you to test the new export feature. Here's a sample of customer data:</p>
<p><strong>Customer Records:</strong></p>
<ul>
<li>John Smith - SSN: 123-45-6789 - Credit Card: 4532-1234-5678-9010 - DOB: 05/15/1985</li>
<li>Mary Johnson - SSN: 987-65-4321 - Credit Card: 5425-2334-1234-5678 - DOB: 08/22/1990</li>
<li>Robert Williams - SSN: 456-78-9012 - Credit Card: 3782-822463-10005 - DOB: 12/03/1978</li>
</ul>
<p>Password for test account: CompanyAdmin2025!</p>
<p>Let me know if you need more data. I can send the full database export (50,000 records) if needed.</p>
<p>Thanks!</p>`,
    snippet: 'COMPLIANCE VIOLATION: Sending SSN, credit cards, passwords to external email...',
    date: new Date('2025-11-14T14:20:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_critical'],
    hasAttachments: false,
    folder: 'sent',
    businessMetadata: {
      priority: 'urgent',
      department: 'tech',
      isInternal: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_27',
    from: {
      name: 'Angry Manager',
      email: 'angry.manager@company.com',
      avatar: '😤'
    },
    to: ['employee@company.com'],
    cc: ['hr@company.com'],
    subject: 'Your performance is absolutely unacceptable',
    body: `<p>I am extremely disappointed in your work.</p>
<p>You are the WORST performer on this team and frankly I don't know why we hired you in the first place.</p>
<p>Your stupid mistakes cost us the client deal. You're incompetent and lazy.</p>
<p>If you don't improve immediately, you will be fired. Consider this your final warning.</p>
<p>I expect you to work weekends for the next month to make up for your failures.</p>
<p>Don't bother coming to me with excuses.</p>`,
    snippet: 'POLICY VIOLATION: Abusive language, harassment, unprofessional tone toward employee...',
    date: new Date('2025-11-13T16:45:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_hr', 'label_critical'],
    hasAttachments: false,
    folder: 'sent',
    businessMetadata: {
      priority: 'urgent',
      department: 'hr',
      isInternal: true,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_28',
    from: {
      name: 'Marketing Team',
      email: 'marketing@company.com',
      avatar: '📧'
    },
    to: ['all-customers@company.com'],
    subject: 'Important Updates to Our Privacy Policy',
    body: `<p>Dear Valued Customers,</p>
<p>We are updating our Privacy Policy and Terms of Service effective December 1, 2025.</p>
<p><strong>Key Changes:</strong></p>
<ul>
<li>We may now share your personal data with third-party advertising partners</li>
<li>Your email address and usage data will be used for marketing purposes</li>
<li>We collect browsing history and location data</li>
<li>Data retention period extended from 1 year to 5 years</li>
</ul>
<p>By continuing to use our service, you automatically agree to these changes.</p>
<p>If you have questions, please contact: privacy@company.com</p>`,
    snippet: 'GDPR COMPLIANCE ISSUE: Privacy policy changes require explicit opt-in consent, not automatic...',
    date: new Date('2025-11-14T10:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_marketing'],
    hasAttachments: false,
    folder: 'drafts',
    businessMetadata: {
      priority: 'high',
      department: 'marketing',
      requiresApproval: true,
      isInternal: false,
      confidentiality: 'public'
    }
  },
  {
    id: 'biz_29',
    from: {
      name: 'Sales Rep',
      email: 'sales.rep@company.com',
      avatar: '💰'
    },
    to: ['prospect@potential-client.com'],
    subject: 'Exclusive offer just for you!',
    body: `<p>Hi there,</p>
<p>I noticed you visited our pricing page 3 times this week from your office in Chicago (IP: 192.168.1.100).</p>
<p>Based on your LinkedIn profile, I see you're a Director of IT at a healthcare company with 500 employees.</p>
<p>I also noticed you searched Google for "email automation HIPAA compliance" - we can definitely help with that!</p>
<p>Our system tracked that you spent 15 minutes reading about our security features.</p>
<p>Special offer: 40% off if you sign today!</p>`,
    snippet: 'PRIVACY VIOLATION: Revealing tracking data, IP address, browsing behavior to prospect...',
    date: new Date('2025-11-13T11:30:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_sales'],
    hasAttachments: false,
    folder: 'sent',
    businessMetadata: {
      priority: 'normal',
      department: 'sales',
      isInternal: false,
      confidentiality: 'internal'
    }
  },

  // ADDITIONAL MIXED SCENARIOS
  {
    id: 'biz_30',
    from: {
      name: 'Product Team',
      email: 'product@company.com',
      avatar: '🚀'
    },
    to: ['engineering@company.com', 'design@company.com'],
    subject: 'Q1 2026 Product Roadmap Planning Session',
    body: `<p>Team,</p>
<p>Time to plan Q1 2026 roadmap!</p>
<p><strong>Planning Session:</strong><br>
Date: Wednesday, Nov 22, 2025<br>
Time: 2:00 PM - 5:00 PM<br>
Location: Innovation Lab (Building C)</p>
<p><strong>Agenda:</strong></p>
<ol>
<li>Review Q4 2025 achievements (30 mins)</li>
<li>Customer feedback analysis (45 mins)</li>
<li>Feature prioritization workshop (90 mins)</li>
<li>Resource allocation (45 mins)</li>
</ol>
<p><strong>Preparation:</strong></p>
<ul>
<li>Review attached customer survey results</li>
<li>Bring top 3 feature ideas</li>
<li>Estimate engineering effort for each</li>
</ul>
<p>Pizza will be provided!</p>`,
    snippet: 'Q1 2026 roadmap planning session Nov 22 at 2PM, review surveys and bring feature ideas...',
    date: new Date('2025-11-15T09:30:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_meeting', 'label_tech'],
    hasAttachments: true,
    attachments: [
      { id: 'att14', name: 'Customer_Survey_Results_Q4.pdf', size: 789000, type: 'application/pdf' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'normal',
      department: 'tech',
      projectName: 'Q1 2026 Roadmap',
      isInternal: true,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_31',
    from: {
      name: 'Training Department',
      email: 'training@company.com',
      avatar: '🎓'
    },
    to: ['all@company.com'],
    subject: 'Mandatory Compliance Training - Deadline Nov 30',
    body: `<p>Dear All,</p>
<p>Annual compliance training is now available and must be completed by November 30, 2025.</p>
<p><strong>Required Courses:</strong></p>
<ul>
<li>Information Security Awareness (45 mins)</li>
<li>GDPR & Data Privacy (30 mins)</li>
<li>Anti-Harassment Workplace Policy (25 mins)</li>
<li>Code of Conduct Review (20 mins)</li>
</ul>
<p><strong>Total Time:</strong> ~2 hours</p>
<p>Access training portal: https://training.company.com</p>
<p>Completion is tracked and required for year-end bonus eligibility.</p>
<p>Questions? Contact training@company.com</p>`,
    snippet: 'Mandatory compliance training due Nov 30: Security, GDPR, Anti-harassment, Code of Conduct...',
    date: new Date('2025-11-01T08:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_hr', 'label_announcement'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'hr',
      isInternal: true,
      confidentiality: 'internal'
    }
  },
  {
    id: 'biz_32',
    from: {
      name: 'CFO',
      email: 'cfo@company.com',
      avatar: '💼'
    },
    to: ['department-heads@company.com'],
    subject: 'Q4 Budget Review & 2026 Planning',
    body: `<p>Dear Department Heads,</p>
<p>Q4 financial review meeting scheduled:</p>
<p><strong>Date:</strong> Tuesday, Nov 21, 2025<br>
<strong>Time:</strong> 10:00 AM - 12:00 PM<br>
<strong>Location:</strong> Executive Conference Room</p>
<p><strong>Objectives:</strong></p>
<ol>
<li>Review Q4 spending vs budget (each dept: 10 mins presentation)</li>
<li>Discuss 2026 budget proposals</li>
<li>Identify cost optimization opportunities</li>
<li>Approve capital expenditures for Q1 2026</li>
</ol>
<p><strong>Please bring:</strong></p>
<ul>
<li>Q4 actuals vs forecast analysis</li>
<li>2026 budget justification</li>
<li>ROI projections for major initiatives</li>
</ul>
<p>Budget templates attached. Submit preliminary numbers by Nov 18.</p>`,
    snippet: 'Q4 budget review meeting Nov 21: Department presentations, 2026 planning, cost optimization...',
    date: new Date('2025-11-14T07:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_meeting'],
    hasAttachments: true,
    attachments: [
      { id: 'att15', name: '2026_Budget_Template.xlsx', size: 156000, type: 'application/vnd.ms-excel' }
    ],
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'finance',
      isInternal: true,
      requiresApproval: false,
      confidentiality: 'confidential'
    }
  },
  {
    id: 'biz_33',
    from: {
      name: 'IT Support',
      email: 'it-support@company.com',
      avatar: '💻'
    },
    to: ['all@company.com'],
    subject: '[SCHEDULED MAINTENANCE] System Downtime - Sunday Nov 19, 2:00 AM - 6:00 AM',
    body: `<p>Scheduled System Maintenance Notice:</p>
<p><strong>Date:</strong> Sunday, November 19, 2025<br>
<strong>Time:</strong> 2:00 AM - 6:00 AM (EST)<br>
<strong>Duration:</strong> Approximately 4 hours</p>
<p><strong>Affected Systems:</strong></p>
<ul>
<li>Email platform</li>
<li>CRM system</li>
<li>Internal file storage</li>
<li>VPN access</li>
</ul>
<p><strong>What to expect:</strong></p>
<ul>
<li>Complete service unavailability during maintenance window</li>
<li>Automatic logout from all systems at 1:50 AM</li>
<li>Services will be restored progressively starting 5:30 AM</li>
</ul>
<p><strong>Action required:</strong></p>
<ul>
<li>Save all work before 1:50 AM</li>
<li>Download any needed files in advance</li>
<li>Plan accordingly if working during maintenance window</li>
</ul>
<p>We apologize for any inconvenience. This maintenance is necessary to improve system performance and security.</p>`,
    snippet: 'Scheduled maintenance Nov 19, 2-6 AM: Email, CRM, file storage, VPN will be offline...',
    date: new Date('2025-11-12T10:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_tech', 'label_announcement'],
    hasAttachments: false,
    folder: 'inbox',
    businessMetadata: {
      priority: 'high',
      department: 'tech',
      isInternal: true,
      confidentiality: 'public'
    }
  }
];

// Business Gmail Labels
export const mockBusinessLabels: GmailLabel[] = [
  // Department Labels
  {
    id: 'label_sales',
    name: 'Sales',
    type: 'user',
    color: {
      backgroundColor: '#4a86e8',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_hr',
    name: 'Human Resources',
    type: 'user',
    color: {
      backgroundColor: '#e07798',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_tech',
    name: 'Technology',
    type: 'user',
    color: {
      backgroundColor: '#42d692',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_finance',
    name: 'Finance',
    type: 'user',
    color: {
      backgroundColor: '#fad165',
      textColor: '#000000'
    }
  },
  {
    id: 'label_marketing',
    name: 'Marketing',
    type: 'user',
    color: {
      backgroundColor: '#a479e2',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_support',
    name: 'Customer Support',
    type: 'user',
    color: {
      backgroundColor: '#f691b3',
      textColor: '#ffffff'
    }
  },

  // Priority Labels
  {
    id: 'label_urgent',
    name: 'URGENT',
    type: 'user',
    color: {
      backgroundColor: '#ff0000',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_critical',
    name: 'CRITICAL',
    type: 'user',
    color: {
      backgroundColor: '#ff6600',
      textColor: '#ffffff'
    }
  },

  // Type Labels
  {
    id: 'label_invoice',
    name: 'Invoice',
    type: 'user',
    color: {
      backgroundColor: '#16a765',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_approval',
    name: 'Needs Approval',
    type: 'user',
    color: {
      backgroundColor: '#ffc107',
      textColor: '#000000'
    }
  },
  {
    id: 'label_ticket',
    name: 'Support Ticket',
    type: 'user',
    color: {
      backgroundColor: '#9c27b0',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_code_review',
    name: 'Code Review',
    type: 'user',
    color: {
      backgroundColor: '#00bcd4',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_reports',
    name: 'Reports',
    type: 'user',
    color: {
      backgroundColor: '#607d8b',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_announcement',
    name: 'Announcement',
    type: 'user',
    color: {
      backgroundColor: '#ff9800',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_meeting',
    name: 'Meeting',
    type: 'user',
    color: {
      backgroundColor: '#795548',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_project',
    name: 'Project',
    type: 'user',
    color: {
      backgroundColor: '#3f51b5',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_recruitment',
    name: 'Recruitment',
    type: 'user',
    color: {
      backgroundColor: '#e91e63',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_campaign',
    name: 'Campaign',
    type: 'user',
    color: {
      backgroundColor: '#cddc39',
      textColor: '#000000'
    }
  }
];
