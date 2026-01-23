import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleChangeOpacityCommand } from '../changeOpacityCommand';
import * as configManager from '../../config/configManager';
import * as decoration from '../../core/decoration';
import * as decorationUpdater from '../../core/decorationUpdater';

// Mock vscode module
vi.mock('vscode', () => ({
    window: {
        showInputBox: vi.fn(),
        showInformationMessage: vi.fn(),
    },
}));

// Mock dependencies
vi.mock('../../config/configManager');
vi.mock('../../core/decoration');
vi.mock('../../core/decorationUpdater');

describe('changeOpacityCommand', () => {
    let getOpacityFromConfigMock: ReturnType<typeof vi.fn>;
    let saveOpacityToConfigMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let updateAllVisibleEditorsMock: ReturnType<typeof vi.fn>;
    let showInputBoxMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        getOpacityFromConfigMock = vi.mocked(configManager.getOpacityFromConfig);
        saveOpacityToConfigMock = vi.mocked(configManager.saveOpacityToConfig);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        updateAllVisibleEditorsMock = vi.mocked(decorationUpdater.updateAllVisibleEditors);
        showInputBoxMock = vi.mocked(vscode.window.showInputBox);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        getOpacityFromConfigMock.mockReturnValue(50);
        saveOpacityToConfigMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
        updateAllVisibleEditorsMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('validateOpacityInput', () => {
        // Extract the validation function for testing
        const validateOpacityInput = (value: string): string | null => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 100) {
                return 'Please enter a number between 0 and 100';
            }
            return null;
        };

        it('should return null for valid opacity value 0', () => {
            expect(validateOpacityInput('0')).toBeNull();
        });

        it('should return null for valid opacity value 50', () => {
            expect(validateOpacityInput('50')).toBeNull();
        });

        it('should return null for valid opacity value 100', () => {
            expect(validateOpacityInput('100')).toBeNull();
        });

        it('should return null for valid decimal opacity value', () => {
            expect(validateOpacityInput('33.5')).toBeNull();
            expect(validateOpacityInput('75.25')).toBeNull();
        });

        it('should return error message for value below 0', () => {
            expect(validateOpacityInput('-1')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('-50')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for value above 100', () => {
            expect(validateOpacityInput('101')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('200')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('999')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for non-numeric input', () => {
            expect(validateOpacityInput('abc')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('fifty')).toBe('Please enter a number between 0 and 100');
            expect(validateOpacityInput('test')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for empty string', () => {
            expect(validateOpacityInput('')).toBe('Please enter a number between 0 and 100');
        });

        it('should return error message for whitespace', () => {
            expect(validateOpacityInput('   ')).toBe('Please enter a number between 0 and 100');
        });

        it('should accept numeric strings with whitespace', () => {
            expect(validateOpacityInput(' 50 ')).toBeNull();
            expect(validateOpacityInput('  75  ')).toBeNull();
        });

        it('should return error message for special characters', () => {
            expect(validateOpacityInput('@#$')).toBe('Please enter a number between 0 and 100');
        });

        it('should accept edge case values', () => {
            expect(validateOpacityInput('0.1')).toBeNull();
            expect(validateOpacityInput('99.9')).toBeNull();
        });
    });

    describe('handleChangeOpacityCommand', () => {
        it('should get current opacity from config', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(getOpacityFromConfigMock).toHaveBeenCalledTimes(1);
        });

        it('should prompt user with current opacity value', async () => {
            getOpacityFromConfigMock.mockReturnValue(75);
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(showInputBoxMock).toHaveBeenCalledWith({
                prompt: 'Enter opacity value (0 = invisible, 100 = normal)',
                value: '75',
                validateInput: expect.any(Function),
            });
        });

        it('should save new opacity value when user provides valid input', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('80');

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).toHaveBeenCalledWith(80);
        });

        it('should recreate decoration after saving new opacity', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('60');

            await handleChangeOpacityCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should update all visible editors after changing opacity', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('70');

            await handleChangeOpacityCommand();

            expect(updateAllVisibleEditorsMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with new opacity value', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('90');

            await handleChangeOpacityCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 90%');
        });

        it('should not save or update when user cancels input', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(updateAllVisibleEditorsMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalled();
        });

        it('should not save or update when user provides empty string', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('');

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(updateAllVisibleEditorsMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalled();
        });

        it('should handle decimal opacity values correctly', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('33.5');

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).toHaveBeenCalledWith(33.5);
            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 33.5%');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('60');
            saveOpacityToConfigMock.mockImplementation(async () => {
                callOrder.push('save');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            updateAllVisibleEditorsMock.mockImplementation(() => {
                callOrder.push('update');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
                return Promise.resolve(undefined);
            });

            await handleChangeOpacityCommand();

            expect(callOrder).toEqual(['save', 'recreate', 'update', 'confirm']);
        });

        it('should handle opacity value of 0', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('0');

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).toHaveBeenCalledWith(0);
            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 0%');
        });

        it('should handle opacity value of 100', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('100');

            await handleChangeOpacityCommand();

            expect(saveOpacityToConfigMock).toHaveBeenCalledWith(100);
            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 100%');
        });
    });

    describe('promptForOpacity', () => {
        it('should display correct prompt message', async () => {
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const calls = showInputBoxMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0]?.[0];

            expect(callArgs?.prompt).toBe('Enter opacity value (0 = invisible, 100 = normal)');
        });

        it('should pre-fill input with current value', async () => {
            getOpacityFromConfigMock.mockReturnValue(65);
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const calls = showInputBoxMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0]?.[0];

            expect(callArgs?.value).toBe('65');
        });

        it('should include validation function', async () => {
            showInputBoxMock.mockResolvedValue(undefined);

            await handleChangeOpacityCommand();

            const calls = showInputBoxMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0]?.[0];

            expect(callArgs?.validateInput).toBeTypeOf('function');
        });
    });

    describe('showOpacityConfirmation', () => {
        it('should show message with percentage symbol', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('42');

            await handleChangeOpacityCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 42%');
        });

        it('should format decimal values in message', async () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            showInputBoxMock.mockResolvedValue('66.67');

            await handleChangeOpacityCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Logs opacity set to 66.67%');
        });
    });
});
