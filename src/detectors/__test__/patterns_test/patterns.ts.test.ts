import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('typescript patterns', () => {
        const testPattern = (index: number, text: string) => {
            const pattern = LOG_PATTERNS.typescript[index];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
            }
        };

        it('should match console.log statements', () => {
            testPattern(0, 'console.log("test");');
        });

        it('should match console.warn statements', () => {
            testPattern(0, 'console.warn("test");');
        });
        it('should match console.error statements', () => {
            testPattern(0, 'console.error("test");');
        });

        it('should match console.info statements', () => {
            testPattern(0, 'console.info("test");');
        });

        it('should match console.debug statements', () => {
            testPattern(0, 'console.debug("test");');
        });

        it('should match console.trace statements', () => {
            testPattern(0, 'console.trace("test");');
        });
    });
});
