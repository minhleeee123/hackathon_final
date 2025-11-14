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
  {
    id: '11',
    from: {
      name: 'Phạm Minh D',
      email: 'phamminhd@tech.vn',
      avatar: '💻'
    },
    to: ['me@gmail.com'],
    subject: 'Code Review Request - Feature ABC',
    body: `<p>Hi team,</p>
<p>Mình đã push code lên branch feature/ABC. Nhờ mọi người review giúp mình.</p>
<p>PR link: <a href="#">github.com/project/pull/123</a></p>
<p>Deadline: <strong>Thứ 5 tuần này</strong></p>`,
    snippet: 'Mình đã push code lên branch feature/ABC. Nhờ mọi người review giúp...',
    date: new Date('2025-11-09T14:20:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_work', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '12',
    from: {
      name: 'Amazon',
      email: 'noreply@amazon.com',
      avatar: '📦'
    },
    to: ['me@gmail.com'],
    subject: 'Your package has been delivered',
    body: `<p>Good news!</p>
<p>Your package has been delivered to your address.</p>
<p><strong>Order #:</strong> 123-4567890-1234567<br>
<strong>Delivered at:</strong> 2:30 PM</p>`,
    snippet: 'Your package has been delivered to your address. Order #123-4567890-1234567',
    date: new Date('2025-11-09T14:30:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '13',
    from: {
      name: 'Chị gái',
      email: 'chi.yeu@gmail.com',
      avatar: '👧'
    },
    to: ['me@gmail.com'],
    subject: 'Sinh nhật cháu vào CN này',
    body: `<p>Em ơi,</p>
<p>CN này là sinh nhật cháu Minh, chị tổ chức tiệc tại nhà.</p>
<p>Em nhớ sắp xếp về tham gia nhé! Bọn trẻ con rất mong gặp chú.</p>
<p>Yêu em! 💕</p>`,
    snippet: 'CN này là sinh nhật cháu Minh, chị tổ chức tiệc tại nhà...',
    date: new Date('2025-11-09T11:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_family'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '14',
    from: {
      name: 'Shopee',
      email: 'promotion@shopee.vn',
      avatar: '🛍️'
    },
    to: ['me@gmail.com'],
    subject: '⚡ Flash Sale 12h trưa - Giảm đến 90%',
    body: `<h2>⚡ FLASH SALE 12H TRƯA</h2>
<p>Săn sale liền tay với <strong>hàng nghìn sản phẩm giảm sốc đến 90%</strong>!</p>
<p>Chỉ trong 2 giờ duy nhất! ⏰</p>
<p><a href="#">Mua ngay</a></p>`,
    snippet: 'Săn sale liền tay với hàng nghìn sản phẩm giảm sốc đến 90%!',
    date: new Date('2025-11-09T11:45:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '15',
    from: {
      name: 'Hoàng Anh E',
      email: 'hoanganhe@friend.com',
      avatar: '🎮'
    },
    to: ['me@gmail.com'],
    subject: 'Tối nay chơi game không?',
    body: `<p>Yo bro!</p>
<p>Tối nay rảnh không? Team mình thiếu 1 người chơi ranked.</p>
<p>Lên voice Discord lúc <strong>8h tối</strong> nhé!</p>
<p>GG! 🎮</p>`,
    snippet: 'Tối nay rảnh không? Team mình thiếu 1 người chơi ranked...',
    date: new Date('2025-11-08T17:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_friends'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '16',
    from: {
      name: 'Công ty nước sạch',
      email: 'cskh@hawacom.vn',
      avatar: '💧'
    },
    to: ['me@gmail.com'],
    subject: 'Hóa đơn nước tháng 11/2025',
    body: `<p>Kính gửi Quý khách,</p>
<p>Hóa đơn tiền nước tháng 11/2025:</p>
<p><strong>Số tiền:</strong> 180,000 VND<br>
<strong>Tiêu thụ:</strong> 15m³<br>
<strong>Hạn thanh toán:</strong> 28/11/2025</p>
<p>Vui lòng thanh toán đúng hạn.</p>`,
    snippet: 'Hóa đơn tiền nước tháng 11: 180,000 VND, hạn thanh toán 28/11',
    date: new Date('2025-11-08T09:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '17',
    from: {
      name: 'Project Manager',
      email: 'pm@company.com',
      avatar: '📊'
    },
    to: ['me@gmail.com'],
    cc: ['team@company.com'],
    subject: 'Sprint Planning Meeting - Week 46',
    body: `<p>Team,</p>
<p>Sprint planning cho tuần 46 sẽ diễn ra vào <strong>9h sáng thứ 2</strong>.</p>
<p>Mọi người chuẩn bị:</p>
<ul>
<li>Story points cho tasks</li>
<li>Blockers hiện tại</li>
<li>Questions/concerns</li>
</ul>
<p>See you! 👍</p>`,
    snippet: 'Sprint planning cho tuần 46 sẽ diễn ra vào 9h sáng thứ 2...',
    date: new Date('2025-11-08T15:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_work', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '18',
    from: {
      name: 'Grab',
      email: 'noreply@grab.com',
      avatar: '🚗'
    },
    to: ['me@gmail.com'],
    subject: 'Mã giảm giá 30% cho chuyến đi tiếp theo',
    body: `<p>Xin chào!</p>
<p>Bạn có mã giảm giá <strong>30%</strong> cho chuyến đi tiếp theo!</p>
<p><strong>Mã:</strong> GRAB30NOV<br>
<strong>Hạn sử dụng:</strong> 20/11/2025</p>
<p>Đặt xe ngay! 🚗</p>`,
    snippet: 'Bạn có mã giảm giá 30% cho chuyến đi tiếp theo! Mã: GRAB30NOV',
    date: new Date('2025-11-08T08:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '19',
    from: {
      name: 'Em trai',
      email: 'em.yeu@gmail.com',
      avatar: '👦'
    },
    to: ['me@gmail.com'],
    subject: 'Anh cho em mượn tiền',
    body: `<p>Anh ơi,</p>
<p>Em cần mượn anh <strong>2 triệu</strong> để đóng học phí.</p>
<p>Tuần sau em trả anh nhé. Em cảm ơn anh! 🙏</p>`,
    snippet: 'Em cần mượn anh 2 triệu để đóng học phí. Tuần sau em trả nhé...',
    date: new Date('2025-11-07T19:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_family'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '20',
    from: {
      name: 'LinkedIn',
      email: 'jobs@linkedin.com',
      avatar: '💼'
    },
    to: ['me@gmail.com'],
    subject: 'New job opportunities for you',
    body: `<p>Hi,</p>
<p>We found <strong>15 new job opportunities</strong> that match your profile:</p>
<ul>
<li>Senior Software Engineer at TechCorp</li>
<li>Full Stack Developer at StartupXYZ</li>
<li>Tech Lead at BigCompany</li>
</ul>
<p><a href="#">View all opportunities</a></p>`,
    snippet: 'We found 15 new job opportunities that match your profile...',
    date: new Date('2025-11-07T10:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '21',
    from: {
      name: 'Võ Thị F',
      email: 'vothif@university.edu.vn',
      avatar: '🎓'
    },
    to: ['me@gmail.com'],
    subject: 'Lịch bảo vệ đồ án tốt nghiệp',
    body: `<p>Chào bạn,</p>
<p>Lịch bảo vệ đồ án của bạn:</p>
<p><strong>Thời gian:</strong> 14h00, thứ 6 ngày 22/11<br>
<strong>Địa điểm:</strong> Phòng A301<br>
<strong>Hội đồng:</strong> 5 giảng viên</p>
<p>Chuẩn bị kỹ nhé!</p>`,
    snippet: 'Lịch bảo vệ đồ án: 14h00 thứ 6 ngày 22/11 tại phòng A301...',
    date: new Date('2025-11-07T13:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_work', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '22',
    from: {
      name: 'Gymshark',
      email: 'promo@gymshark.com',
      avatar: '🦈'
    },
    to: ['me@gmail.com'],
    subject: 'BLACK FRIDAY SALE - Up to 70% OFF',
    body: `<h2>🖤 BLACK FRIDAY IS HERE</h2>
<p>Save up to <strong>70% OFF</strong> on selected items!</p>
<p>Limited stock. Shop now before it's gone! 🏃‍♂️</p>
<p><a href="#">Shop now</a></p>`,
    snippet: 'BLACK FRIDAY SALE - Save up to 70% OFF on selected items!',
    date: new Date('2025-11-07T06:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '23',
    from: {
      name: 'Đỗ Văn G',
      email: 'dovang@startup.io',
      avatar: '🚀'
    },
    to: ['me@gmail.com'],
    subject: 'Mời tham gia Startup Weekend',
    body: `<p>Hey bro!</p>
<p>Cuối tuần này có sự kiện <strong>Startup Weekend</strong> tại Innovation Hub.</p>
<p>Mình đang tìm co-founder cho ý tưởng AI platform.</p>
<p>Bạn có hứng thú không? Ping mình nhé! 🚀</p>`,
    snippet: 'Cuối tuần này có Startup Weekend tại Innovation Hub. Tìm co-founder cho AI platform...',
    date: new Date('2025-11-06T16:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_friends'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '24',
    from: {
      name: 'FPT Telecom',
      email: 'cskh@fpt.vn',
      avatar: '📡'
    },
    to: ['me@gmail.com'],
    subject: 'Hóa đơn cước Internet tháng 11',
    body: `<p>Kính gửi Quý khách,</p>
<p>Hóa đơn Internet tháng 11/2025:</p>
<p><strong>Gói cước:</strong> Home 150Mbps<br>
<strong>Số tiền:</strong> 165,000 VND<br>
<strong>Hạn thanh toán:</strong> 25/11/2025</p>
<p>Thanh toán qua app MyFPT để được giảm 5%.</p>`,
    snippet: 'Hóa đơn Internet tháng 11: 165,000 VND, hạn thanh toán 25/11',
    date: new Date('2025-11-06T10:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_finance'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '25',
    from: {
      name: 'Security Team',
      email: 'security@company.com',
      avatar: '🔒'
    },
    to: ['all@company.com'],
    subject: 'URGENT: Security Update Required',
    body: `<p>All employees,</p>
<p><strong style="color: red;">URGENT:</strong> Please update your passwords by <strong>end of this week</strong>.</p>
<p>New password requirements:</p>
<ul>
<li>Minimum 12 characters</li>
<li>Mix of letters, numbers, symbols</li>
<li>Different from last 5 passwords</li>
</ul>
<p>Thank you for your cooperation.</p>`,
    snippet: 'URGENT: Please update your passwords by end of this week...',
    date: new Date('2025-11-06T09:00:00'),
    isRead: false,
    isStarred: true,
    labels: ['label_work', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '26',
    from: {
      name: 'Tiki',
      email: 'marketing@tiki.vn',
      avatar: '🎁'
    },
    to: ['me@gmail.com'],
    subject: '🎉 Mã freeship toàn quốc cho bạn',
    body: `<p>Chào bạn!</p>
<p>Tiki tặng bạn <strong>mã freeship toàn quốc</strong>!</p>
<p><strong>Mã:</strong> FREESHIP50K<br>
<strong>Áp dụng:</strong> Đơn từ 100K<br>
<strong>HSD:</strong> 30/11/2025</p>
<p>Mua sắm ngay! 🛒</p>`,
    snippet: 'Tiki tặng mã freeship toàn quốc! Mã: FREESHIP50K, đơn từ 100K',
    date: new Date('2025-11-05T14:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_spam'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '27',
    from: {
      name: 'Cô',
      email: 'co.yeu@gmail.com',
      avatar: '👩‍🏫'
    },
    to: ['me@gmail.com'],
    subject: 'Họp mặt gia đình dịp Tết',
    body: `<p>Cháu yêu,</p>
<p>Năm nay dịp Tết, gia đình tổ chức họp mặt tại nhà cô.</p>
<p>Cháu sắp xếp về sớm nhé, cô nấu nhiều món ngon lắm! 🍲</p>
<p>Thương cháu! ❤️</p>`,
    snippet: 'Năm nay dịp Tết gia đình tổ chức họp mặt tại nhà cô...',
    date: new Date('2025-11-05T11:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_family'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '28',
    from: {
      name: 'GitHub',
      email: 'noreply@github.com',
      avatar: '🐙'
    },
    to: ['me@gmail.com'],
    subject: '[Repository] New PR merged',
    body: `<p>Pull request merged:</p>
<p><strong>Repository:</strong> username/awesome-project<br>
<strong>PR:</strong> #456 - Add new feature XYZ<br>
<strong>Merged by:</strong> reviewer-name</p>
<p><a href="#">View changes</a></p>`,
    snippet: 'Pull request #456 merged: Add new feature XYZ',
    date: new Date('2025-11-05T08:30:00'),
    isRead: true,
    isStarred: false,
    labels: ['label_work'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '29',
    from: {
      name: 'Nguyễn Văn H',
      email: 'nguyenvanh@college.edu',
      avatar: '🎨'
    },
    to: ['me@gmail.com'],
    subject: 'Mượn laptop để thuyết trình',
    body: `<p>Bro,</p>
<p>Thứ 4 tuần này mình có buổi thuyết trình quan trọng.</p>
<p>Laptop mình bị hỏng rồi, cho mình mượn laptop bạn được không?</p>
<p>Mình hứa sẽ cẩn thận! 🙏</p>`,
    snippet: 'Thứ 4 tuần này có thuyết trình, laptop hỏng rồi. Cho mượn được không?',
    date: new Date('2025-11-04T18:00:00'),
    isRead: false,
    isStarred: false,
    labels: ['label_friends', 'label_task'],
    hasAttachments: false,
    folder: 'inbox'
  },
  {
    id: '30',
    from: {
      name: 'Viettel',
      email: 'cskh@viettel.vn',
      avatar: '📱'
    },
    to: ['me@gmail.com'],
    subject: 'Hóa đơn cước điện thoại tháng 11',
    body: `<p>Kính gửi Quý khách,</p>
<p>Hóa đơn cước tháng 11/2025:</p>
<p><strong>Số thuê bao:</strong> 098xxx1234<br>
<strong>Gói cước:</strong> MAX200<br>
<strong>Số tiền:</strong> 200,000 VND<br>
<strong>Hạn thanh toán:</strong> 22/11/2025</p>
<p>Cảm ơn Quý khách!</p>`,
    snippet: 'Hóa đơn cước tháng 11: 200,000 VND, hạn thanh toán 22/11',
    date: new Date('2025-11-04T09:00:00'),
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
