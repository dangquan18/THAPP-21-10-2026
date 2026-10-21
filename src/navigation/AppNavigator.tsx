import React from 'react';
import { StyleSheet } from 'react-native';
import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Bell,
  LucideIcon,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import type { MainTabParamList, RootStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, LucideIcon> = {
  Home: MessageSquare,
  Contacts: Users,
  Notifications: Bell,
  Settings: Settings,
};

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.badge,
  },
};

function MainTabs() {
  const { conversations, notifications } = useApp();
  const unreadMessages = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBadgeStyle: styles.badge,
        tabBarIcon: ({ color, focused }) => {
          const Icon = TAB_ICONS[route.name];
          return (
            <Icon
              size={22}
              color={color}
              fill={focused ? color : 'transparent'}
              fillOpacity={0.15}
            />
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tin nhắn',
          tabBarBadge: unreadMessages > 0 ? unreadMessages : undefined,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: 'Danh bạ' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarBadge:
            unreadNotifications > 0 ? unreadNotifications : undefined,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { currentUser } = useApp();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {currentUser ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.badge,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
