import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageSquare, UserPlus } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import IconButton from '../components/IconButton';
import { normalize } from '../utils/format';
import { colors, radius, spacing, typography } from '../theme';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../data/mockData';

type Filter = 'all' | 'online';
type Row =
  | { kind: 'header'; key: string; title: string }
  | { kind: 'user'; key: string; user: User };

export default function ContactsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { users, openConversationWith } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const onlineCount = users.filter(u => u.online).length;

  // Gộp thành một danh sách phẳng có tiêu đề nhóm để hiển thị bằng FlatList
  const rows = useMemo<Row[]>(() => {
    const q = normalize(query);
    const matched = users.filter(u => normalize(u.name).includes(q));
    const online = matched.filter(u => u.online);
    const offline = filter === 'all' ? matched.filter(u => !u.online) : [];
    const result: Row[] = [];
    if (online.length) {
      result.push({ kind: 'header', key: 'h-on', title: 'Đang hoạt động' });
      online.forEach(u => result.push({ kind: 'user', key: u.id, user: u }));
    }
    if (offline.length) {
      result.push({ kind: 'header', key: 'h-off', title: 'Ngoại tuyến' });
      offline.forEach(u => result.push({ kind: 'user', key: u.id, user: u }));
    }
    return result;
  }, [users, query, filter]);

  const openChat = (user: User) => {
    const conversationId = openConversationWith(user.id);
    navigation.navigate('Chat', { conversationId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Danh bạ"
        right={
          <IconButton
            accessibilityLabel="Thêm bạn"
            onPress={() =>
              Alert.alert(
                'Thêm bạn',
                'Tính năng tìm và kết bạn mới sẽ có trong phiên bản sau.',
              )
            }>
            <UserPlus size={18} color={colors.text} />
          </IconButton>
        }
      />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm trong danh bạ..."
      />

      <View style={styles.segment}>
        <SegmentButton
          active={filter === 'all'}
          onPress={() => setFilter('all')}
          label={`Tất cả · ${users.length}`}
        />
        <SegmentButton
          active={filter === 'online'}
          onPress={() => setFilter('online')}
          label={`Đang online · ${onlineCount}`}
          dot
        />
      </View>

      <FlatList
        data={rows}
        keyExtractor={item => item.key}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState text="Không tìm thấy người dùng" />}
        renderItem={({ item }) =>
          item.kind === 'header' ? (
            <Text style={styles.sectionTitle}>{item.title}</Text>
          ) : (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => openChat(item.user)}>
              <Avatar
                uri={item.user.avatar}
                size={44}
                online={item.user.online}
              />
              <View style={styles.content}>
                <Text style={styles.name}>{item.user.name}</Text>
                <Text
                  style={[
                    styles.status,
                    item.user.online && styles.statusOnline,
                  ]}>
                  {item.user.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </Text>
              </View>
              <IconButton
                size={36}
                accessibilityLabel={`Nhắn tin cho ${item.user.name}`}
                onPress={() => openChat(item.user)}>
                <MessageSquare size={16} color={colors.primary} />
              </IconButton>
            </TouchableOpacity>
          )
        }
      />
    </SafeAreaView>
  );
}

function SegmentButton({
  active,
  label,
  dot,
  onPress,
}: {
  active: boolean;
  label: string;
  dot?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segmentButton, active && styles.segmentActive]}
      onPress={onPress}
      activeOpacity={0.8}>
      {dot && <View style={styles.segmentDot} />}
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  segment: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.surfaceAlt,
  },
  segmentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.online,
    marginRight: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.text,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.sectionLabel,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  status: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  statusOnline: {
    color: colors.online,
  },
});
