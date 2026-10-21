export type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  phone?: string;
  email?: string;
};

export type Account = User & {
  username: string;
  password: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  userId: string;
  messages: Message[];
  unreadCount: number;
};

export type NotificationType =
  | 'message'
  | 'group'
  | 'friend'
  | 'security'
  | 'mention'
  | 'system';

export type AppNotification = {
  id: string;
  type: NotificationType;
  content: string;
  createdAt: number;
  read: boolean;
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const now = Date.now();

const avatar = (n: number) => `https://i.pravatar.cc/150?img=${n}`;

// Tài khoản mẫu dùng để đăng nhập
export const ACCOUNTS: Account[] = [
  {
    id: 'me',
    username: 'admin',
    password: '123456',
    name: 'Trần Đức Quân',
    avatar: avatar(12),
    online: true,
    phone: '0901 234 567',
    email: 'admin@chatapp.vn',
  },
  {
    id: 'me2',
    username: 'user',
    password: '123456',
    name: 'Người dùng thử',
    avatar: avatar(15),
    online: true,
    phone: '0912 345 678',
    email: 'user@chatapp.vn',
  },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn An', avatar: avatar(3), online: true },
  { id: 'u2', name: 'Trần Thị Bình', avatar: avatar(5), online: false },
  { id: 'u3', name: 'Lê Hoàng Cường', avatar: avatar(8), online: true },
  { id: 'u4', name: 'Phạm Thu Dung', avatar: avatar(9), online: false },
  { id: 'u5', name: 'Hoàng Minh Đức', avatar: avatar(11), online: true },
  { id: 'u6', name: 'Vũ Thị Hà', avatar: avatar(16), online: false },
  { id: 'u7', name: 'Đặng Quốc Huy', avatar: avatar(13), online: true },
  { id: 'u8', name: 'Bùi Ngọc Lan', avatar: avatar(20), online: true },
  { id: 'u9', name: 'Đỗ Thành Long', avatar: avatar(52), online: false },
  { id: 'u10', name: 'Ngô Mai Phương', avatar: avatar(23), online: false },
];

const msg = (
  id: string,
  senderId: string,
  text: string,
  ago: number,
): Message => ({ id, senderId, text, createdAt: now - ago });

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userId: 'u1',
    unreadCount: 2,
    messages: [
      msg('m1', 'me', 'Chào An, chiều nay họp nhóm không?', 40 * MINUTE),
      msg('m2', 'u1', 'Có nhé, 3h ở phòng B2', 30 * MINUTE),
      msg('m3', 'u1', 'Nhớ mang laptop theo nha', 5 * MINUTE),
    ],
  },
  {
    id: 'c2',
    userId: 'u2',
    unreadCount: 0,
    messages: [
      msg('m1', 'u2', 'Bài tập React Native làm xong chưa?', 3 * HOUR),
      msg('m2', 'me', 'Xong rồi, mình gửi file cho bạn nhé', 2 * HOUR),
    ],
  },
  {
    id: 'c3',
    userId: 'u3',
    unreadCount: 5,
    messages: [
      msg('m1', 'u3', 'Tối nay đá bóng không?', 5 * HOUR),
      msg('m2', 'u3', 'Sân cũ nhé', 5 * HOUR - 2 * MINUTE),
      msg('m3', 'u3', '7h tối', 5 * HOUR - 3 * MINUTE),
      msg('m4', 'u3', 'Rủ thêm mấy đứa nữa', 4 * HOUR),
      msg('m5', 'u3', 'Trả lời đi bạn ơi 😅', 4 * HOUR - MINUTE),
    ],
  },
  {
    id: 'c4',
    userId: 'u4',
    unreadCount: 0,
    messages: [
      msg('m1', 'me', 'Cảm ơn Dung nhiều nha!', DAY + HOUR),
      msg('m2', 'u4', 'Không có gì đâu 😊', DAY),
    ],
  },
  {
    id: 'c5',
    userId: 'u5',
    unreadCount: 1,
    messages: [
      msg('m1', 'u5', 'Gửi mình slide thuyết trình với', 2 * DAY),
    ],
  },
  {
    id: 'c6',
    userId: 'u8',
    unreadCount: 0,
    messages: [
      msg('m1', 'u8', 'Hẹn gặp lại cuối tuần nhé!', 4 * DAY),
      msg('m2', 'me', 'Ok bạn 👍', 4 * DAY - HOUR),
    ],
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'message',
    content: 'Nguyễn Văn An đã gửi cho bạn 2 tin nhắn mới.',
    createdAt: now - 5 * MINUTE,
    read: false,
  },
  {
    id: 'n2',
    type: 'group',
    content: 'Lê Hoàng Cường đã thêm bạn vào nhóm "Đá bóng thứ 7".',
    createdAt: now - 4 * HOUR,
    read: false,
  },
  {
    id: 'n3',
    type: 'friend',
    content: 'Bùi Ngọc Lan đã chấp nhận lời mời kết bạn của bạn.',
    createdAt: now - DAY,
    read: true,
  },
  {
    id: 'n4',
    type: 'security',
    content: 'Tài khoản của bạn vừa đăng nhập trên thiết bị mới.',
    createdAt: now - 2 * DAY,
    read: false,
  },
  {
    id: 'n5',
    type: 'mention',
    content: 'Hoàng Minh Đức đã nhắc đến bạn trong một bình luận.',
    createdAt: now - 3 * DAY,
    read: true,
  },
  {
    id: 'n6',
    type: 'system',
    content: 'Chào mừng bạn đến với ChatApp! 🎉',
    createdAt: now - 7 * DAY,
    read: true,
  },
];
