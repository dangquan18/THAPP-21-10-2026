import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SquarePen } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import { formatTime, normalize } from '../utils/format';
import { colors, radius, spacing } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../data/mockData';

const shortName = (name: string) => name.split(' ').pop() ?? name;

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { conversations, users, getUser, openConversationWith } = useApp();
  const [query, setQuery] = useState('');

  const onlineUsers = useMemo(() => users.filter(u => u.online), [users]);

  const items = useMemo(() => {
    const q = normalize(query);
    return conversations
      .map(c => ({
        conversation: c,
        user: getUser(c.userId)!,
        last: c.messages[c.messages.length - 1],
      }))
      .filter(({ user, last }) => {
        if (!q) {
          return true;
        }
        return (
          normalize(user.name).includes(q) ||
          (last ? normalize(last.text).includes(q) : false)
        );
      })
      .sort((a, b) => (b.last?.createdAt ?? 0) - (a.last?.createdAt ?? 0));
  }, [conversations, getUser, query]);

  const openChatWith = (user: User) => {
    const conversationId = openConversationWith(user.id);
    navigation.navigate('Chat', { conversationId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Tin nhắn"
        right={
          <IconButton
            accessibilityLabel="Tin nhắn mới"
            onPress={() => navigation.navigate('Main', { screen: 'Contacts' })}>
            <SquarePen size={18} color={colors.text} />
          </IconButton>
        }
      />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm cuộc trò chuyện..."
      />
      <FlatList
        data={items}
        keyExtractor={item => item.conversation.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          query ? undefined : (
            <FlatList
              horizontal
              data={onlineUsers}
              keyExtractor={u => u.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.story}
                  activeOpacity={0.7}
                  onPress={() => openChatWith(item)}>
                  <View style={styles.storyRing}>
                    <Avatar uri={item.avatar} size={52} online />
                  </View>
                  <Text style={styles.storyName} numberOfLines={1}>
                    {shortName(item.name)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )
        }
        ListEmptyComponent={
          <EmptyState text="Không tìm thấy cuộc trò chuyện nào" />
        }
        renderItem={({ item: { conversation, user, last } }) => {
          const unread = conversation.unreadCount > 0;
          const preview = last
            ? `${last.senderId === 'me' ? 'Bạn: ' : ''}${last.text}`
            : 'Bắt đầu cuộc trò chuyện';
          return (
            <TouchableOpacity
              style={[styles.row, unread && styles.rowUnread]}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Chat', { conversationId: conversation.id })
              }>
              <Avatar
                uri={user.avatar}
                online={user.online}
                ringColor={unread ? colors.surface : colors.background}
              />
              <View style={styles.content}>
                <View style={styles.line}>
                  <Text
                    style={[styles.name, unread && styles.nameUnread]}
                    numberOfLines={1}>
                    {user.name}
                  </Text>
                  {last && (
                    <Text style={[styles.time, unread && styles.timeUnread]}>
                      {formatTime(last.createdAt)}
                    </Text>
                  )}
                </View>
                <View style={[styles.line, styles.lineBottom]}>
                  <Text
                    style={[styles.preview, unread && styles.previewUnread]}
                    numberOfLines={1}>
                    {preview}
                  </Text>
                  {unread && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {conversation.unreadCount > 99
                          ? '99+'
                          : conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
  listContent: {
    paddingBottom: spacing.lg,
  },
  stories: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  story: {
    alignItems: 'center',
    width: 60,
  },
  storyRing: {
    padding: 2,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  rowUnread: {
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineBottom: {
    marginTop: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  nameUnread: {
    fontWeight: '800',
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '700',
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '700',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
});
