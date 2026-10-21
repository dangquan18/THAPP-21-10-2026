import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  uri: string;
  size?: number;
  online?: boolean;
  /** Màu viền chấm trạng thái, trùng với nền phía sau avatar */
  ringColor?: string;
};

export default function Avatar({
  uri,
  size = 52,
  online,
  ringColor = colors.background,
}: Props) {
  const dot = Math.max(10, size * 0.27);
  return (
    <View style={{ width: size, height: size }}>
      <Image
        source={{ uri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      {online && (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              borderColor: ringColor,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceAlt,
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    backgroundColor: colors.online,
  },
});
