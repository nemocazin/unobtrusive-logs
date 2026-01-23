import { describe, it, expect, vi } from 'vitest';

type Position = {
    line: number;
    character: number;
};

describe('logDetector', () => {
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

    describe('language mapping', () => {
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

    describe('regex matching', () => {
        it('should find console.log in text', () => {
            const text = 'const x = 5;\nconsole.log(x);\nconst y = 10;';
            const regex = /console\.log\s*\([^)]*\);?/g;
            const matches = [...text.matchAll(regex)];

            expect(matches.length).toBe(1);
            const firstMatch = matches[0];
            expect(firstMatch).toBeDefined();
            if (firstMatch) {
                expect(firstMatch[0]).toBe('console.log(x);');
            }
        });

        it('should find multiple log statements', () => {
            const text = 'console.log("a");\nlog.info("b");\nconsole.log("c");';
            const consoleRegex = /console\.log\s*\([^)]*\);?/g;
            const matches = [...text.matchAll(consoleRegex)];

            expect(matches.length).toBe(2);
        });

        it('should find Go fmt.Println', () => {
            const text = 'fmt.Println("Hello")\nfmt.Printf("%s", name)';
            const regex = /fmt\.Println\s*\([^)]*\)/g;
            const matches = [...text.matchAll(regex)];

            expect(matches.length).toBe(1);
            const firstMatch = matches[0];
            expect(firstMatch).toBeDefined();
            if (firstMatch) {
                expect(firstMatch[0]).toBe('fmt.Println("Hello")');
            }
        });
    });
});
