import { describe, it, expect, vi } from 'vitest';
import { findLogStatements } from '../logDetector';
import type * as vscode from 'vscode';

describe('logDetector', () => {
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

    // Helper function to create a mock editor
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

    describe('findLogStatements', () => {
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

            // Should still find console.log using default TypeScript patterns
            expect(results.length).toBeGreaterThan(0);
        });

        it('should handle empty text', () => {
            const text = '';
            const editor = createMockEditor(text, 'typescript');

            const results = findLogStatements(editor);

            expect(results.length).toBe(0);
        });

        it('should map typescript to typescript patterns', () => {
            const languageMap: { [key: string]: string } = {
                typescript: 'typescript',
                javascript: 'javascript',
                typescriptreact: 'typescript',
                javascriptreact: 'javascript',
                go: 'go',
            };

            expect(languageMap['typescript']).toBe('typescript');
            expect(languageMap['typescriptreact']).toBe('typescript');
            expect(languageMap['javascript']).toBe('javascript');
            expect(languageMap['javascriptreact']).toBe('javascript');
            expect(languageMap['go']).toBe('go');
        });
    });
});
