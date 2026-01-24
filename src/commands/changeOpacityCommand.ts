import * as vscode from 'vscode';
import { getOpacityFromConfig, saveOpacityToConfig } from '../config/configManager';
import { recreateDecoration } from '../core/decoration';
import { updateAllVisibleEditors } from '../core/decorationUpdater';

/**
 * Handles the command to change the opacity of log statements.
 */
export async function handleChangeOpacityCommand(): Promise<void> {
    const currentOpacity = getOpacityFromConfig();
    const input = await promptForOpacity(currentOpacity);

    if (input) {
        const newOpacity = parseFloat(input);
        await saveOpacityToConfig(newOpacity);
        recreateDecoration();
        updateAllVisibleEditors();
        showOpacityConfirmation(newOpacity);
    }
}

/**
 * Prompts the user to enter a new opacity value.
 *
 * @param currentValue The current opacity value to pre-fill in the input box.
 * @returns The user input as a string, or undefined if the input was canceled.
 */
async function promptForOpacity(currentValue: number): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt: 'Enter opacity value (0 = invisible, 100 = normal)',
        value: currentValue.toString(),
        validateInput: validateOpacityInput,
    });
}

/**
 * Validates the user input for opacity.
 *
 * @param value The user input string.
 * @returns An error message if the input is invalid, or null if valid.
 */
export function validateOpacityInput(value: string): string | null {
    const num = parseFloat(value);
    const trimmed = value.trim();

    // Check if the number is within the valid range (0 to 100)
    if (value === '' || num < 0 || num > 100) {
        return 'Please enter a number between 0 and 100';
    }

    // Check if it's a valid number format (integers or decimals only)
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return "Please don't include special characters or letters";
    }

    return null;
}

/**
 * Shows a confirmation message to the user about the new opacity setting.
 *
 * @param opacity The new opacity value.
 */
function showOpacityConfirmation(opacity: number): void {
    vscode.window.showInformationMessage(`Logs opacity set to ${opacity}%`);
}
