module.exports = {
  '*.{js,jsx,ts,tsx}': 'eslint --cache --fix',
  '*.{js,jsx,ts,tsx,css,md}': 'prettier --write',
  '*.{ts,tsx}': [() => 'tsc --skipLibCheck --noEmit'],
};
