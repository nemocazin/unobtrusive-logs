import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { registerEventListeners } from '../eventListeners';
import { updateDecorations, updateAllVisibleEditors } from '../../core/decorationUpdater';
import { recreateDecoration } from '../../core/decoration';

// Mock the vscode module
vi.mock('vscode', () => ({
    window: {
        onDidChangeActiveTextEditor: vi.fn(),
        activeTextEditor: undefined,
    },
    workspace: {
        onDidChangeTextDocument: vi.fn(),
        onDidChangeConfiguration: vi.fn(),
    },
}));

// Mock the core modules
vi.mock('../../core/decorationUpdater', () => ({
    updateDecorations: vi.fn(),
    updateAllVisibleEditors: vi.fn(),
}));

vi.mock('../../core/decoration', () => ({
    recreateDecoration: vi.fn(),
}));

describe('registerEventListeners', () => {
    let mockContext: Partial<vscode.ExtensionContext>;
    let mockEditor: Partial<vscode.TextEditor>;
    let mockDocument: Partial<vscode.TextDocument>;
    let mockConfigChangeEvent: Partial<vscode.ConfigurationChangeEvent>;
    let mockTextDocumentChangeEvent: Partial<vscode.TextDocumentChangeEvent>;
    let onDidChangeActiveTextEditorCallback: ((editor: vscode.TextEditor | undefined) => void) | null;
    let onDidChangeTextDocumentCallback: ((event: vscode.TextDocumentChangeEvent) => void) | null;
    let onDidChangeConfigurationCallback: ((event: vscode.ConfigurationChangeEvent) => void) | null;

    beforeEach(() => {
        // Reset callbacks
        onDidChangeActiveTextEditorCallback = null;
        onDidChangeTextDocumentCallback = null;
        onDidChangeConfigurationCallback = null;

        // Create mock context
        mockContext = {
            subscriptions: [],
        };

        // Create mock document
        mockDocument = {
            uri: { fsPath: '/test/file.ts' } as vscode.Uri,
        };

        // Create mock editor
        mockEditor = {
            document: mockDocument as vscode.TextDocument,
        };

        // Create mock config change event
        mockConfigChangeEvent = {
            affectsConfiguration: vi.fn(),
        };

        // Create mock text document change event
        mockTextDocumentChangeEvent = {
            document: mockDocument as vscode.TextDocument,
        };

        // Setup vscode.window mocks
        vi.mocked(vscode.window.onDidChangeActiveTextEditor).mockImplementation(callback => {
            onDidChangeActiveTextEditorCallback = callback;
            return { dispose: vi.fn() };
        });

        Object.defineProperty(vscode.window, 'activeTextEditor', {
            value: mockEditor as vscode.TextEditor,
            writable: true,
            configurable: true,
        });

        // Setup vscode.workspace mocks
        vi.mocked(vscode.workspace.onDidChangeTextDocument).mockImplementation(callback => {
            onDidChangeTextDocumentCallback = callback;
            return { dispose: vi.fn() };
        });

        vi.mocked(vscode.workspace.onDidChangeConfiguration).mockImplementation(callback => {
            onDidChangeConfigurationCallback = callback;
            return { dispose: vi.fn() };
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should register all event listeners', () => {
        registerEventListeners(mockContext as vscode.ExtensionContext);

        expect(vscode.window.onDidChangeActiveTextEditor).toHaveBeenCalledOnce();
        expect(vscode.workspace.onDidChangeTextDocument).toHaveBeenCalledOnce();
        expect(vscode.workspace.onDidChangeConfiguration).toHaveBeenCalledOnce();
        expect(mockContext.subscriptions).toHaveLength(3);
    });

    describe('onDidChangeActiveTextEditor', () => {
        it('should call updateDecorations when active editor changes', () => {
            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeActiveTextEditorCallback).not.toBeNull();
            if (onDidChangeActiveTextEditorCallback) {
                onDidChangeActiveTextEditorCallback(mockEditor as vscode.TextEditor);
            }

            expect(updateDecorations).toHaveBeenCalledWith(mockEditor);
            expect(updateDecorations).toHaveBeenCalledOnce();
        });

        it('should handle undefined editor', () => {
            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeActiveTextEditorCallback).not.toBeNull();
            if (onDidChangeActiveTextEditorCallback) {
                onDidChangeActiveTextEditorCallback(undefined);
            }

            expect(updateDecorations).toHaveBeenCalledWith(undefined);
        });
    });

    describe('onDidChangeTextDocument', () => {
        it('should call updateDecorations when active editor document changes', () => {
            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeTextDocumentCallback).not.toBeNull();
            if (onDidChangeTextDocumentCallback) {
                onDidChangeTextDocumentCallback(mockTextDocumentChangeEvent as vscode.TextDocumentChangeEvent);
            }

            expect(updateDecorations).toHaveBeenCalledWith(mockEditor);
            expect(updateDecorations).toHaveBeenCalledOnce();
        });

        it('should not call updateDecorations when document is not from active editor', () => {
            const differentDocument: Partial<vscode.TextDocument> = {
                uri: { fsPath: '/test/other.ts' } as vscode.Uri,
            };

            const differentEvent: Partial<vscode.TextDocumentChangeEvent> = {
                document: differentDocument as vscode.TextDocument,
            };

            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeTextDocumentCallback).not.toBeNull();
            if (onDidChangeTextDocumentCallback) {
                onDidChangeTextDocumentCallback(differentEvent as vscode.TextDocumentChangeEvent);
            }

            expect(updateDecorations).not.toHaveBeenCalled();
        });

        it('should not call updateDecorations when there is no active editor', () => {
            Object.defineProperty(vscode.window, 'activeTextEditor', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeTextDocumentCallback).not.toBeNull();
            if (onDidChangeTextDocumentCallback) {
                onDidChangeTextDocumentCallback(mockTextDocumentChangeEvent as vscode.TextDocumentChangeEvent);
            }

            expect(updateDecorations).not.toHaveBeenCalled();
        });
    });

    describe('onDidChangeConfiguration', () => {
        it('should recreate decoration and update all editors when opacity config changes', () => {
            vi.mocked(mockConfigChangeEvent.affectsConfiguration!).mockReturnValue(true);

            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeConfigurationCallback).not.toBeNull();
            if (onDidChangeConfigurationCallback) {
                onDidChangeConfigurationCallback(mockConfigChangeEvent as vscode.ConfigurationChangeEvent);
            }

            expect(mockConfigChangeEvent.affectsConfiguration).toHaveBeenCalledWith('unobtrusive-logs.opacity');
            expect(recreateDecoration).toHaveBeenCalledOnce();
            expect(updateAllVisibleEditors).toHaveBeenCalledOnce();
        });

        it('should not recreate decoration when other config changes', () => {
            vi.mocked(mockConfigChangeEvent.affectsConfiguration!).mockReturnValue(false);

            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeConfigurationCallback).not.toBeNull();
            if (onDidChangeConfigurationCallback) {
                onDidChangeConfigurationCallback(mockConfigChangeEvent as vscode.ConfigurationChangeEvent);
            }

            expect(mockConfigChangeEvent.affectsConfiguration).toHaveBeenCalledWith('unobtrusive-logs.opacity');
            expect(recreateDecoration).not.toHaveBeenCalled();
            expect(updateAllVisibleEditors).not.toHaveBeenCalled();
        });

        it('should check the correct configuration key', () => {
            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(onDidChangeConfigurationCallback).not.toBeNull();
            if (onDidChangeConfigurationCallback) {
                onDidChangeConfigurationCallback(mockConfigChangeEvent as vscode.ConfigurationChangeEvent);
            }

            expect(mockConfigChangeEvent.affectsConfiguration).toHaveBeenCalledWith('unobtrusive-logs.opacity');
        });
    });

    describe('subscriptions management', () => {
        it('should add all disposables to context subscriptions', () => {
            const disposables: vscode.Disposable[] = [];

            vi.mocked(vscode.window.onDidChangeActiveTextEditor).mockImplementation(() => {
                const disposable = { dispose: vi.fn() };
                disposables.push(disposable);
                return disposable;
            });

            vi.mocked(vscode.workspace.onDidChangeTextDocument).mockImplementation(() => {
                const disposable = { dispose: vi.fn() };
                disposables.push(disposable);
                return disposable;
            });

            vi.mocked(vscode.workspace.onDidChangeConfiguration).mockImplementation(() => {
                const disposable = { dispose: vi.fn() };
                disposables.push(disposable);
                return disposable;
            });

            registerEventListeners(mockContext as vscode.ExtensionContext);

            expect(mockContext.subscriptions).toHaveLength(3);
            expect(mockContext.subscriptions).toEqual(disposables);
        });
    });
});
