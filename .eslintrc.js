module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Cho phép truyền component qua props (headerRight, tabBarIcon...) của React Navigation
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
};
