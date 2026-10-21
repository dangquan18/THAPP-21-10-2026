import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

/** Tiêu đề lớn ở đầu mỗi màn hình tab */
export default function ScreenHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={typography.screenTitle}>{title}</Text>
        {right}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
