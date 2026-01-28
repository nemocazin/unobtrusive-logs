import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    describe('go patterns', () => {
        const testPattern = (index: number, text: string) => {
            const pattern = LOG_PATTERNS.go[index];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
            }
        };

        it('should match logger.Info statements', () => {
            testPattern(0, 'logger.Info("test")');
        });

        it('should match logger.Debug statements', () => {
            testPattern(0, 'logger.Debug("debug")');
        });

        it('should match logger.Error statements', () => {
            testPattern(0, 'logger.Error("error")');
        });

        it('should match logger.Warn statements', () => {
            testPattern(0, 'logger.Warn("warning")');
        });

        it('should match logger.Trace statements', () => {
            testPattern(0, 'logger.Trace("trace")');
        });

        it('should match logger.Fatal statements', () => {
            testPattern(0, 'logger.Fatal("fatal")');
        });

        it('should match logger.Panic statements', () => {
            testPattern(0, 'logger.Panic("panic")');
        });
    });
});
