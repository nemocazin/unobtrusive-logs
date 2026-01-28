import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('c++ patterns', () => {
        const testPattern = (index: number, text: string) => {
            const pattern = LOG_PATTERNS.cpp[index];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
            }
        };

        it('should match std::cout statements', () => {
            testPattern(0, 'std::cout << "test";');
        });

        it('should match std::cerr statements', () => {
            testPattern(0, 'std::cerr << "test";');
        });
        it('should match std::clog statements', () => {
            testPattern(0, 'std::clog << "test";');
        });

        it('should match cout statements', () => {
            testPattern(1, 'cout << "test";');
        });

        it('should match cerr statements', () => {
            testPattern(1, 'cerr << "test";');
        });

        it('should match clog statements', () => {
            testPattern(1, 'clog << "test";');
        });
    });
});
