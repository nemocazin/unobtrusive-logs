/**
 * Predefined log statement patterns for various programming languages.
 */
export const LOG_PATTERNS = {
    general: [/\blog\.\w+\s*\([^)]*\);?/g],

    typescript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g],

    javascript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g],

    go: [/logger\.\w+\s*\([^)]*\)/g],
};
