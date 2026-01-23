import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'no-throw-literal': 'error',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ThrowStatement',
                    message: 'Throwing is not allowed.',
                },
            ],
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },

    tseslint.configs.recommended,
]);
