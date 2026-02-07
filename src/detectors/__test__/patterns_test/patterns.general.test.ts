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
        const pattern = LOG_PATTERNS.general[index];
        expect(pattern).toBeDefined();

        if (pattern) {
            const matches = text.match(pattern);
            expect(matches).not.toBeNull();
        }
    }

    describe('log patterns (lowercase)', () => {
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

        it('should match logs with another function behind', () => {
            testPattern(0, 'log.error("test").format();');
        });

        it('should match logs with 2 functions behind', () => {
            testPattern(0, 'log.error("test").format().time();');
        });

        it('should match logs with 10 functions behind', () => {
            testPattern(
                0,
                'log.error("test").format().time().relog().relog().relog().relog().relog().relog().relog().relog();',
            );
        });

        it('should match logs with brackets inside', () => {
            testPattern(0, 'log.error("Test ${id.toString()} "is happening);');
        });

        it('should match logs with brackets inside and fonctions behind', () => {
            testPattern(0, 'log.error("Test ${id.toString()} "is happening).format().time();');
        });

        it('should match log.info with multiline arguments', () => {
            const multilineLog = `log.info(
                "Message d'information",
                { 
                    data: value,
                    user: "test"
                }
            );`;
            testPattern(0, multilineLog);
        });

        it('should match log.error with chained methods on multiple lines', () => {
            const multilineLog = `log.error("error message")
                .withContext(ctx)
                .send();`;
            testPattern(0, multilineLog);
        });

        it('should match log.debug with complex multiline structure', () => {
            const multilineLog = `log.debug(
                "Complex log",
                {
                    nested: {
                        data: "value",
                        array: [1, 2, 3]
                    }
                }
            ).withTimestamp()
             .withLevel("DEBUG")
             .send();`;
            testPattern(0, multilineLog);
        });

        it('should match log with template literals on multiple lines', () => {
            const multilineLog = `log.info(\`User \${user.name} 
                performed action 
                \${action.type}\`);`;
            testPattern(0, multilineLog);
        });

        it('should match multiple logs in same text', () => {
            const text = `
                log.info("First log");
                log.error("Second log");
                log.debug("Third log");
            `;
            const pattern = LOG_PATTERNS.general[0];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
                expect(matches?.length).toBe(3);
            }
        });
    });

    describe('Log patterns (uppercase)', () => {
        it('should match Log.Info statements', () => {
            testPattern(1, 'Log.Info("test");');
        });

        it('should match Log.Debug statements', () => {
            testPattern(1, 'Log.Debug("test");');
        });

        it('should match Log.Verbose statements', () => {
            testPattern(1, 'Log.Verbose("test");');
        });

        it('should match Log.Warn statements', () => {
            testPattern(1, 'Log.Warn("test");');
        });

        it('should match Log.Error statements', () => {
            testPattern(1, 'Log.Error("test");');
        });

        it('should match Logs with another function behind', () => {
            testPattern(1, 'Log.Error("test").Format();');
        });

        it('should match Logs with 2 functions behind', () => {
            testPattern(1, 'Log.Error("test").Format().Time();');
        });

        it('should match Logs with 10 functions behind', () => {
            testPattern(
                1,
                'Log.Error("test").Format().Time().Relog().Relog().Relog().Relog().Relog().Relog().Relog().Relog();',
            );
        });

        it('should match Logs with brackets inside', () => {
            testPattern(1, 'Log.Error("Test ${id.ToString()} "is happening);');
        });

        it('should match Logs with brackets inside and fonctions behind', () => {
            testPattern(1, 'Log.Error("Test ${id.ToString()} "is happening).Format().Time();');
        });

        it('should match Log.Info with multiline arguments', () => {
            const multilineLog = `Log.Info(
                "Message d'information",
                { 
                    data: value,
                    user: "test"
                }
            );`;
            testPattern(1, multilineLog);
        });

        it('should match Log.Error with chained methods on multiple lines', () => {
            const multilineLog = `Log.Error("error message")
                .WithContext(ctx)
                .Send();`;
            testPattern(1, multilineLog);
        });

        it('should match Log.Debug with complex multiline structure', () => {
            const multilineLog = `Log.Debug(
                "Complex log",
                {
                    nested: {
                        data: "value",
                        array: [1, 2, 3]
                    }
                }
            ).WithTimestamp()
             .WithLevel("DEBUG")
             .Send();`;
            testPattern(1, multilineLog);
        });

        it('should match Log with template literals on multiple lines', () => {
            const multilineLog = `Log.Info(\`User \${user.name} 
                performed action 
                \${action.type}\`);`;
            testPattern(1, multilineLog);
        });

        it('should match multiple Logs in same text', () => {
            const text = `
                Log.Info("First log");
                Log.Error("Second log");
                Log.Debug("Third log");
            `;
            const pattern = LOG_PATTERNS.general[1];
            expect(pattern).toBeDefined();

            if (pattern) {
                const matches = text.match(pattern);
                expect(matches).not.toBeNull();
                expect(matches?.length).toBe(3);
            }
        });
    });
});
