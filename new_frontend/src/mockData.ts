import { Email, EmailFolder, GmailLabel } from './types';

export const mockEmails: Email[] = [
  {
    id: '1',
    from: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@company.com',
      avatar: '👨‍💼'
    },
    to: ['me@gmail.com'],
    subject: 'Họp team sáng mai - Báo cáo Q4',
    body: `<p>Chào bạn,</p>
<p>Nhờ bạn chuẩn bị báo cáo dự án cho buổi họp vào <strong>9h sáng mai</strong> tại phòng họp tầng 3.</p>
<p>Gửi giúp mình file báo cáo trước 8h nhé.</p>
<p>Cảm ơn!</p>`,
    snippet: 'Nhờ bạn chuẩn bị báo cáo dự án cho buổi họp vào 9h sáng mai tại phòng họp tầng 3...',
    date: new Date('2025-11-12T14:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_work', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '2',
    from: {
      name: 'Mẹ',
      email: 'me.yeu@gmail.com',
      avatar: '👩'
    },
    to: ['me@gmail.com'],
    subject: 'Nhớ mua rau về',
    body: `<p>Con ơi,</p>
<p>Chiều nay về nhớ mua giúp mẹ <strong>1kg rau cải</strong> và <strong>500g thịt ba chỉ</strong> nhé.</p>
<p>Tối nay mẹ nấu canh rau.</p>
<p>Thương con! ❤️</p>`,
    snippet: 'Chiều nay về nhớ mua giúp mẹ 1kg rau cải và 500g thịt ba chỉ nhé...',
    date: new Date('2025-11-12T10:15:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_family', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '3',
    from: {
      name: 'Trần Thị B',
      email: 'tranthib@partner.vn',
      avatar: '👩‍💼'
    },
    to: ['me@gmail.com'],
    cc: ['team@partner.vn'],
    subject: 'Re: Hợp đồng hợp tác Q4',
    body: `<p>Chào anh/chị,</p>
<p>Em đã xem qua hợp đồng. Có một số điểm cần trao đổi thêm về điều khoản thanh toán và thời gian bàn giao.</p>
<p>Anh chị có thể sắp xếp cuộc họp vào <strong>thứ 4 tuần sau</strong> được không ạ?</p>
<p>Trân trọng!</p>`,
    snippet: 'Em đã xem qua hợp đồng. Có một số điểm cần trao đổi thêm về điều khoản thanh toán...',
    date: new Date('2025-11-12T09:00:00'),
    isRead: true,
    isStarred: true,
    labels: ['label_work', 'label_task'],
    hasAttachments: true,
    attachments: [
      { id: 'a1', name: 'Contract_Q4_Draft.pdf', size: 245000, type: 'application/pdf' }
    ],
    folder: 'inbox'
  },
  {
    id: '4',
    from: {
      name: 'Marketing Team',
      email: 'promo@shopping.vn',
      avatar: '🛒'
    },
    to: ['me@gmail.com'],
    subject: '🎉 SALE 50% - Khuyến mãi khủng cuối tuần',
    body: `<h2>🎉 SALE KHỦNG CUỐI TUẦN</h2>
<p>Đừng bỏ lỡ chương trình SALE khủng cuối tuần với hàng nghìn sản phẩm giảm giá lên đến <strong style="color: red;">50%</strong>!</p>
<p><a href="#">Click ngay để mua sắm</a></p>`,
    snippet: 'Đừng bỏ lỡ chương trình SALE khủng cuối tuần với hàng nghìn sản phẩm giảm giá lên đến 50%!',
    date: new Date('2025-11-11T20:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '5',
    from: {
      name: 'Lê Văn C',
      email: 'levanc@friend.com',
      avatar: '🧑'
    },
    to: ['me@gmail.com'],
    subject: 'Cuối tuần đi cà phê không?',
    body: `<p>Ê bro,</p>
<p>Lâu rồi không gặp! Cuối tuần này mình rủ mấy đứa đi cà phê <strong>The Coffee House</strong> gần trường cũ.</p>
<p>Mày có rảnh không?</p>
<p>Ping mình nhé! 😊</p>`,
    snippet: 'Lâu rồi không gặp! Cuối tuần này mình rủ mấy đứa đi cà phê The Coffee House...',
    date: new Date('2025-11-11T18:30:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_friends'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '6',
    from: {
      name: 'HR Department',
      email: 'hr@company.com',
      avatar: '🏢'
    },
    to: ['all@company.com'],
    subject: 'Thông báo: Đăng ký khám sức khỏe định kỳ',
    body: `<p>Kính gửi anh/chị,</p>
<p>Công ty thông báo lịch khám sức khỏe định kỳ cho nhân viên.</p>
<p>Anh chị vui lòng đăng ký trước ngày <strong>15/11</strong> qua link bên dưới.</p>
<p><a href="#">Link đăng ký</a></p>
<p>Thân mến,<br>Phòng Nhân sự</p>`,
    snippet: 'Công ty thông báo lịch khám sức khỏe định kỳ cho nhân viên. Vui lòng đăng ký trước 15/11...',
    date: new Date('2025-11-11T15:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_work', 'label_task'],
    hasAttachments: true,
    attachments: [
      { id: 'a2', name: 'Health_Check_Form.xlsx', size: 125000, type: 'application/vnd.ms-excel' }
    ],
    folder: 'inbox'
  },
  {
    id: '7',
    from: {
      name: 'Ngân hàng Vietcombank',
      email: 'noreply@vietcombank.com.vn',
      avatar: '🏦'
    },
    to: ['me@gmail.com'],
    subject: 'Thông báo: Hóa đơn thẻ tín dụng tháng 11',
    body: `<p>Kính gửi Quý khách,</p>
<p>Vietcombank xin thông báo hóa đơn thẻ tín dụng của Quý khách:</p>
<p><strong>Số tiền:</strong> 5,450,000 VND<br>
<strong>Hạn thanh toán:</strong> 25/11/2025<br>
<strong>Số thẻ:</strong> **** **** **** 1234</p>
<p>Vui lòng thanh toán đúng hạn để tránh phí phạt.</p>
<p>Trân trọng!</p>`,
    snippet: 'Vietcombank xin thông báo hóa đơn thẻ tín dụng: 5,450,000 VND, hạn thanh toán 25/11/2025',
    date: new Date('2025-11-11T12:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '8',
    from: {
      name: 'Netflix',
      email: 'info@netflix.com',
      avatar: '🎬'
    },
    to: ['me@gmail.com'],
    subject: 'Your Netflix subscription will renew tomorrow',
    body: `<p>Hi,</p>
<p>Your Netflix subscription will automatically renew tomorrow.</p>
<p><strong>Amount:</strong> $15.99</p>
<p>If you have any questions, visit our <a href="#">Help Center</a>.</p>`,
    snippet: 'Your Netflix subscription will automatically renew tomorrow. Amount: $15.99',
    date: new Date('2025-11-10T08:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '9',
    from: {
      name: 'Bố',
      email: 'ba.yeu@gmail.com',
      avatar: '👨'
    },
    to: ['me@gmail.com'],
    subject: 'Cuối tuần về nhà ăn cơm',
    body: `<p>Con,</p>
<p>Cuối tuần này về nhà ăn cơm nhé. Bố nấu món con thích.</p>
<p>Nhớ con! 🏠</p>`,
    snippet: 'Cuối tuần này về nhà ăn cơm nhé. Bố nấu món con thích. Nhớ con!',
    date: new Date('2025-11-10T07:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_family'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '10',
    from: {
      name: 'Điện lực Hà Nội',
      email: 'cskh@evnhanoi.vn',
      avatar: '⚡'
    },
    to: ['me@gmail.com'],
    subject: 'Thông báo: Hóa đơn tiền điện tháng 11/2025',
    body: `<p>Kính gửi Quý khách hàng,</p>
<p>Công ty Điện lực Hà Nội thông báo hóa đơn tiền điện tháng 11/2025:</p>
<p><strong>Số tiền:</strong> 1,250,000 VND<br>
<strong>Kỳ đọc:</strong> 01/11 - 30/11<br>
<strong>Hạn thanh toán:</strong> 20/12/2025</p>
<p>Quý khách vui lòng thanh toán qua App EVN Hanoi hoặc tại cửa hàng tiện lợi.</p>
<p>Trân trọng!</p>`,
    snippet: 'Hóa đơn tiền điện tháng 11: 1,250,000 VND, hạn thanh toán 20/12/2025',
    date: new Date('2025-11-09T10:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance'],
    hasAttachments: false,
    folder: 'inbox'
  },
  // SENT EMAILS
  {
    id: 's1',
    from: {
      name: 'Me',
      email: 'me@gmail.com',
      avatar: '👤'
    },
    to: ['client@company.com'],
    subject: 'Re: Project proposal for Q4',
    body: `<p>Hi,</p>
<p>Thank you for your proposal. I've reviewed it and have some feedback.</p>
<p>Let's schedule a call next week to discuss.</p>
<p>Best regards</p>`,
    snippet: 'Thank you for your proposal. I\'ve reviewed it and have some feedback...',
    date: new Date('2025-11-11T16:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_work'],
    hasAttachments: false,
    folder: 'sent'
  },
  {
    id: 's2',
    from: {
      name: 'Me',
      email: 'me@gmail.com',
      avatar: '👤'
    },
    to: ['friend@gmail.com'],
    subject: 'Happy Birthday! 🎂',
    body: `<p>Hey!</p>
<p>Happy birthday! 🎉🎂 Wish you all the best!</p>
<p>Let's celebrate this weekend!</p>`,
    snippet: 'Happy birthday! 🎉 Wish you all the best! Let\'s celebrate this weekend!',
    date: new Date('2025-11-10T09:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_friends'],
    hasAttachments: false,
    folder: 'sent'
  },
  // DRAFTS
  {
    id: 'd1',
    from: {
      name: 'Me',
      email: 'me@gmail.com',
      avatar: '👤'
    },
    to: ['partner@business.com'],
    subject: '(No subject)',
    body: `<p>Dear Partner,</p>
<p>I would like to discuss...</p>`,
    snippet: 'I would like to discuss...',
    date: new Date('2025-11-12T11:00:00'),
    isRead: true,
    isStarred: false,
    labels: [],
    hasAttachments: false,
    folder: 'drafts',
    isDraft: true
  }
];

// Mock Gmail Labels (giống như real data)
export const mockGmailLabels: GmailLabel[] = [
  {
    id: 'label_work',
    name: 'Công việc',
    type: 'user',
    color: {
      backgroundColor: '#4a86e8',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_family',
    name: 'Người thân & Gia đình',
    type: 'user',
    color: {
      backgroundColor: '#e07798',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_friends',
    name: 'Bạn bè',
    type: 'user',
    color: {
      backgroundColor: '#42d692',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_finance',
    name: 'Tài chính',
    type: 'user',
    color: {
      backgroundColor: '#fad165',
      textColor: '#000000'
    }
  },
  {
    id: 'label_spam',
    name: 'Spam & Quảng cáo',
    type: 'user',
    color: {
      backgroundColor: '#a0a0a0',
      textColor: '#ffffff'
    }
  },
  {
    id: 'label_task',
    name: '📋 Task for Agent 2',
    type: 'user',
    color: {
      backgroundColor: '#16a765',
      textColor: '#ffffff'
    }
  }
];

export const folders: { id: EmailFolder; name: string; icon: string }[] = [
  { id: 'inbox', name: 'Inbox', icon: 'Inbox' },
  { id: 'starred', name: 'Starred', icon: 'Star' },
  { id: 'sent', name: 'Sent', icon: 'Send' },
  { id: 'drafts', name: 'Drafts', icon: 'FileText' },
  { id: 'spam', name: 'Spam', icon: 'AlertCircle' },
  { id: 'trash', name: 'Trash', icon: 'Trash2' },
  { id: 'all', name: 'All Mail', icon: 'MoreHorizontal' }
];
