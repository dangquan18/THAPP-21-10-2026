import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  CheckCheck,
  ChevronLeft,
  EllipsisVertical,
  Phone,
  Plus,
  SendHorizontal,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import { formatClock, formatRelative } from '../utils/format';
import { colors, radius, spacing } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { Message } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

// Hiện dải thời gian khi hai tin nhắn liên tiếp cách nhau hơn 30 phút
const SEPARATOR_GAP = 30 * 60 * 1000;
const QUICK_REACTIONS = ['👍', '😊', '❤️'];

export default function ChatScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { conversations, getUser, sendMessage, markConversationRead } =
    useApp();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();

  const conversation = conversations.find(c => c.id === conversationId);
  const user = conversation ? getUser(conversation.userId) : undefined;
  const hasUnread = (conversation?.unreadCount ?? 0) > 0;

  // Mở cuộc trò chuyện => đánh dấu đã đọc
  useEffect(() => {
    if (hasUnread) {
      markConversationRead(conversationId);
    }
  }, [hasUnread, conversationId, markConversationRead]);

  if (!conversation || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState text="Không tìm thấy cuộc trò chuyện" />
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }
    sendMessage(conversationId, text);
    setText('');
  };

  const showAttachMenu = () =>
    Alert.alert('Gửi nhanh', 'Chọn biểu tượng cảm xúc để gửi', [
      ...QUICK_REACTIONS.map(emoji => ({
        text: emoji,
        onPress: () => sendMessage(conversationId, emoji),
      })),
      { text: 'Huỷ', style: 'cancel' as const },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          variant="ghost"
          size={36}
          accessibilityLabel="Quay lại"
          onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.text} />
        </IconButton>
        <Avatar
          uri={user.avatar}
          size={40}
          online={user.online}
          ringColor={colors.background}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerName} numberOfLines={1}>
            {user.name}
          </Text>
          <Text
            style={[styles.headerStatus, user.online && styles.statusOnline]}>
            {user.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
          </Text>
        </View>
        <IconButton
          variant="ghost"
          size={36}
          accessibilityLabel="Gọi thoại"
          onPress={() =>
            Alert.alert('Gọi thoại', `Đang gọi ${user.name}...`, [
              { text: 'Kết thúc', style: 'destructive' },
            ])
          }>
          <Phone size={20} color={colors.text} />
        </IconButton>
        <IconButton
          variant="ghost"
          size={36}
          accessibilityLabel="Tuỳ chọn"
          onPress={() =>
            Alert.alert(user.name, 'Tuỳ chọn cuộc trò chuyện', [
              {
                text: 'Đánh dấu đã đọc',
                onPress: () => markConversationRead(conversationId),
              },
              { text: 'Đóng', style: 'cancel' },
            ])
          }>
          <EllipsisVertical size={20} color={colors.text} />
        </IconButton>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <EmptyState text={`Hãy gửi lời chào đến ${user.name} 👋`} />
          }
          renderItem={({ item, index }) => {
            const mine = item.senderId === 'me';
            const prev = conversation.messages[index - 1];
            const showSeparator =
              !prev || item.createdAt - prev.createdAt > SEPARATOR_GAP;
            return (
              <>
                {showSeparator && (
                  <Text style={styles.separator}>
                    {formatRelative(item.createdAt)}
                  </Text>
                )}
                <View style={[styles.msgRow, mine && styles.msgRowMine]}>
                  {!mine && <Avatar uri={user.avatar} size={28} />}
                  <View
                    style={[
                      styles.bubble,
                      mine ? styles.bubbleMine : styles.bubbleOther,
                    ]}>
                    <Text style={[styles.msgText, mine && styles.msgTextMine]}>
                      {item.text}
                    </Text>
                    <View style={styles.meta}>
                      <Text
                        style={[styles.msgTime, mine && styles.msgTimeMine]}>
                        {formatClock(item.createdAt)}
                      </Text>
                      {mine && <CheckCheck size={14} color={colors.onPrimary} />}
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />

        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom, spacing.sm) + spacing.xs },
          ]}>
          <IconButton
            variant="ghost"
            size={40}
            accessibilityLabel="Gửi nhanh"
            onPress={showAttachMenu}>
            <Plus size={22} color={colors.textSecondary} />
          </IconButton>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !text.trim() && styles.sendDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
            accessibilityLabel="Gửi"
            activeOpacity={0.8}>
            <SendHorizontal size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  headerStatus: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  statusOnline: {
    color: colors.online,
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  separator: {
    alignSelf: 'center',
    marginVertical: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  msgRowMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    marginLeft: spacing.sm,
    borderBottomLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  msgTextMine: {
    color: colors.onPrimary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  msgTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  msgTimeMine: {
    color: 'rgba(11, 16, 32, 0.6)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    marginLeft: spacing.xs,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
