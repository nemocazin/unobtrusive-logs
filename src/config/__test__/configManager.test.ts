import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getOpacityFromConfig, saveOpacityToConfig, getColorFromConfig, saveColorToConfig } from '../configManager';

// Mock the vscode module
vi.mock('vscode', () => ({
    workspace: {
        getConfiguration: vi.fn(),
    },
    ConfigurationTarget: {
        Global: 1,
    },
}));

describe('Opacity Configuration Tests', () => {
    let configMock: {
        get: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        has: ReturnType<typeof vi.fn>;
        inspect: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        // Create config  mock
        configMock = {
            get: vi.fn(),
            update: vi.fn().mockResolvedValue(undefined),
            has: vi.fn(),
            inspect: vi.fn(),
        };

        vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(configMock as vscode.WorkspaceConfiguration);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getOpacityFromConfig', () => {
        it('should return the configured opacity value', () => {
            vi.mocked(configMock.get).mockReturnValue(75);

            const result = getOpacityFromConfig();

            expect(result).toBe(75);
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('opacity', 50);
        });

        it('should return default value of 50 when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue(50);

            const result = getOpacityFromConfig();

            expect(result).toBe(50);
        });

        it('should handle minimum opacity value (0)', () => {
            vi.mocked(configMock.get).mockReturnValue(0);

            const result = getOpacityFromConfig();

            expect(result).toBe(0);
        });

        it('should handle maximum opacity value (100)', () => {
            vi.mocked(configMock.get).mockReturnValue(100);

            const result = getOpacityFromConfig();

            expect(result).toBe(100);
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue(50);

            getOpacityFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue(50);

            getOpacityFromConfig();

            expect(configMock.get).toHaveBeenCalledWith('opacity', 50);
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveOpacityToConfig', () => {
        it('should save opacity value to global configuration', async () => {
            await saveOpacityToConfig(75);

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith('opacity', 75, vscode.ConfigurationTarget.Global);
        });

        it('should save minimum opacity value (0)', async () => {
            await saveOpacityToConfig(0);

            expect(configMock.update).toHaveBeenCalledWith('opacity', 0, vscode.ConfigurationTarget.Global);
        });

        it('should handle decimal opacity values', async () => {
            await saveOpacityToConfig(75.5);

            expect(configMock.update).toHaveBeenCalledWith('opacity', 75.5, vscode.ConfigurationTarget.Global);
        });

        it('should handle negative opacity values (no validation in function)', async () => {
            await saveOpacityToConfig(-10);

            expect(configMock.update).toHaveBeenCalledWith('opacity', -10, vscode.ConfigurationTarget.Global);
        });

        it('should handle opacity values over 100 (no validation in function)', async () => {
            await saveOpacityToConfig(150);

            expect(configMock.update).toHaveBeenCalledWith('opacity', 150, vscode.ConfigurationTarget.Global);
        });

        it('should save maximum opacity value (100)', async () => {
            await saveOpacityToConfig(100);

            expect(configMock.update).toHaveBeenCalledWith('opacity', 100, vscode.ConfigurationTarget.Global);
        });

        it('should save mid-range opacity values', async () => {
            await saveOpacityToConfig(42);

            expect(configMock.update).toHaveBeenCalledWith('opacity', 42, vscode.ConfigurationTarget.Global);
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveOpacityToConfig(50)).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveOpacityToConfig(50)).rejects.toThrow('Configuration update failed');
        });

        it('should use Global configuration target', async () => {
            await saveOpacityToConfig(50);

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Number),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should handle multiple consecutive saves', async () => {
            await saveOpacityToConfig(30);
            await saveOpacityToConfig(60);
            await saveOpacityToConfig(90);

            expect(configMock.update).toHaveBeenCalledTimes(3);
            expect(configMock.update).toHaveBeenNthCalledWith(1, 'opacity', 30, vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(2, 'opacity', 60, vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(3, 'opacity', 90, vscode.ConfigurationTarget.Global);
        });

        it('should call update only once per save', async () => {
            await saveOpacityToConfig(75);

            expect(configMock.update).toHaveBeenCalledTimes(1);
        });

        it('should be able to save and retrieve the same value', async () => {
            const testOpacity = 65;

            await saveOpacityToConfig(testOpacity);
            vi.mocked(configMock.get).mockReturnValue(testOpacity);

            const result = getOpacityFromConfig();

            expect(result).toBe(testOpacity);
        });

        it('should maintain configuration section consistency', async () => {
            await saveOpacityToConfig(75);
            getOpacityFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2);
        });
    });

    describe('getColorFromConfig', () => {
        it('should return the configured color value', () => {
            vi.mocked(configMock.get).mockReturnValue('#FF5733');

            const result = getColorFromConfig();

            expect(result).toBe('#FF5733');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.get).toHaveBeenCalledWith('color', '#808080');
        });

        it('should return default value of #808080 when no configuration exists', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            const result = getColorFromConfig();

            expect(result).toBe('#808080');
        });

        it('should handle various hex color formats', () => {
            const colors = ['#000000', '#FFFFFF', '#123ABC', '#fff'];

            colors.forEach(color => {
                vi.mocked(configMock.get).mockReturnValue(color);
                const result = getColorFromConfig();
                expect(result).toBe(color);
            });
        });

        it('should use correct configuration section name', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            getColorFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
        });

        it('should call get with correct parameters', () => {
            vi.mocked(configMock.get).mockReturnValue('#808080');

            getColorFromConfig();

            expect(configMock.get).toHaveBeenCalledWith('color', '#808080');
            expect(configMock.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveColorToConfig', () => {
        it('should save color value to global configuration', async () => {
            await saveColorToConfig('#FF5733');

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(configMock.update).toHaveBeenCalledWith('color', '#FF5733', vscode.ConfigurationTarget.Global);
        });

        it('should save various hex color values', async () => {
            const testColors = ['#000000', '#FFFFFF', '#808080', '#FF5733'];

            for (const color of testColors) {
                await saveColorToConfig(color);
                expect(configMock.update).toHaveBeenCalledWith('color', color, vscode.ConfigurationTarget.Global);
            }
        });

        it('should save shorthand hex colors', async () => {
            await saveColorToConfig('#fff');

            expect(configMock.update).toHaveBeenCalledWith('color', '#fff', vscode.ConfigurationTarget.Global);
        });

        it('should save lowercase hex colors', async () => {
            await saveColorToConfig('#abc123');

            expect(configMock.update).toHaveBeenCalledWith('color', '#abc123', vscode.ConfigurationTarget.Global);
        });

        it('should save uppercase hex colors', async () => {
            await saveColorToConfig('#ABC123');

            expect(configMock.update).toHaveBeenCalledWith('color', '#ABC123', vscode.ConfigurationTarget.Global);
        });

        it('should resolve promise when update succeeds', async () => {
            vi.mocked(configMock.update).mockResolvedValue(undefined);

            await expect(saveColorToConfig('#808080')).resolves.toBeUndefined();
        });

        it('should reject promise when update fails', async () => {
            const error = new Error('Configuration update failed');
            vi.mocked(configMock.update).mockRejectedValue(error);

            await expect(saveColorToConfig('#808080')).rejects.toThrow('Configuration update failed');
        });

        it('should use Global configuration target', async () => {
            await saveColorToConfig('#808080');

            expect(configMock.update).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                vscode.ConfigurationTarget.Global,
            );
        });

        it('should handle multiple consecutive saves', async () => {
            await saveColorToConfig('#FF0000');
            await saveColorToConfig('#00FF00');
            await saveColorToConfig('#0000FF');

            expect(configMock.update).toHaveBeenCalledTimes(3);
            expect(configMock.update).toHaveBeenNthCalledWith(1, 'color', '#FF0000', vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(2, 'color', '#00FF00', vscode.ConfigurationTarget.Global);
            expect(configMock.update).toHaveBeenNthCalledWith(3, 'color', '#0000FF', vscode.ConfigurationTarget.Global);
        });

        it('should call update only once per save', async () => {
            await saveColorToConfig('#808080');

            expect(configMock.update).toHaveBeenCalledTimes(1);
        });

        it('should be able to save and retrieve the same value', async () => {
            const testColor = '#FF5733';

            await saveColorToConfig(testColor);
            vi.mocked(configMock.get).mockReturnValue(testColor);

            const result = getColorFromConfig();

            expect(result).toBe(testColor);
        });

        it('should maintain configuration section consistency', async () => {
            await saveColorToConfig('#808080');
            getColorFromConfig();

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('unobtrusive-logs');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2);
        });
    });
});
