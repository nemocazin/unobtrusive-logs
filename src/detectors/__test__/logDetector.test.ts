import { describe, it, expect, vi } from 'vitest';
import { findLogStatements, findMatchesWithRegex, getLogPatternsForLanguage } from '../logDetector';
import type * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
    Range: class {
        start: Position;
        end: Position;
        constructor(start: Position, end: Position) {
            this.start = start;
            this.end = end;
        }
    },
}));

type Position = {
    line: number;
    character: number;
};

type MockDocument = {
    getText: () => string;
    languageId: string;
    positionAt: (offset: number) => Position;
};

type MockEditor = {
    document: MockDocument;
};

/**
 * Creates a mock TextEditor with the given text and language ID.
 *
 * @param text text content of the document
 * @param languageId language identifier
 * @returns mock TextEditor instance
 */
function createMockEditor(text: string, languageId: string): vscode.TextEditor {
    const lines = text.split('\n');

    const mockEditor: MockEditor = {
        document: {
            getText: () => text,
            languageId,
            positionAt: (offset: number): Position => {
                let currentOffset = 0;
                for (let line = 0; line < lines.length; line++) {
                    const currentLine = lines[line];
                    if (currentLine === undefined) {
                        return { line: 0, character: 0 };
                    }
                    const lineLength = currentLine.length + 1; // +1 for newline
                    if (currentOffset + lineLength > offset || line === lines.length - 1) {
                        return {
                            line,
                            character: offset - currentOffset,
                        };
                    }
                    currentOffset += lineLength;
                }
                return { line: 0, character: 0 };
            },
        },
    };

    return mockEditor as vscode.TextEditor;
}

describe('logDetector', () => {
    describe('findLogStatements', () => {
        it('should match general log patterns (e.g., log.*)', () => {
            const text = 'log.info("general log");\nlog.debug("debug log");';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThanOrEqual(2);
        });

        it('should find console.log in TypeScript', () => {
            const text = 'const x = 5;\nconsole.log(x);\nconst y = 10;';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
            expect(results[0]?.range).toBeDefined();
        });

        it('should find multiple log statements in JavaScript', () => {
            const text = 'console.log("a");\nconsole.error("b");\nconsole.log("c");';
            const editor = createMockEditor(text, 'javascript');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThanOrEqual(2);
        });

        it('should handle TypeScript React files', () => {
            const text = 'console.log("test");';
            const editor = createMockEditor(text, 'typescriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle JavaScript React files', () => {
            const text = 'console.log("test");';
            const editor = createMockEditor(text, 'javascriptreact');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should return empty array when no logs found', () => {
            const text = 'const x = 5;\nconst y = 10;';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should default to TypeScript patterns for unknown languages', () => {
            const text = 'console.log("test");';
            const editor = createMockEditor(text, 'unknownlang');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle empty text', () => {
            const text = '';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should find std::cout in C++', () => {
            const text = 'std::cout << "Hello World" << std::endl;';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find std::cerr in C++', () => {
            const text = 'std::cerr << "Error message";';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find std::clog in C++', () => {
            const text = 'std::clog << "Log message";';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find cout without std:: prefix in C++', () => {
            const text = 'cout << "Hello" << endl;';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find cerr without std:: prefix in C++', () => {
            const text = 'cerr << "Error";';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find clog without std:: prefix in C++', () => {
            const text = 'clog << "Log";';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThan(0);
        });

        it('should find multiple C++ stream outputs', () => {
            const text = 'std::cout << "A";\ncerr << "B";\nstd::clog << "C";';
            const editor = createMockEditor(text, 'cpp');

            const results = findLogStatements(editor);

            expect(results.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('findMatchesWithRegex', () => {
        it('should find matches with a simple regex pattern', () => {
            const text = 'console.log("test");\nconsole.log("another");';
            const regex = /console\.log/g;
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithRegex(text, regex, editor);

            expect(results.length).toBe(2);
            expect(results[0]?.range).toBeDefined();
        });

        it('should return empty array when no matches found', () => {
            const text = 'const x = 5;\nconst y = 10;';
            const regex = /console\.log/g;
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithRegex(text, regex, editor);

            expect(results.length).toBe(0);
        });

        it('should handle multiple matches on same line', () => {
            const text = 'console.log("a"); console.log("b");';
            const regex = /console\.log/g;
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithRegex(text, regex, editor);

            expect(results.length).toBe(2);
        });

        it('should correctly calculate positions for matches', () => {
            const text = 'console.log("test");';
            const regex = /console\.log/g;
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithRegex(text, regex, editor);

            expect(results.length).toBe(1);
            expect(results[0]?.range.start.line).toBe(0);
            expect(results[0]?.range.start.character).toBe(0);
        });

        it('should handle empty text', () => {
            const text = '';
            const regex = /console\.log/g;
            const editor = createMockEditor(text, 'typescript');

            const results = findMatchesWithRegex(text, regex, editor);

            expect(results.length).toBe(0);
        });
    });

    describe('getLogPatternsForLanguage', () => {
        it('should return typescript patterns for typescript language', () => {
            const patterns = getLogPatternsForLanguage('typescript');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should return javascript patterns for javascript language', () => {
            const patterns = getLogPatternsForLanguage('javascript');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should map typescriptreact to typescript patterns', () => {
            const tsPatterns = getLogPatternsForLanguage('typescript');
            const tsxPatterns = getLogPatternsForLanguage('typescriptreact');

            expect(tsxPatterns.length).toBe(tsPatterns.length);
        });

        it('should map javascriptreact to javascript patterns', () => {
            const jsPatterns = getLogPatternsForLanguage('javascript');
            const jsxPatterns = getLogPatternsForLanguage('javascriptreact');

            expect(jsxPatterns.length).toBe(jsPatterns.length);
        });

        it('should return go patterns for go language', () => {
            const patterns = getLogPatternsForLanguage('go');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should default to typescript patterns for unknown languages', () => {
            const tsPatterns = getLogPatternsForLanguage('typescript');
            const unknownPatterns = getLogPatternsForLanguage('unknownlang');

            expect(unknownPatterns.length).toBe(tsPatterns.length);
        });

        it('should include general patterns for all languages', () => {
            const patterns = getLogPatternsForLanguage('typescript');

            // Patterns should include language-specific + general patterns
            expect(patterns.length).toBeGreaterThan(0);
        });

        it('should return RegExp array', () => {
            const patterns = getLogPatternsForLanguage('typescript');

            patterns.forEach(pattern => {
                expect(pattern).toBeInstanceOf(RegExp);
            });
        });

        it('should return cpp patterns for cpp language', () => {
            const patterns = getLogPatternsForLanguage('cpp');

            expect(patterns.length).toBeGreaterThan(0);
            expect(Array.isArray(patterns)).toBe(true);
        });

        it('should map c++ to cpp patterns', () => {
            const cppPatterns = getLogPatternsForLanguage('cpp');
            const cPlusPlusPatterns = getLogPatternsForLanguage('c++');

            expect(cPlusPlusPatterns.length).toBe(cppPatterns.length);
        });
    });
});
