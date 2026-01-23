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

        it('should match log.Println statements', () => {
            testPattern(0, 'log.Println("test")');
        });

        it('should match log.Printf statements', () => {
            testPattern(1, 'log.Printf("test")');
        });

        it('should match log.Print statements', () => {
            testPattern(2, 'log.Print("test")');
        });

        it('should match log.Fatal statements', () => {
            testPattern(3, 'log.Fatal("test")');
        });

        it('should match log.Fatalf statements', () => {
            testPattern(4, 'log.Fatalf("test")');
        });

        it('should match log.Panic statements', () => {
            testPattern(5, 'log.Panic("test")');
        });

        it('should match log.Panicf statements', () => {
            testPattern(6, 'log.Panicf("test")');
        });
    });
});
