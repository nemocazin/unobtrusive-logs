import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('general patterns', () => {
        const testPattern = (index: number, text: string) => {
            const pattern = LOG_PATTERNS.general[index];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
            }
        };

        it('should match log.info statements', () => {
            testPattern(0, 'log.info("test");');
        });

        it('should match log.debug statements', () => {
            testPattern(0, 'log.debug("test");');
        });

        it('should match log.verbose statements', () => {
            testPattern(0, 'log.verbose("test");');
        });

        it('should match log.warn statements', () => {
            testPattern(0, 'log.warn("test");');
        });

        it('should match log.error statements', () => {
            testPattern(0, 'log.error("test");');
        });
    });
});
