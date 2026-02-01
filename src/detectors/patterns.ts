/**
 * Predefined log statement patterns for various programming languages.
 */
export const LOG_PATTERNS = {
    general: [/\blog\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\)(?:\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\))*;?/g],

    typescript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g],

    javascript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/g],

    go: [/logger\.\w+\s*\([^)]*\)/g],

    cpp: [/std::(cout|cerr|clog)\s*<<[^;]*;?/g, /(cout|cerr|clog)\s*<<[^;]*;?/g],
};
