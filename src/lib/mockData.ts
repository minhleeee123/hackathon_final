export type EmailStatus = 'unprocessed' | 'processing' | 'processed';
export type EmailTag = 'Công việc' | 'Gia đình' | 'Bạn bè' | 'Spam' | 'Quảng cáo' | 'Không xác định';
export type TaskStatus = 'to-do' | 'in-process' | 'completed';
export type TaskSource = 'ai' | 'user';

export interface AgentResponse {
  agent: 'Agent 1' | 'Agent 2' | 'Agent 3';
  timestamp: string;
  output: any;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  date: string;
  status: EmailStatus;
  tag?: EmailTag;
  hasTask?: boolean;
  agentResponses?: AgentResponse[];
  suggestedReply?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  location?: string;
  relatedPeople?: string[];
  status: TaskStatus;
  source: TaskSource;
  emailId?: string;
  createdAt: string;
}

export interface UserSettings {
  name: string;
  role: string;
  personalStyle: string;
  workContext: string;
  familyContext: string;
}

export const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'Nguyễn Văn A',
    senderEmail: 'nguyenvana@company.com',
    subject: 'Họp team sáng mai',
    body: 'Chào bạn,\n\nNhờ bạn chuẩn bị báo cáo dự án cho buổi họp vào 9h sáng mai tại phòng họp tầng 3. Gửi giúp mình file báo cáo trước 8h nhé.\n\nCảm ơn!',
    date: '2025-11-11T14:30:00',
    status: 'unprocessed'
  },
  {
    id: '2',
    sender: 'Mẹ',
    senderEmail: 'me.yeu@gmail.com',
    subject: 'Nhớ mua rau về',
    body: 'Con ơi,\n\nChiều nay về nhớ mua giúp mẹ 1kg rau cải và 500g thịt ba chỉ nhé. Tối nay mẹ nấu canh rau.\n\nThương con!',
    date: '2025-11-11T10:15:00',
    status: 'processed',
    tag: 'Gia đình',
    hasTask: true,
    agentResponses: [
      {
        agent: 'Agent 1',
        timestamp: '2025-11-11T10:16:00',
        output: {
          tag: '[Gia đình]',
          has_task: true,
          next_step: 'extract_and_reply',
          reasoning: 'Email từ người thân, có yêu cầu cụ thể: mua rau cải và thịt'
        }
      },
      {
        agent: 'Agent 2',
        timestamp: '2025-11-11T10:16:05',
        output: {
          tasks: [
            {
              name: 'Mua rau cải và thịt',
              deadline: '2025-11-11T18:00:00',
              location: 'Chợ/Siêu thị',
              items: ['1kg rau cải', '500g thịt ba chỉ'],
              related_people: ['Mẹ']
            }
          ]
        }
      },
      {
        agent: 'Agent 3',
        timestamp: '2025-11-11T10:16:10',
        output: {
          reply: 'Mẹ ơi,\n\nCon đã note lại rồi nhé! Chiều nay con sẽ mua 1kg rau cải và 500g thịt ba chỉ về cho mẹ.\n\nCon yêu mẹ! 💕'
        }
      }
    ],
    suggestedReply: 'Mẹ ơi,\n\nCon đã note lại rồi nhé! Chiều nay con sẽ mua 1kg rau cải và 500g thịt ba chỉ về cho mẹ.\n\nCon yêu mẹ! 💕'
  },
  {
    id: '3',
    sender: 'Trần Thị B',
    senderEmail: 'tranthib@partner.vn',
    subject: 'Re: Hợp đồng hợp tác Q4',
    body: 'Chào anh/chị,\n\nEm đã xem qua hợp đồng. Có một số điểm cần trao đổi thêm về điều khoản thanh toán và thời gian bàn giao. Anh chị có thể sắp xếp cuộc họp vào thứ 4 tuần sau được không ạ?\n\nTrân trọng!',
    date: '2025-11-11T09:00:00',
    status: 'processed',
    tag: 'Công việc',
    hasTask: true,
    agentResponses: [
      {
        agent: 'Agent 1',
        timestamp: '2025-11-11T09:01:00',
        output: {
          tag: '[Công việc]',
          has_task: true,
          next_step: 'extract_and_reply',
          reasoning: 'Email công việc từ đối tác, có đề xuất lịch họp cụ thể'
        }
      },
      {
        agent: 'Agent 2',
        timestamp: '2025-11-11T09:01:05',
        output: {
          tasks: [
            {
              name: 'Họp trao đổi hợp đồng với Trần Thị B',
              deadline: '2025-11-13',
              location: 'Chưa xác định',
              related_people: ['Trần Thị B'],
              notes: 'Trao đổi về điều khoản thanh toán và thời gian bàn giao'
            }
          ]
        }
      },
      {
        agent: 'Agent 3',
        timestamp: '2025-11-11T09:01:10',
        output: {
          reply: 'Chào chị B,\n\nEm đã nhận được email và note lại lịch họp vào thứ 4 tuần sau rồi ạ. Em sẽ kiểm tra lịch và xác nhận lại với chị trong hôm nay về thời gian cụ thể.\n\nCảm ơn chị đã phản hồi!\nTrân trọng.'
        }
      }
    ],
    suggestedReply: 'Chào chị B,\n\nEm đã nhận được email và note lại lịch họp vào thứ 4 tuần sau rồi ạ. Em sẽ kiểm tra lịch và xác nhận lại với chị trong hôm nay về thời gian cụ thể.\n\nCảm ơn chị đã phản hồi!\nTrân trọng.'
  },
  {
    id: '4',
    sender: 'Marketing Team',
    senderEmail: 'promo@shopping.vn',
    subject: '🎉 SALE 50% - Khuyến mãi khủng cuối tuần',
    body: 'Chào quý khách,\n\nĐừng bỏ lỡ chương trình SALE khủng cuối tuần với hàng nghìn sản phẩm giảm giá lên đến 50%! Click ngay để mua sắm.\n\n[Link quảng cáo]',
    date: '2025-11-10T20:00:00',
    status: 'processed',
    tag: 'Quảng cáo',
    hasTask: false,
    agentResponses: [
      {
        agent: 'Agent 1',
        timestamp: '2025-11-10T20:01:00',
        output: {
          tag: '[Quảng cáo]',
          has_task: false,
          next_step: 'stop',
          reasoning: 'Email quảng cáo thương mại, không cần trả lời'
        }
      }
    ]
  },
  {
    id: '5',
    sender: 'Lê Văn C',
    senderEmail: 'levanc@friend.com',
    subject: 'Cuối tuần đi cà phê không?',
    body: 'Ê bro,\n\nLâu rồi không gặp! Cuối tuần này mình rủ mấy đứa đi cà phê The Coffee House gần trường cũ. Mày có rảnh không?\n\nPing mình nhé!',
    date: '2025-11-10T18:30:00',
    status: 'unprocessed'
  },
  {
    id: '6',
    sender: 'HR Department',
    senderEmail: 'hr@company.com',
    subject: 'Thông báo: Đăng ký khám sức khỏe định kỳ',
    body: 'Kính gửi anh/chị,\n\nCông ty thông báo lịch khám sức khỏe định kỳ cho nhân viên. Anh chị vui lòng đăng ký trước ngày 15/11 qua link bên dưới.\n\nThân mến.',
    date: '2025-11-10T15:00:00',
    status: 'unprocessed'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Mua rau cải và thịt cho mẹ',
    description: '1kg rau cải và 500g thịt ba chỉ',
    deadline: '2025-11-11T18:00:00',
    location: 'Chợ/Siêu thị',
    relatedPeople: ['Mẹ'],
    status: 'to-do',
    source: 'ai',
    emailId: '2',
    createdAt: '2025-11-11T10:16:05'
  },
  {
    id: 't2',
    title: 'Họp trao đổi hợp đồng với Trần Thị B',
    description: 'Trao đổi về điều khoản thanh toán và thời gian bàn giao',
    deadline: '2025-11-13',
    location: 'Chưa xác định',
    relatedPeople: ['Trần Thị B'],
    status: 'to-do',
    source: 'ai',
    emailId: '3',
    createdAt: '2025-11-11T09:01:05'
  },
  {
    id: 't3',
    title: 'Hoàn thành báo cáo tháng 10',
    description: 'Tổng hợp số liệu và viết báo cáo',
    deadline: '2025-11-12T17:00:00',
    status: 'in-process',
    source: 'user',
    createdAt: '2025-11-09T14:00:00'
  },
  {
    id: 't4',
    title: 'Đánh giá hiệu suất nhân viên',
    description: 'Review performance Q3 cho team',
    deadline: '2025-11-15',
    status: 'to-do',
    source: 'user',
    createdAt: '2025-11-08T10:00:00'
  }
];

export const defaultUserSettings: UserSettings = {
  name: '',
  role: '',
  personalStyle: '',
  workContext: '',
  familyContext: ''
};
