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
                    message: 'Throwing literals is not allowed.',
                },
            ],
        },
    },

    tseslint.configs.recommended,
]);
