/**
 * Predefined log statement patterns for various programming languages.
 */
export const LOG_PATTERNS = {
    general: [
        /\blog\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\)(?:\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\))*;?/gs,
        /\bLog\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\)(?:\.\w+\s*\([^()]*(?:\([^()]*\)[^()]*)*\))*;?/gs,
    ],

    typescript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/gs],

    javascript: [/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\);?/gs],

    go: [/logger\.\w+\s*\([^)]*\)/gs, /\w+\.Logs\.\w+\((?:[^()]*|\([^()]*\))*\)[^;]*;?/gs],

    cpp: [/std::(cout|cerr|clog)\s*<<[^;]*;?/gs, /(cout|cerr|clog)\s*<<[^;]*;?/gs],
};
