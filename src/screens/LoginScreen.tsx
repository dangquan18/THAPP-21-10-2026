import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CircleAlert,
  Eye,
  EyeOff,
  Lock,
  MessageSquare,
  User,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme';

type Errors = { username?: string; password?: string; form?: string };

export default function LoginScreen() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'username' | 'password' | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const handleLogin = () => {
    const next: Errors = {};
    if (!username.trim()) {
      next.username = 'Vui lòng nhập tài khoản';
    }
    if (!password) {
      next.password = 'Vui lòng nhập mật khẩu';
    }
    if (next.username || next.password) {
      setErrors(next);
      return;
    }
    const result = login(username, password);
    // Đăng nhập thành công: AppNavigator tự chuyển sang màn hình Home
    setErrors(result.ok ? {} : { form: result.error });
  };

  const fieldColor = (field: 'username' | 'password') => {
    if (errors[field]) {
      return colors.error;
    }
    return focused === field ? colors.primary : colors.textSecondary;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}>
              <MessageSquare
                size={30}
                color={colors.onPrimary}
                fill={colors.onPrimary}
              />
            </View>
            <Text style={styles.appName}>ChatApp</Text>
          </View>
          <Text style={styles.title}>Chào mừng{'\n'}trở lại</Text>
          <Text style={styles.subtitle}>Kết nối mọi lúc, mọi nơi</Text>

          <Text style={styles.label}>Tài khoản</Text>
          <View
            style={[
              styles.inputBox,
              focused === 'username' && styles.inputFocused,
              errors.username && styles.inputError,
            ]}>
            <User size={18} color={fieldColor('username')} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={t => {
                setUsername(t);
                setErrors(e => ({ ...e, username: undefined, form: undefined }));
              }}
              onFocus={() => setFocused('username')}
              onBlur={() => setFocused(null)}
              placeholder="Nhập tài khoản"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>
          {errors.username && <ErrorText text={errors.username} />}

          <Text style={[styles.label, styles.labelSpacing]}>Mật khẩu</Text>
          <View
            style={[
              styles.inputBox,
              focused === 'password' && styles.inputFocused,
              errors.password && styles.inputError,
            ]}>
            <Lock size={18} color={fieldColor('password')} />
            <TextInput
              ref={passwordRef}
              style={styles.input}
              value={password}
              onChangeText={t => {
                setPassword(t);
                setErrors(e => ({ ...e, password: undefined, form: undefined }));
              }}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              {showPassword ? (
                <EyeOff size={18} color={colors.textSecondary} />
              ) : (
                <Eye size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && <ErrorText text={errors.password} />}

          {errors.form && <ErrorText text={errors.form} />}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.hint}>
          Tài khoản mẫu: <Text style={styles.hintStrong}>admin / 123456</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <View style={styles.errorRow}>
      <CircleAlert size={14} color={colors.error} />
      <Text style={styles.errorText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl * 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  labelSpacing: {
    marginTop: spacing.lg,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    marginHorizontal: spacing.md,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
  },
  button: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl * 1.5,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  hint: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    paddingVertical: spacing.lg,
  },
  hintStrong: {
    color: colors.text,
    fontWeight: '700',
  },
});
