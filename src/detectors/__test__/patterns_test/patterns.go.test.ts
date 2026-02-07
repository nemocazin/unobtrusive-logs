import { describe, it, expect } from 'vitest';
import { LOG_PATTERNS } from '../../patterns';

describe('LOG_PATTERNS', () => {
    /**
     * @brief Test a specific pattern against a given text.
     *
     * @param index The index of the pattern
     * @param text The text to test against the pattern
     */
    function testPattern(index: number, text: string) {
        const pattern = LOG_PATTERNS.go[index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    describe('go patterns - logger', () => {
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

    describe('go patterns - Logs', () => {
        it('should match s.Logs.Info statements', () => {
            testPattern(1, 's.Logs.Info("test")');
        });

        it('should match s.Logs.Debug statements', () => {
            testPattern(1, 's.Logs.Debug("debug")');
        });

        it('should match s.Logs.Error statements', () => {
            testPattern(1, 's.Logs.Error("error")');
        });

        it('should match s.Logs.Warn statements', () => {
            testPattern(1, 's.Logs.Warn("warning")');
        });

        it('should match s.Logs.Trace statements', () => {
            testPattern(1, 's.Logs.Trace("trace")');
        });

        it('should match s.Logs.Fatal statements', () => {
            testPattern(1, 's.Logs.Fatal("fatal")');
        });

        it('should match s.Logs.Panic statements', () => {
            testPattern(1, 's.Logs.Panic("panic")');
        });

        it('should match Logs with chained methods', () => {
            testPattern(1, 's.Logs.Info("test").WithContext(ctx)');
        });

        it('should match Logs with 2 chained methods', () => {
            testPattern(1, 's.Logs.Info("test").WithContext(ctx).Send()');
        });

        it('should match Logs with multiline arguments', () => {
            const multilineLog = `s.Logs.Error(
                "Error message",
                {
                    data: value,
                    user: "test"
                }
            )`;
            testPattern(1, multilineLog);
        });

        it('should match Logs with chained methods on multiple lines', () => {
            const multilineLog = `s.Logs.Info("message")
                .WithContext(ctx)
                .Send()`;
            testPattern(1, multilineLog);
        });

        it('should match Logs with complex multiline structure', () => {
            const multilineLog = `s.Logs.Debug(
                "Complex log",
                {
                    nested: {
                        data: "value",
                        array: []interface{}{1, 2, 3}
                    }
                }
            ).WithTimestamp()
             .WithLevel("DEBUG")
             .Send()`;
            testPattern(1, multilineLog);
        });

        it('should match ctx.Logs.Info statements', () => {
            testPattern(1, 'ctx.Logs.Info("test")');
        });

        it('should match this.Logs.Error statements', () => {
            testPattern(1, 'this.Logs.Error("error")');
        });

        it('should match service.Logs.Debug statements', () => {
            testPattern(1, 'service.Logs.Debug("debug")');
        });
    });
});
