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

        it('should match console.log without semicolon', () => {
            testPattern(0, 'console.log("test")');
        });

        it('should match log.info statements', () => {
            testPattern(1, 'log.info("test");');
        });

        it('should match log.debug statements', () => {
            testPattern(1, 'log.debug("test");');
        });

        it('should match log.verbose statements', () => {
            testPattern(1, 'log.verbose("test");');
        });

        it('should match log.warn statements', () => {
            testPattern(1, 'log.warn("test");');
        });

        it('should match log.error statements', () => {
            testPattern(1, 'log.error("test");');
        });
    });
});
