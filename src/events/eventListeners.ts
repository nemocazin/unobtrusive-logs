import * as vscode from 'vscode';
import { updateDecorations, updateAllVisibleEditors } from '../core/decorationUpdater';
import { recreateDecoration } from '../core/decoration';

/**
 * Registers event listeners for the extension.
 *
 * @param context The extension context to register event listeners in.
 */
export function registerEventListeners(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        // Update decorations when the active editor changes
        vscode.window.onDidChangeActiveTextEditor(editor => {
            updateDecorations(editor);
        }),
        // Update decorations when the text document changes
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        }),
        // Update decorations when the configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('unobtrusive-logs.opacity')) {
                recreateDecoration();
                updateAllVisibleEditors();
            }
        }),
    );
}
