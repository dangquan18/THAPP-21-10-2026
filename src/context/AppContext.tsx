import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  ACCOUNTS,
  Account,
  AppNotification,
  CONVERSATIONS,
  Conversation,
  NOTIFICATIONS,
  USERS,
  User,
} from '../data/mockData';

type LoginResult = { ok: true } | { ok: false; error: string };

type AppContextValue = {
  currentUser: Account | null;
  users: User[];
  conversations: Conversation[];
  notifications: AppNotification[];
  notificationsEnabled: boolean;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
  getUser: (id: string) => User | undefined;
  /** Trả về id cuộc trò chuyện với userId, tạo mới nếu chưa có */
  openConversationWith: (userId: string) => string;
  markConversationRead: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setNotificationsEnabled: (value: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(NOTIFICATIONS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const value = useMemo<AppContextValue>(() => {
    const login = (username: string, password: string): LoginResult => {
      const account = ACCOUNTS.find(
        a => a.username === username.trim() && a.password === password,
      );
      if (!account) {
        return { ok: false, error: 'Tài khoản hoặc mật khẩu không đúng.' };
      }
      setCurrentUser(account);
      return { ok: true };
    };

    const logout = () => setCurrentUser(null);

    const getUser = (id: string) => USERS.find(u => u.id === id);

    const openConversationWith = (userId: string) => {
      const existing = conversations.find(c => c.userId === userId);
      if (existing) {
        return existing.id;
      }
      const id = `c_${userId}_${Date.now()}`;
      setConversations(prev => [
        { id, userId, messages: [], unreadCount: 0 },
        ...prev,
      ]);
      return id;
    };

    const markConversationRead = (conversationId: string) =>
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId && c.unreadCount > 0
            ? { ...c, unreadCount: 0 }
            : c,
        ),
      );

    const sendMessage = (conversationId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUser) {
        return;
      }
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: `m_${Date.now()}`,
                    senderId: 'me',
                    text: trimmed,
                    createdAt: Date.now(),
                  },
                ],
              }
            : c,
        ),
      );
    };

    const markNotificationRead = (id: string) =>
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n)),
      );

    const markAllNotificationsRead = () =>
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    return {
      currentUser,
      users: USERS,
      conversations,
      notifications,
      notificationsEnabled,
      login,
      logout,
      getUser,
      openConversationWith,
      markConversationRead,
      sendMessage,
      markNotificationRead,
      markAllNotificationsRead,
      setNotificationsEnabled,
    };
  }, [currentUser, conversations, notifications, notificationsEnabled]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp phải được dùng bên trong AppProvider');
  }
  return ctx;
}
