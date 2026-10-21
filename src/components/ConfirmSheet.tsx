import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';

type Props = {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Hộp xác nhận dạng bottom sheet */
export default function ConfirmSheet({
  visible,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Huỷ',
  onConfirm,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onCancel} />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm },
          ]}>
          <View style={styles.handle} />
          <View style={styles.iconCircle}>{icon}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onCancel}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirm]}
              onPress={onConfirm}
              activeOpacity={0.8}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  message: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: colors.surfaceAlt,
  },
  cancelText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  confirm: {
    backgroundColor: colors.danger,
  },
  confirmText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
