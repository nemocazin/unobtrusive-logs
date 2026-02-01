import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { updateDecorations, updateAllVisibleEditors, initializeDecorations } from '../decorationUpdater';
import { logDecoration } from '../decoration';
import { findLogStatements } from '../../detectors/logDetector';

// Mock the dependencies
vi.mock('../decoration', () => ({
    logDecoration: {} as vscode.TextEditorDecorationType,
}));

vi.mock('../../detectors/logDetector', () => ({
    findLogStatements: vi.fn(),
}));

vi.mock('vscode', () => ({
    window: {
        activeTextEditor: undefined,
        visibleTextEditors: [],
    },
    Range: class Range {
        startLine: number;
        startCharacter: number;
        endLine: number;
        endCharacter: number;

        constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number) {
            this.startLine = startLine;
            this.startCharacter = startCharacter;
            this.endLine = endLine;
            this.endCharacter = endCharacter;
        }
    },
}));

describe('decorationUpdater', () => {
    const mockSetDecorations = vi.fn();
    const mockEditor = {
        setDecorations: mockSetDecorations,
    } as unknown as vscode.TextEditor;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('updateDecorations', () => {
        it('should return early when editor is undefined', () => {
            updateDecorations(undefined);

            expect(vi.mocked(findLogStatements)).not.toHaveBeenCalled();
            expect(mockSetDecorations).not.toHaveBeenCalled();
        });

        it('should update decorations when editor is provided', () => {
            const mockRanges: vscode.DecorationOptions[] = [
                { range: new vscode.Range(0, 0, 0, 10) },
                { range: new vscode.Range(1, 0, 1, 15) },
            ];

            vi.mocked(findLogStatements).mockReturnValue(mockRanges);

            updateDecorations(mockEditor);

            expect(findLogStatements).toHaveBeenCalledWith(mockEditor);
            expect(findLogStatements).toHaveBeenCalledTimes(1);
            expect(mockSetDecorations).toHaveBeenCalledWith(logDecoration, mockRanges);
            expect(mockSetDecorations).toHaveBeenCalledTimes(1);
        });

        it('should handle empty log ranges', () => {
            const emptyRanges: vscode.DecorationOptions[] = [];

            vi.mocked(findLogStatements).mockReturnValue(emptyRanges);

            updateDecorations(mockEditor);

            expect(findLogStatements).toHaveBeenCalledWith(mockEditor);
            expect(mockSetDecorations).toHaveBeenCalledWith(logDecoration, emptyRanges);
        });
    });

    describe('updateAllVisibleEditors', () => {
        it('should update decorations for all visible editors', () => {
            const mockSetDecorations1 = vi.fn();
            const mockSetDecorations2 = vi.fn();

            const mockEditor1 = {
                setDecorations: mockSetDecorations1,
            } as unknown as vscode.TextEditor;

            const mockEditor2 = {
                setDecorations: mockSetDecorations2,
            } as unknown as vscode.TextEditor;

            const mockRanges: vscode.DecorationOptions[] = [{ range: new vscode.Range(0, 0, 0, 10) }];

            vi.mocked(findLogStatements).mockReturnValue(mockRanges);
            vi.mocked(vscode.window).visibleTextEditors = [mockEditor1, mockEditor2];

            updateAllVisibleEditors();

            expect(findLogStatements).toHaveBeenCalledTimes(2);
            expect(findLogStatements).toHaveBeenCalledWith(mockEditor1);
            expect(findLogStatements).toHaveBeenCalledWith(mockEditor2);
            expect(mockSetDecorations1).toHaveBeenCalledWith(logDecoration, mockRanges);
            expect(mockSetDecorations2).toHaveBeenCalledWith(logDecoration, mockRanges);
        });

        it('should handle empty visible editors array', () => {
            vi.mocked(vscode.window).visibleTextEditors = [];

            updateAllVisibleEditors();

            expect(findLogStatements).not.toHaveBeenCalled();
        });
    });

    describe('initializeDecorations', () => {
        it('should update decorations for active editor when it exists', () => {
            const mockSetDecorationsActive = vi.fn();

            const mockActiveEditor = {
                setDecorations: mockSetDecorationsActive,
            } as unknown as vscode.TextEditor;

            const mockRanges: vscode.DecorationOptions[] = [{ range: new vscode.Range(0, 0, 0, 10) }];

            vi.mocked(findLogStatements).mockReturnValue(mockRanges);
            vi.mocked(vscode.window).activeTextEditor = mockActiveEditor;

            initializeDecorations();

            expect(findLogStatements).toHaveBeenCalledWith(mockActiveEditor);
            expect(mockSetDecorationsActive).toHaveBeenCalledWith(logDecoration, mockRanges);
        });

        it('should do nothing when no active editor exists', () => {
            vi.mocked(vscode.window).activeTextEditor = undefined;

            initializeDecorations();

            expect(findLogStatements).not.toHaveBeenCalled();
        });
    });
});
