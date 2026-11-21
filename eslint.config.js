import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
	{ ignores: ['build', 'node_modules'] },
	js.configs.recommended,
	{
		files: ['src/**/*.{js,jsx}'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		plugins: { 'react-hooks': reactHooks },
		rules: reactHooks.configs.recommended.rules,
	},
	{
		files: ['server.js', '*.config.js'],
		languageOptions: { globals: globals.node },
	},
	{
		rules: {
			indent: [2, 'tab', { SwitchCase: 1 }],
		},
	},
];
