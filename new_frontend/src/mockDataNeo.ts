import { Email } from './types';

/**
 * Mock data for NEO Blocktrain Hackathon
 * Focus: Financial transactions, payments, contracts on NEO blockchain
 * 20 emails with financial tags for smart contract integration testing
 */

export const mockNeoEmails: Email[] = [
  {
    id: 'neo_1',
    from: {
      name: 'NEO Foundation',
      email: 'foundation@neo.org',
      avatar: '🟢'
    },
    to: ['me@gmail.com'],
    subject: 'Grant Payment Approved - $50,000 for Smart Economy Project',
    body: `<p>Dear Developer,</p>
<p>Congratulations! Your NEO smart economy project has been approved for funding.</p>
<p><strong>Grant Amount:</strong> $50,000 USD (equivalent in GAS)</p>
<p><strong>Payment Schedule:</strong></p>
<ul>
  <li>Phase 1: $20,000 - Due: December 1, 2025</li>
  <li>Phase 2: $15,000 - Due: January 15, 2026</li>
  <li>Phase 3: $15,000 - Due: March 1, 2026</li>
</ul>
<p><strong>Wallet Address:</strong> NXXzKhVCdT7qJgNDh2tCWHHkPwcwKCKZsb</p>
<p>Please submit your milestone reports for disbursement.</p>
<p>Best regards,<br>NEO Foundation Team</p>`,
    snippet: 'Your NEO smart economy project has been approved for $50,000 funding in GAS...',
    date: new Date('2025-11-10T09:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_important'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_2',
    from: {
      name: 'GAS Trading Alert',
      email: 'alerts@neotracker.io',
      avatar: '💹'
    },
    to: ['me@gmail.com'],
    subject: 'GAS Price Alert: $45.30 (+12.5% in 24h)',
    body: `<p>GAS Price Movement Alert</p>
<p><strong>Current Price:</strong> $45.30 USD</p>
<p><strong>24h Change:</strong> +12.5% ↑</p>
<p><strong>24h Volume:</strong> $28.5M</p>
<p><strong>Your Holdings:</strong> 850 GAS ($38,505 USD)</p>
<p><strong>Unrealized Profit:</strong> +$4,280 (12.5%)</p>
<p>Consider taking profits or setting stop-loss orders.</p>
<p><a href="#">View detailed analytics</a></p>`,
    snippet: 'GAS price increased 12.5% to $45.30. Your 850 GAS holdings worth $38,505...',
    date: new Date('2025-11-12T15:45:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_3',
    from: {
      name: 'Flamingo Finance',
      email: 'notifications@flamingo.finance',
      avatar: '🦩'
    },
    to: ['me@gmail.com'],
    subject: 'Staking Rewards Distributed - 125 FLM Earned',
    body: `<p>Hello Flamingo User,</p>
<p>Your weekly staking rewards have been distributed!</p>
<p><strong>Period:</strong> Nov 5 - Nov 12, 2025</p>
<p><strong>Staked Amount:</strong> 10,000 FLM</p>
<p><strong>Rewards Earned:</strong> 125 FLM (~$62.50 USD)</p>
<p><strong>APY:</strong> 65%</p>
<p><strong>Total Staked Value:</strong> $5,000 USD</p>
<p><strong>Transaction Hash:</strong> 0xa4b5c6d7e8f9...</p>
<p>Your rewards have been automatically compounded. Continue staking to maximize returns!</p>
<p>Trade on Flamingo: <a href="#">https://flamingo.finance</a></p>`,
    snippet: 'Weekly staking rewards: 125 FLM earned (~$62.50). 65% APY on your 10,000 FLM stake...',
    date: new Date('2025-11-12T08:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_4',
    from: {
      name: 'NeoBurger',
      email: 'support@neoburger.io',
      avatar: '🍔'
    },
    to: ['me@gmail.com'],
    subject: 'Liquidity Pool Fee Revenue - $340 This Month',
    body: `<p>Hi Liquidity Provider,</p>
<p>Your monthly LP fee revenue summary:</p>
<p><strong>Pool:</strong> NEO/GAS</p>
<p><strong>Your Liquidity:</strong> $25,000 USD</p>
<p><strong>Pool Share:</strong> 2.3%</p>
<p><strong>Fee Revenue (Nov 1-12):</strong> $340</p>
<p><strong>Projected Monthly:</strong> ~$730</p>
<p><strong>Annual ROI:</strong> ~35%</p>
<p><strong>Breakdown:</strong></p>
<ul>
  <li>Trading Fees: $280</li>
  <li>BURGER Rewards: $60 (120 BURGER)</li>
</ul>
<p>Claim your rewards: <a href="#">https://neoburger.io/pools</a></p>`,
    snippet: 'LP fee revenue: $340 earned this month from NEO/GAS pool. Projected $730/month...',
    date: new Date('2025-11-11T12:30:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_5',
    from: {
      name: 'NEO Smart Contract Audit',
      email: 'audit@redforceaudits.com',
      avatar: '🔒'
    },
    to: ['me@gmail.com'],
    subject: 'Invoice #AUD-2025-NEO-447 - Smart Contract Security Audit',
    body: `<p>Dear Client,</p>
<p>Please find the invoice for your NEO N3 smart contract security audit.</p>
<p><strong>Invoice Number:</strong> AUD-2025-NEO-447</p>
<p><strong>Service:</strong> Comprehensive Smart Contract Security Audit</p>
<p><strong>Contract Type:</strong> NEP-17 Token + DeFi Protocol</p>
<p><strong>Amount Due:</strong> $8,500 USD</p>
<p><strong>Payment Methods:</strong></p>
<ul>
  <li>GAS: 188.89 GAS (at $45/GAS)</li>
  <li>NEO: 42.5 NEO (at $200/NEO)</li>
  <li>USDT (NEP-17): 8,500 USDT</li>
  <li>Bank Transfer: Available</li>
</ul>
<p><strong>Due Date:</strong> November 25, 2025</p>
<p><strong>Wallet Address:</strong> NZs8nkxzqNGkLGH3dZYw4Q5RpKbAqYqFcs</p>
<p>Audit report will be delivered within 14 days of payment confirmation.</p>
<p>Best regards,<br>RedForce Security Team</p>`,
    snippet: 'Invoice for NEO smart contract audit: $8,500 USD. Payment in GAS, NEO, or USDT...',
    date: new Date('2025-11-10T14:20:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_invoice', 'label_important'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_6',
    from: {
      name: 'Binance',
      email: 'no-reply@binance.com',
      avatar: '🟡'
    },
    to: ['me@gmail.com'],
    subject: 'Withdrawal Completed - 450 NEO to External Wallet',
    body: `<p>Dear User,</p>
<p>Your withdrawal has been processed successfully.</p>
<p><strong>Asset:</strong> NEO</p>
<p><strong>Amount:</strong> 450 NEO</p>
<p><strong>Network:</strong> NEO N3</p>
<p><strong>Destination:</strong> NYxH2f8Y4JGFbZ7...KpQq</p>
<p><strong>Fee:</strong> 0 NEO (Free withdrawal)</p>
<p><strong>TxID:</strong> 0x8d9e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e</p>
<p><strong>Time:</strong> 2025-11-12 07:15:30 UTC</p>
<p><strong>Status:</strong> Completed ✓</p>
<p>View transaction: <a href="#">NEO Explorer</a></p>
<p>Security reminder: Never share your private keys or seed phrase.</p>`,
    snippet: 'Withdrawal completed: 450 NEO transferred to your external wallet successfully...',
    date: new Date('2025-11-12T07:15:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_7',
    from: {
      name: 'Neo News Today',
      email: 'newsletter@neonewstoday.com',
      avatar: '📰'
    },
    to: ['me@gmail.com'],
    subject: 'NEO N3 DeFi TVL Reaches $420M - New All-Time High',
    body: `<p>NEO Ecosystem Weekly Update</p>
<p><strong>Top Stories:</strong></p>
<p>1. <strong>DeFi Growth:</strong> Total Value Locked (TVL) in NEO N3 DeFi protocols reached $420M, up 28% from last month.</p>
<p>2. <strong>New Integrations:</strong></p>
<ul>
  <li>Flamingo Finance: +$85M TVL</li>
  <li>ForTheWin: +$42M TVL</li>
  <li>NeoBurger: +$38M TVL</li>
</ul>
<p>3. <strong>Grant Winners:</strong> 12 projects received development grants totaling $850,000</p>
<p>4. <strong>Price Action:</strong></p>
<ul>
  <li>NEO: $198 (+15% weekly)</li>
  <li>GAS: $44 (+22% weekly)</li>
</ul>
<p><strong>Your Portfolio Impact:</strong> Based on your holdings, estimated gain: +$12,400 this week</p>`,
    snippet: 'NEO DeFi TVL hits $420M all-time high. Your portfolio estimated gain: +$12,400 this week...',
    date: new Date('2025-11-11T18:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_news'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_8',
    from: {
      name: 'NEO Smart Economy',
      email: 'hackathon@neo.org',
      avatar: '🏆'
    },
    to: ['me@gmail.com'],
    subject: 'Blocktrain Hackathon Prize - $15,000 Winner Notification',
    body: `<p>Congratulations Champion! 🎉</p>
<p>Your project has won the NEO Blocktrain Hackathon!</p>
<p><strong>Award:</strong> 1st Place - Best DeFi Innovation</p>
<p><strong>Prize:</strong> $15,000 USD in GAS</p>
<p><strong>Project:</strong> AI-Powered Email Smart Contract Manager</p>
<p><strong>Judges' Comments:</strong> "Innovative integration of AI agents with NEO smart contracts for automated financial workflow. Excellent use of NEP-17 standards and Oracle integration."</p>
<p><strong>Payment Details:</strong></p>
<ul>
  <li>Amount: 333.33 GAS (at $45/GAS)</li>
  <li>Your Wallet: NXXzKhVCdT7qJgNDh2tCWHHkPwcwKCKZsb</li>
  <li>Payment Date: November 20, 2025</li>
</ul>
<p><strong>Next Steps:</strong></p>
<ol>
  <li>Verify your wallet address</li>
  <li>Submit KYC documents (required for tax purposes)</li>
  <li>Join winner showcase event on Nov 18</li>
</ol>
<p>Outstanding work! We look forward to seeing your project on NEO mainnet.</p>
<p>Best regards,<br>NEO Blocktrain Team</p>`,
    snippet: 'You won NEO Blocktrain Hackathon! $15,000 prize in GAS for your AI Email Smart Contract project...',
    date: new Date('2025-11-13T16:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_important', 'label_prize'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_9',
    from: {
      name: 'Ghost Market',
      email: 'sales@ghostmarket.io',
      avatar: '👻'
    },
    to: ['me@gmail.com'],
    subject: 'NFT Sale Completed - Neo Punks #3847 Sold for 1,200 NEO',
    body: `<p>Your NFT has been sold!</p>
<p><strong>Collection:</strong> Neo Punks</p>
<p><strong>Token ID:</strong> #3847</p>
<p><strong>Sale Price:</strong> 1,200 NEO (~$238,000 USD)</p>
<p><strong>Marketplace Fee:</strong> 24 NEO (2%)</p>
<p><strong>Royalty Fee:</strong> 60 NEO (5%)</p>
<p><strong>Net Proceeds:</strong> 1,116 NEO (~$221,680 USD)</p>
<p><strong>Buyer:</strong> NXx8FhK...9pLmQ</p>
<p><strong>Transaction Hash:</strong> 0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d</p>
<p><strong>Settlement:</strong> Funds transferred to your wallet</p>
<p>Thank you for using Ghost Market! List more NFTs: <a href="#">https://ghostmarket.io</a></p>`,
    snippet: 'NFT sold! Neo Punks #3847 for 1,200 NEO. Net proceeds: 1,116 NEO (~$221,680)...',
    date: new Date('2025-11-09T22:30:00'),
    isRead: true,
    isStarred: true,
    labels: ['label_finance', 'label_nft'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_10',
    from: {
      name: 'NEO Global Development',
      email: 'grants@ngd.neo.org',
      avatar: '🌐'
    },
    to: ['me@gmail.com'],
    subject: 'Milestone Payment #2 Approved - $15,000 Released',
    body: `<p>Dear Grant Recipient,</p>
<p>Your milestone submission has been reviewed and approved!</p>
<p><strong>Project:</strong> NEO Smart Contract Email Automation</p>
<p><strong>Milestone:</strong> Phase 2 - AI Agent Integration</p>
<p><strong>Payment Amount:</strong> $15,000 USD</p>
<p><strong>Payment Method:</strong> 333.33 GAS</p>
<p><strong>Transaction Details:</strong></p>
<ul>
  <li>TxID: 0xf1e2d3c4b5a6978869504a3b2c1d0e9f8a7b6c5d</li>
  <li>Timestamp: 2025-11-11 10:30:00 UTC</li>
  <li>Status: Confirmed (15 blocks)</li>
</ul>
<p><strong>Remaining Grant:</strong> $15,000 (Phase 3)</p>
<p><strong>Next Milestone Due:</strong> March 1, 2026</p>
<p>Excellent progress! Your AI-powered email classification system shows great promise for the NEO ecosystem.</p>
<p>Continue building! 💚</p>`,
    snippet: 'Milestone payment approved: $15,000 in GAS released for Phase 2 completion...',
    date: new Date('2025-11-11T10:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_important'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_11',
    from: {
      name: 'Ledger Support',
      email: 'support@ledger.com',
      avatar: '🔐'
    },
    to: ['me@gmail.com'],
    subject: 'Hardware Wallet Purchase Receipt - Ledger Nano X',
    body: `<p>Thank you for your purchase!</p>
<p><strong>Order Number:</strong> LD-2025-NEO-8847</p>
<p><strong>Product:</strong> Ledger Nano X Hardware Wallet</p>
<p><strong>Quantity:</strong> 1</p>
<p><strong>Price:</strong> $149 USD</p>
<p><strong>Shipping:</strong> $15 USD</p>
<p><strong>Total:</strong> $164 USD</p>
<p><strong>Payment Method:</strong> 3.64 GAS</p>
<p><strong>Payment Status:</strong> Confirmed ✓</p>
<p><strong>Shipping Address:</strong> [Your Address]</p>
<p><strong>Expected Delivery:</strong> November 20-25, 2025</p>
<p><strong>Tracking Number:</strong> Will be sent within 24 hours</p>
<p>Secure your NEO, GAS, and NEP-17 tokens with confidence!</p>
<p><strong>Supported:</strong> NEO N3, NEO Legacy, 50+ cryptocurrencies</p>`,
    snippet: 'Purchase confirmed: Ledger Nano X for $164 paid in GAS. Delivery Nov 20-25...',
    date: new Date('2025-11-12T11:15:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_receipt'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_12',
    from: {
      name: 'NEO SPCC',
      email: 'notifications@nspcc.ru',
      avatar: '🛡️'
    },
    to: ['me@gmail.com'],
    subject: 'Neo-Go Node Monthly Hosting Fee - 18 GAS',
    body: `<p>Your NEO N3 node hosting invoice for November 2025</p>
<p><strong>Service:</strong> Neo-Go Full Node Hosting</p>
<p><strong>Plan:</strong> Enterprise Node (High Availability)</p>
<p><strong>Period:</strong> November 1-30, 2025</p>
<p><strong>Monthly Fee:</strong> 18 GAS (~$810 USD)</p>
<p><strong>Server Specs:</strong></p>
<ul>
  <li>CPU: 8 cores</li>
  <li>RAM: 32 GB</li>
  <li>Storage: 2 TB NVMe SSD</li>
  <li>Bandwidth: Unlimited</li>
  <li>Uptime: 99.95%</li>
</ul>
<p><strong>Payment Due:</strong> November 15, 2025</p>
<p><strong>Payment Address:</strong> NZXj9dPnKGPqZ4VxQ5RpLmN8sHwKyTcFgB</p>
<p><strong>Auto-payment:</strong> Enabled from your wallet</p>
<p>Your node RPC endpoint: https://node-12345.nspcc.ru</p>`,
    snippet: 'NEO node hosting invoice: 18 GAS (~$810) for November. Enterprise plan with 99.95% uptime...',
    date: new Date('2025-11-08T09:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_invoice'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_13',
    from: {
      name: 'Poly Network',
      email: 'bridge@poly.network',
      avatar: '🌉'
    },
    to: ['me@gmail.com'],
    subject: 'Cross-Chain Bridge Transfer Completed - 50,000 USDT to NEO',
    body: `<p>Your cross-chain transfer is complete!</p>
<p><strong>From:</strong> Ethereum Network</p>
<p><strong>To:</strong> NEO N3 Network</p>
<p><strong>Asset:</strong> USDT (Tether)</p>
<p><strong>Amount:</strong> 50,000 USDT</p>
<p><strong>Bridge Fee:</strong> 50 USDT (0.1%)</p>
<p><strong>Received Amount:</strong> 49,950 USDT (NEP-17)</p>
<p><strong>Source TxHash:</strong> 0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b (Ethereum)</p>
<p><strong>Destination TxHash:</strong> 0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g (NEO N3)</p>
<p><strong>Time:</strong> 2025-11-10 14:22:15 UTC</p>
<p><strong>Confirmations:</strong> 32/32 ✓</p>
<p>Your USDT is now available on NEO N3. Use it on Flamingo, NeoBurger, and other DeFi protocols!</p>`,
    snippet: 'Bridge transfer completed: 50,000 USDT from Ethereum to NEO N3. Ready for DeFi...',
    date: new Date('2025-11-10T14:25:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_14',
    from: {
      name: 'CoinGecko',
      email: 'alerts@coingecko.com',
      avatar: '🦎'
    },
    to: ['me@gmail.com'],
    subject: 'Portfolio Alert - NEO Holdings Up 24% This Week',
    body: `<p>Your NEO ecosystem portfolio update:</p>
<p><strong>Total Portfolio Value:</strong> $185,430 USD</p>
<p><strong>Weekly Change:</strong> +$35,880 (+24.0%) 📈</p>
<p><strong>Holdings Breakdown:</strong></p>
<ul>
  <li>450 NEO: $89,100 (+15%)</li>
  <li>850 GAS: $38,505 (+22%)</li>
  <li>10,000 FLM: $5,000 (+18%)</li>
  <li>120 BURGER: $360 (+25%)</li>
  <li>49,950 USDT: $49,950 (stable)</li>
  <li>1 Neo Punk NFT: $2,515 (+8%)</li>
</ul>
<p><strong>Best Performer:</strong> BURGER (+25%)</p>
<p><strong>DeFi Positions:</strong></p>
<ul>
  <li>Flamingo Staking: $5,000 (65% APY)</li>
  <li>NeoBurger LP: $25,000 (35% APY)</li>
</ul>
<p><strong>Projected Annual Income:</strong> ~$12,000 from staking/LP</p>`,
    snippet: 'Portfolio up 24% this week! Total value: $185,430. Best performer: BURGER +25%...',
    date: new Date('2025-11-12T18:00:00'),
    isRead: true,
    isStarred: true,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_15',
    from: {
      name: 'NEO Tracker',
      email: 'notifications@neotracker.io',
      avatar: '🔍'
    },
    to: ['me@gmail.com'],
    subject: 'Large Transaction Alert - 500 NEO Received',
    body: `<p>Large incoming transaction detected!</p>
<p><strong>Amount:</strong> 500 NEO (~$99,000 USD)</p>
<p><strong>From:</strong> NXx9FqK8zBvY3LmN...7cHwP</p>
<p><strong>To:</strong> Your Wallet (NYxH2f8Y4JGFbZ7...KpQq)</p>
<p><strong>Transaction Hash:</strong> 0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c</p>
<p><strong>Block Height:</strong> 8,450,332</p>
<p><strong>Timestamp:</strong> 2025-11-12 13:45:22 UTC</p>
<p><strong>Confirmations:</strong> 18 ✓</p>
<p><strong>Status:</strong> Confirmed</p>
<p><strong>Note:</strong> This transaction was flagged due to the large amount. Verify the sender if unexpected.</p>
<p>Your new NEO balance: 950 NEO (~$188,100 USD)</p>`,
    snippet: 'Large transaction alert: 500 NEO (~$99,000) received in your wallet...',
    date: new Date('2025-11-12T13:50:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_important'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_16',
    from: {
      name: 'Tax Advisory Services',
      email: 'crypto@taxadvisory.vn',
      avatar: '💼'
    },
    to: ['me@gmail.com'],
    subject: 'Crypto Tax Report Q4 2025 - NEO Transactions',
    body: `<p>Your quarterly cryptocurrency tax report is ready.</p>
<p><strong>Reporting Period:</strong> October 1 - December 31, 2025</p>
<p><strong>Total Transactions:</strong> 147 on NEO blockchain</p>
<p><strong>Capital Gains:</strong></p>
<ul>
  <li>Short-term gains: $18,500 (taxable)</li>
  <li>Long-term gains: $42,300 (taxable)</li>
</ul>
<p><strong>Income from DeFi:</strong></p>
<ul>
  <li>Staking rewards: $1,850 (FLM)</li>
  <li>LP fees: $2,720 (NEO/GAS pool)</li>
  <li>Grant payments: $35,000 (NEO Foundation)</li>
</ul>
<p><strong>Total Taxable Income:</strong> $100,370</p>
<p><strong>Estimated Tax Liability:</strong> $20,074 (20% rate)</p>
<p><strong>Service Fee:</strong> $850 USD</p>
<p><strong>Payment Due:</strong> November 30, 2025</p>
<p>Detailed 25-page report attached. Payment can be made in GAS, NEO, or bank transfer.</p>`,
    snippet: 'Q4 crypto tax report ready. Total taxable income: $100,370. Estimated tax: $20,074...',
    date: new Date('2025-11-12T16:30:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_finance', 'label_tax', 'label_invoice'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_17',
    from: {
      name: 'Forthewin Network',
      email: 'defi@forthewin.network',
      avatar: '🎮'
    },
    to: ['me@gmail.com'],
    subject: 'Yield Farm Harvest Ready - 580 FTW Tokens ($2,320)',
    body: `<p>Your yield farming rewards are ready to harvest!</p>
<p><strong>Farm:</strong> NEO-FTW LP Farm</p>
<p><strong>Your Staked LP:</strong> $15,000 USD value</p>
<p><strong>Farming Duration:</strong> 14 days</p>
<p><strong>Rewards Earned:</strong> 580 FTW tokens (~$2,320 USD)</p>
<p><strong>Current APR:</strong> 240%</p>
<p><strong>Bonus Multiplier:</strong> 1.5x (Early Farmer Bonus)</p>
<p><strong>Actions Available:</strong></p>
<ul>
  <li>Harvest FTW tokens</li>
  <li>Compound into LP (save gas fees)</li>
  <li>Stake FTW for more rewards (80% APY)</li>
</ul>
<p><strong>Next Harvest Recommended:</strong> In 7 days (optimal compound frequency)</p>
<p>Claim your rewards: <a href="#">https://forthewin.network/farms</a></p>`,
    snippet: 'Yield farm harvest ready: 580 FTW (~$2,320) from NEO-FTW LP. 240% APR active...',
    date: new Date('2025-11-11T20:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_18',
    from: {
      name: 'NEO DevCon 2026',
      email: 'registration@neodevcon.org',
      avatar: '🎫'
    },
    to: ['me@gmail.com'],
    subject: 'Conference Ticket Payment Confirmation - Early Bird',
    body: `<p>Your NEO DevCon 2026 registration is confirmed!</p>
<p><strong>Event:</strong> NEO Developer Conference 2026</p>
<p><strong>Date:</strong> February 15-17, 2026</p>
<p><strong>Location:</strong> Singapore Convention Center</p>
<p><strong>Ticket Type:</strong> Early Bird Developer Pass</p>
<p><strong>Price:</strong> $599 USD (saved $200)</p>
<p><strong>Payment Method:</strong> 13.31 GAS</p>
<p><strong>Payment Status:</strong> Confirmed ✓</p>
<p><strong>TxHash:</strong> 0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f</p>
<p><strong>Ticket Benefits:</strong></p>
<ul>
  <li>Access to all keynotes & workshops</li>
  <li>NEO swag bag ($150 value)</li>
  <li>Networking dinner with NEO founders</li>
  <li>Exclusive hackathon access</li>
  <li>6 months free NEO cloud services</li>
</ul>
<p>Your NFT ticket will be minted to your wallet within 48 hours.</p>
<p>See you in Singapore! 🇸🇬</p>`,
    snippet: 'NEO DevCon 2026 ticket confirmed! Early bird price $599 paid in GAS. Feb 15-17, Singapore...',
    date: new Date('2025-11-09T15:20:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_receipt', 'label_event'],
    hasAttachments: true,
    folder: 'inbox'
  },
  {
    id: 'neo_19',
    from: {
      name: 'NeoLine Wallet',
      email: 'support@neoline.io',
      avatar: '👛'
    },
    to: ['me@gmail.com'],
    subject: 'Monthly Transaction Summary - 89 Transactions in October',
    body: `<p>Your NeoLine Wallet monthly activity report</p>
<p><strong>Period:</strong> October 1-31, 2025</p>
<p><strong>Total Transactions:</strong> 89</p>
<p><strong>Transaction Breakdown:</strong></p>
<ul>
  <li>Transfers: 34 transactions</li>
  <li>Smart Contract Calls: 28 transactions</li>
  <li>DeFi Interactions: 18 transactions</li>
  <li>NFT Trades: 5 transactions</li>
  <li>Token Swaps: 4 transactions</li>
</ul>
<p><strong>Total Gas Fees Paid:</strong> 8.5 GAS (~$383 USD)</p>
<p><strong>Most Used dApps:</strong></p>
<ol>
  <li>Flamingo Finance (22 interactions)</li>
  <li>NeoBurger (14 interactions)</li>
  <li>Ghost Market (8 interactions)</li>
</ol>
<p><strong>Balance Changes:</strong></p>
<ul>
  <li>NEO: +120 NEO</li>
  <li>GAS: -185 GAS</li>
  <li>FLM: +3,400 FLM</li>
</ul>
<p><strong>Portfolio Value Change:</strong> +$22,500 (+13.8%)</p>`,
    snippet: 'October activity: 89 transactions, 8.5 GAS in fees. Portfolio up $22,500 (+13.8%)...',
    date: new Date('2025-11-07T12:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance', 'label_crypto'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: 'neo_20',
    from: {
      name: 'Smart Contract Royalty',
      email: 'payments@neocontract.io',
      avatar: '💰'
    },
    to: ['me@gmail.com'],
    subject: 'Monthly Royalty Payment - Your NEP-17 Token Contract',
    body: `<p>Your smart contract royalty payment for November 2025</p>
<p><strong>Contract:</strong> MyToken (MYTKN) - NEP-17</p>
<p><strong>Contract Hash:</strong> 0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5</p>
<p><strong>Total Supply:</strong> 100,000,000 MYTKN</p>
<p><strong>Monthly Transaction Volume:</strong> 2,450,000 MYTKN</p>
<p><strong>Transaction Fees Collected:</strong></p>
<ul>
  <li>Trading fees: 245 GAS</li>
  <li>Transfer fees: 122 GAS</li>
  <li>DEX listing fees: 50 GAS</li>
</ul>
<p><strong>Your Royalty (10%):</strong> 41.7 GAS (~$1,877 USD)</p>
<p><strong>Payment Status:</strong> Transferred to your wallet</p>
<p><strong>TxHash:</strong> 0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d</p>
<p><strong>Next Payment:</strong> December 15, 2025</p>
<p><strong>YTD Royalties:</strong> 458 GAS (~$20,610 USD)</p>
<p>Keep building on NEO! Your token has 15,847 holders and growing. 📈</p>`,
    snippet: 'Smart contract royalty: 41.7 GAS (~$1,877) from your NEP-17 token. YTD: $20,610...',
    date: new Date('2025-11-12T10:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_finance', 'label_crypto', 'label_royalty'],
    hasAttachments: false,
    folder: 'inbox'
  }
];

// Export summary statistics for testing
export const neoEmailStats = {
  totalEmails: 20,
  totalValue: '$685,430 USD',
  categories: {
    grants: 3,
    trading: 3,
    defi: 5,
    nft: 2,
    payments: 4,
    invoices: 3
  },
  financialTags: [
    'label_finance',
    'label_crypto',
    'label_invoice',
    'label_receipt',
    'label_nft',
    'label_tax',
    'label_royalty'
  ]
};
