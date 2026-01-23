import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { getOpacityFromConfig, saveOpacityToConfig } from '../configManager';

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
    let configMock: vscode.WorkspaceConfiguration;

    beforeEach(() => {
        // Create a mock for WorkspaceConfiguration
        configMock = {
            get: vi.fn(),
            update: vi.fn().mockResolvedValue(undefined),
            has: vi.fn(),
            inspect: vi.fn(),
        } as vscode.WorkspaceConfiguration;

        // Mock getConfiguration to return our configMock
        vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(configMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getOpacityFromConfig', () => {
        it('should return the configured opacity value', () => {
            vi.mocked(configMock.get).mockReturnValue(75);

            const result = getOpacityFromConfig();

            expect(result).toBe(75);
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('logsOpacity');
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

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('logsOpacity');
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

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('logsOpacity');
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

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('logsOpacity');
            expect(vscode.workspace.getConfiguration).toHaveBeenCalledTimes(2);
        });
    });
});
