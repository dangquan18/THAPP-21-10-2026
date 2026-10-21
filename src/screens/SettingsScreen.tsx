import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, LogOut, Radio } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import ScreenHeader from '../components/ScreenHeader';
import ConfirmSheet from '../components/ConfirmSheet';
import { colors, radius, spacing, typography } from '../theme';

export default function SettingsScreen() {
  const {
    currentUser,
    logout,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useApp();
  const [showOnline, setShowOnline] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Cài đặt" />

        <View style={styles.body}>
          <TouchableOpacity
            style={styles.profile}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                currentUser.name,
                `@${currentUser.username}\n${currentUser.email ?? ''}`,
              )
            }>
            <Avatar
              uri={currentUser.avatar}
              size={56}
              online={showOnline}
              ringColor={colors.surface}
            />
            <View style={styles.profileText}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.username}>@{currentUser.username}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
          <View style={styles.card}>
            <InfoRow label="Tên đăng nhập" value={currentUser.username} highlight />
            <InfoRow label="Họ và tên" value={currentUser.name} />
            <InfoRow label="Số điện thoại" value={currentUser.phone ?? '—'} />
            <InfoRow label="Email" value={currentUser.email ?? '—'} last />
          </View>

          <Text style={styles.sectionTitle}>Tuỳ chọn</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Bell size={18} color={colors.primary} />
                <Text style={styles.rowLabel}>Nhận thông báo</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
                thumbColor={colors.white}
              />
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <View style={styles.rowLeft}>
                <Radio size={18} color={colors.primary} />
                <Text style={styles.rowLabel}>Hiển thị trạng thái trực tuyến</Text>
              </View>
              <Switch
                value={showOnline}
                onValueChange={setShowOnline}
                trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setConfirmVisible(true)}
            activeOpacity={0.8}>
            <LogOut size={18} color={colors.danger} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
          <Text style={styles.version}>ChatApp phiên bản 1.0.0</Text>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={confirmVisible}
        icon={<LogOut size={24} color={colors.danger} />}
        title="Đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        confirmLabel="Đăng xuất"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          // Xoá currentUser -> AppNavigator tự quay về màn hình Đăng nhập
          logout();
        }}
      />
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  last,
  highlight,
}: {
  label: string;
  value: string;
  last?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[styles.rowValue, highlight && styles.rowValueHighlight]}
        numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  username: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.sectionLabel,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  rowValue: {
    flexShrink: 1,
    marginLeft: spacing.lg,
    fontSize: 15,
    color: colors.textSecondary,
  },
  rowValueHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
  },
});
