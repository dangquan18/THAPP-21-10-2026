import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AtSign,
  CheckCheck,
  LucideIcon,
  MessageSquare,
  PartyPopper,
  Smartphone,
  UserCheck,
  UserPlus,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import { formatTime } from '../utils/format';
import { colors, radius, spacing } from '../theme';
import type { NotificationType } from '../data/mockData';

const ICONS: Record<NotificationType, LucideIcon> = {
  message: MessageSquare,
  group: UserPlus,
  friend: UserCheck,
  security: Smartphone,
  mention: AtSign,
  system: PartyPopper,
};

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Thông báo"
        subtitle={
          unreadCount > 0
            ? `Bạn có ${unreadCount} thông báo chưa đọc · nhấn để đánh dấu đã đọc`
            : 'Bạn đã đọc tất cả thông báo'
        }
        right={
          unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.readAll}
              onPress={markAllNotificationsRead}
              activeOpacity={0.7}>
              <CheckCheck size={16} color={colors.primary} />
              <Text style={styles.readAllText}>Đọc tất cả</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState text="Chưa có thông báo nào" />}
        renderItem={({ item }) => {
          const Icon = ICONS[item.type];
          const unread = !item.read;
          return (
            <TouchableOpacity
              style={[styles.card, unread && styles.cardUnread]}
              activeOpacity={0.7}
              disabled={!unread}
              accessibilityHint={unread ? 'Đánh dấu đã đọc' : undefined}
              onPress={() => markNotificationRead(item.id)}>
              <View style={[styles.iconBox, unread && styles.iconBoxUnread]}>
                <Icon
                  size={18}
                  color={unread ? colors.onPrimary : colors.textSecondary}
                />
              </View>
              <View style={styles.content}>
                <Text style={[styles.text, unread && styles.textUnread]}>
                  {item.content}
                </Text>
                <Text style={styles.time}>
                  {formatTime(item.createdAt)}
                  {unread ? '' : ' · Đã đọc'}
                </Text>
              </View>
              {unread && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  readAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  readAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  cardUnread: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  iconBoxUnread: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  textUnread: {
    color: colors.text,
    fontWeight: '700',
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
  },
});
