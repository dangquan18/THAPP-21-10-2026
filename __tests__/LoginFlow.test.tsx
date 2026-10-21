/**
 * @format
 */

import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
jest.useFakeTimers();

const texts = (root: ReactTestRenderer.ReactTestInstance) =>
  root.findAllByType(Text).map(t => [t.props.children].flat().join(''));

const pressButton = async (
  root: ReactTestRenderer.ReactTestInstance,
  label: string,
) => {
  const button = root
    .findAllByType(TouchableOpacity)
    .find(b => b.findAllByType(Text).some(t => t.props.children === label));
  if (!button) {
    throw new Error(`Không tìm thấy nút "${label}"`);
  }
  await ReactTestRenderer.act(async () => {
    button.props.onPress();
  });
};

test('đăng nhập: kiểm tra rỗng, sai mật khẩu, thành công vào Home', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const root = renderer.root;

  expect(texts(root)).toContain('ChatApp');

  // Bỏ trống -> báo lỗi
  await pressButton(root, 'Đăng nhập');
  expect(texts(root)).toContain('Vui lòng nhập tài khoản');
  expect(texts(root)).toContain('Vui lòng nhập mật khẩu');

  const [userInput, passInput] = root.findAllByType(TextInput);

  // Sai mật khẩu
  await ReactTestRenderer.act(async () => {
    userInput.props.onChangeText('admin');
    passInput.props.onChangeText('sai');
  });
  await pressButton(root, 'Đăng nhập');
  expect(texts(root)).toContain('Tài khoản hoặc mật khẩu không đúng.');

  // Đúng -> vào Home thấy danh sách hội thoại
  await ReactTestRenderer.act(async () => {
    passInput.props.onChangeText('123456');
  });
  await pressButton(root, 'Đăng nhập');
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  expect(texts(root)).toContain('Nguyễn Văn An');
  expect(texts(root)).toContain('Nhớ mang laptop theo nha');
});
