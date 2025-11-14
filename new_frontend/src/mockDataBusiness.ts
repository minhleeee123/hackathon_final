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
  }
];

// Business Gmail Labels
export const mockBusinessLabels: GmailLabel[] = [
  // Department Labels
  {
    id: 'label_sales',
    name: '💼 Sales',
    type: 'user',
    color: {
      backgroundColor: '#4a86e8',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_hr',
    name: '👥 Human Resources',
    type: 'user',
    color: {
      backgroundColor: '#e07798',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_tech',
    name: '💻 Technology',
    type: 'user',
    color: {
      backgroundColor: '#42d692',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_finance',
    name: '💰 Finance',
    type: 'user',
    color: {
      backgroundColor: '#fad165',
      textColor: '#000000'
    }
  },
  {
    id: 'label_marketing',
    name: '📱 Marketing',
    type: 'user',
    color: {
      backgroundColor: '#a479e2',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_support',
    name: '🎧 Customer Support',
    type: 'user',
    color: {
      backgroundColor: '#f691b3',
      textColor: '#ffffff'
    }
  },

  // Priority Labels
  {
    id: 'label_urgent',
    name: '🚨 URGENT',
    type: 'user',
    color: {
      backgroundColor: '#ff0000',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_critical',
    name: '⚠️ CRITICAL',
    type: 'user',
    color: {
      backgroundColor: '#ff6600',
      textColor: '#ffffff'
    }
  },

  // Type Labels
  {
    id: 'label_invoice',
    name: '🧾 Invoice',
    type: 'user',
    color: {
      backgroundColor: '#16a765',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_approval',
    name: '✅ Needs Approval',
    type: 'user',
    color: {
      backgroundColor: '#ffc107',
      textColor: '#000000'
    }
  },
  {
    id: 'label_ticket',
    name: '🎫 Support Ticket',
    type: 'user',
    color: {
      backgroundColor: '#9c27b0',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_code_review',
    name: '👀 Code Review',
    type: 'user',
    color: {
      backgroundColor: '#00bcd4',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_reports',
    name: '📊 Reports',
    type: 'user',
    color: {
      backgroundColor: '#607d8b',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_announcement',
    name: '📢 Announcement',
    type: 'user',
    color: {
      backgroundColor: '#ff9800',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_meeting',
    name: '📅 Meeting',
    type: 'user',
    color: {
      backgroundColor: '#795548',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_project',
    name: '🚀 Project',
    type: 'user',
    color: {
      backgroundColor: '#3f51b5',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_recruitment',
    name: '🎯 Recruitment',
    type: 'user',
    color: {
      backgroundColor: '#e91e63',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_campaign',
    name: '🎉 Campaign',
    type: 'user',
    color: {
      backgroundColor: '#cddc39',
      textColor: '#000000'
    }
  }
];
