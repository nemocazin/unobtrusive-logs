import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { handleChangeColorCommand } from '../changeColorCommand';
import * as configManager from '../../config/configManager';
import * as decoration from '../../core/decoration';
import * as decorationUpdater from '../../core/decorationUpdater';

// Mock vscode module
vi.mock('vscode', () => ({
    window: {
        showQuickPick: vi.fn(),
        showInformationMessage: vi.fn(),
    },
}));

// Mock dependencies
vi.mock('../../config/configManager');
vi.mock('../../core/decoration');
vi.mock('../../core/decorationUpdater');

describe('changeColorCommand', () => {
    let toggleFromConfigMock: ReturnType<typeof vi.fn>;
    let saveColorToConfigMock: ReturnType<typeof vi.fn>;
    let recreateDecorationMock: ReturnType<typeof vi.fn>;
    let updateAllVisibleEditorsMock: ReturnType<typeof vi.fn>;
    let showQuickPickMock: ReturnType<typeof vi.fn>;
    let showInformationMessageMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();

        toggleFromConfigMock = vi.mocked(configManager.getToggleFromConfig);
        saveColorToConfigMock = vi.mocked(configManager.saveColorToConfig);
        recreateDecorationMock = vi.mocked(decoration.recreateDecoration);
        updateAllVisibleEditorsMock = vi.mocked(decorationUpdater.updateAllVisibleEditors);
        showQuickPickMock = vi.mocked(vscode.window.showQuickPick);
        showInformationMessageMock = vi.mocked(vscode.window.showInformationMessage);

        saveColorToConfigMock.mockResolvedValue(undefined);
        recreateDecorationMock.mockImplementation(() => {});
        updateAllVisibleEditorsMock.mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        toggleFromConfigMock.mockReturnValue(true);
    });

    describe('handleChangeColorCommand', () => {
        it('should save new color when user selects a color', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟥 Red',

                hexCode: '#FF0000',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FF0000');
        });

        it('should recreate decoration after saving new color', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟩 Green',

                hexCode: '#00FF00',
            });

            await handleChangeColorCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(1);
        });

        it('should show confirmation message with selected color name', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟨 Yellow',

                hexCode: '#FFFF00',
            });

            await handleChangeColorCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟨 Yellow');
        });

        it('should return if extension is toggle off', async () => {
            toggleFromConfigMock.mockReturnValue(false);

            await handleChangeColorCommand();

            expect(recreateDecorationMock).toHaveBeenCalledTimes(0);
        });

        it('should not save or update when user cancels selection', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).not.toHaveBeenCalled();
            expect(recreateDecorationMock).not.toHaveBeenCalled();
            expect(updateAllVisibleEditorsMock).not.toHaveBeenCalled();
            expect(showInformationMessageMock).not.toHaveBeenCalled();
        });

        it('should handle Defaut color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '⬛ Grey',

                hexCode: 'default',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('default');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🎨 Default');
        });

        it('should handle grey color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '⬛ Grey',
                hexCode: '#808080',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#808080');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to ⬛ Grey');
        });

        it('should handle purple color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Purple',
                hexCode: '#9B59B6',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#9B59B6');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Purple');
        });

        it('should handle orange color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟧 Orange',
                hexCode: '#FFA500',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FFA500');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟧 Orange');
        });

        it('should handle brown color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟫 Brown',
                hexCode: '#8B4513',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#8B4513');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟫 Brown');
        });

        it('should handle cyan color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟦 Cyan',
                hexCode: '#00FFFF',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#00FFFF');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟦 Cyan');
        });

        it('should handle pink color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Pink',
                hexCode: '#FF69B4',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FF69B4');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Pink');
        });

        it('should handle crimson color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟥 Crimson',
                hexCode: '#DC143C',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#DC143C');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟥 Crimson');
        });

        it('should handle lime color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟩 Lime',
                hexCode: '#32CD32',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#32CD32');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟩 Lime');
        });

        it('should handle navy color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟦 Navy',
                hexCode: '#000080',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#000080');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟦 Navy');
        });

        it('should handle gold color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟨 Gold',
                hexCode: '#FFD700',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FFD700');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟨 Gold');
        });

        it('should handle magenta color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Magenta',
                hexCode: '#FF00FF',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FF00FF');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Magenta');
        });

        it('should handle coral color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟧 Coral',
                hexCode: '#FF7F50',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FF7F50');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟧 Coral');
        });

        it('should handle chocolate color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟫 Chocolate',
                hexCode: '#D2691E',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#D2691E');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟫 Chocolate');
        });

        it('should handle silver color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '⬛ Silver',
                hexCode: '#C0C0C0',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#C0C0C0');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to ⬛ Silver');
        });

        it('should handle teal color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟦 Teal',
                hexCode: '#008080',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#008080');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟦 Teal');
        });

        it('should handle lavender color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Lavender',
                hexCode: '#E6E6FA',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#E6E6FA');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Lavender');
        });

        it('should handle maroon color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟥 Maroon',
                hexCode: '#800000',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#800000');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟥 Maroon');
        });

        it('should handle olive color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟩 Olive',
                hexCode: '#808000',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#808000');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟩 Olive');
        });

        it('should handle indigo color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟦 Indigo',
                hexCode: '#4B0082',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#4B0082');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟦 Indigo');
        });

        it('should handle khaki color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟨 Khaki',
                hexCode: '#F0E68C',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#F0E68C');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟨 Khaki');
        });

        it('should handle plum color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Plum',
                hexCode: '#DDA0DD',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#DDA0DD');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Plum');
        });

        it('should handle peach color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟧 Peach',
                hexCode: '#FFDAB9',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#FFDAB9');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟧 Peach');
        });

        it('should handle tan color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟫 Tan',
                hexCode: '#D2B48C',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#D2B48C');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟫 Tan');
        });

        it('should handle charcoal color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '⬛ Charcoal',
                hexCode: '#36454F',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#36454F');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to ⬛ Charcoal');
        });

        it('should handle turquoise color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟦 Turquoise',
                hexCode: '#40E0D0',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#40E0D0');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟦 Turquoise');
        });

        it('should handle orchid color selection', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟪 Orchid',
                hexCode: '#DA70D6',
            });

            await handleChangeColorCommand();

            expect(saveColorToConfigMock).toHaveBeenCalledWith('#DA70D6');
            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟪 Orchid');
        });

        it('should execute functions in correct order', async () => {
            const callOrder: string[] = [];

            showQuickPickMock.mockResolvedValue({
                label: '🟥 Red',
                hexCode: '#FF0000',
            });
            saveColorToConfigMock.mockImplementation(() => {
                callOrder.push('save');
            });
            recreateDecorationMock.mockImplementation(() => {
                callOrder.push('recreate');
            });
            showInformationMessageMock.mockImplementation(() => {
                callOrder.push('confirm');
            });

            await handleChangeColorCommand();

            expect(callOrder).toEqual(['save', 'recreate', 'confirm']);
        });
    });

    describe('promptForColor', () => {
        it('should display color picker with correct placeholder', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleChangeColorCommand();

            expect(showQuickPickMock).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ label: '🎨 Default', hexCode: 'default' }),
                    expect.objectContaining({ label: '⬛ Grey', hexCode: '#808080' }),
                ]),
                {
                    placeHolder: 'Select a color for logs',
                    matchOnDescription: true,
                },
            );
        });

        it('should include all 31 color options', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleChangeColorCommand();

            const calls = showQuickPickMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const colorOptions = calls[0]?.[0] as unknown[];

            expect(colorOptions).toHaveLength(31);
        });

        it('should have matchOnDescription set to true', async () => {
            showQuickPickMock.mockResolvedValue(undefined);

            await handleChangeColorCommand();

            const calls = showQuickPickMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const options = calls[0]?.[1] as { matchOnDescription?: boolean } | undefined;

            expect(options?.matchOnDescription).toBe(true);
        });
    });

    describe('showColorConfirmation', () => {
        it('should show message with color name for known colors', async () => {
            showQuickPickMock.mockResolvedValue({
                label: '🟥 Red',

                hexCode: '#FF0000',
            });

            await handleChangeColorCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to 🟥 Red');
        });

        it('should show message with hex code for unknown colors', async () => {
            showQuickPickMock.mockResolvedValue({
                label: 'Custom Color',

                hexCode: '#123456',
            });

            await handleChangeColorCommand();

            expect(showInformationMessageMock).toHaveBeenCalledWith('Log color set to #123456');
        });
    });
});
