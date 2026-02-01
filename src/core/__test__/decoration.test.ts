import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as vscode from 'vscode';
import { createDecoration, disposeDecoration, recreateDecoration, logDecoration } from '../decoration';
import * as configManager from '../../config/configManager';
import * as converter from '../../utils/converter';

// Mock dependencies
vi.mock('vscode', () => ({
    window: {
        createTextEditorDecorationType: vi.fn(),
    },
}));

vi.mock('../../config/configManager');
vi.mock('../../utils/converter');

describe('Decoration Manager Tests', () => {
    let mockDecoration: vscode.TextEditorDecorationType;
    let mockDispose: ReturnType<typeof vi.fn>;
    let getOpacityFromConfigMock: ReturnType<typeof vi.fn>;
    let getColorFromConfigMock: ReturnType<typeof vi.fn>;
    let convertOpacityToHexMock: ReturnType<typeof vi.fn>;
    let createTextEditorDecorationTypeMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Create a mock dispose function
        mockDispose = vi.fn();

        // Create a mock decoration object
        mockDecoration = {
            key: 'mock-decoration-key',
            dispose: mockDispose,
        } as vscode.TextEditorDecorationType;

        // Setup mocks with proper typing
        getOpacityFromConfigMock = vi.mocked(configManager.getOpacityFromConfig);
        getColorFromConfigMock = vi.mocked(configManager.getColorFromConfig);
        convertOpacityToHexMock = vi.mocked(converter.convertOpacityToHex);
        createTextEditorDecorationTypeMock = vi.mocked(vscode.window.createTextEditorDecorationType);

        // Setup default mock return value
        createTextEditorDecorationTypeMock.mockReturnValue(mockDecoration);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('createDecoration', () => {
        it('should create decoration with opacity styling when opacity is less than 100', () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            expect(getOpacityFromConfigMock).toHaveBeenCalledTimes(1);
            expect(convertOpacityToHexMock).toHaveBeenCalledWith(50);
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledWith({
                color: '#80808080',
                fontStyle: 'italic',
            });
        });

        it('should create empty decoration when opacity is 100% and color selected', () => {
            getOpacityFromConfigMock.mockReturnValue(100);
            getColorFromConfigMock.mockReturnValue('#808080');

            createDecoration();

            expect(getOpacityFromConfigMock).toHaveBeenCalledTimes(1);
            expect(getColorFromConfigMock).toHaveBeenCalledTimes(1);
            expect(convertOpacityToHexMock).not.toHaveBeenCalled();
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledWith({});
        });

        it('should create decoration with correct alpha hex for minimum opacity (0)', () => {
            getOpacityFromConfigMock.mockReturnValue(0);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('00');

            createDecoration();

            expect(convertOpacityToHexMock).toHaveBeenCalledWith(0);
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledWith({
                color: '#80808000',
                fontStyle: 'italic',
            });
        });

        it('should create decoration with correct alpha hex for mid-range opacity', () => {
            getOpacityFromConfigMock.mockReturnValue(75);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('BF');

            createDecoration();

            expect(convertOpacityToHexMock).toHaveBeenCalledWith(75);
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledWith({
                color: '#808080BF',
                fontStyle: 'italic',
            });
        });

        it('should use gray color (#808080) for log decoration', () => {
            getOpacityFromConfigMock.mockReturnValue(60);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('99');

            createDecoration();

            const calls = createTextEditorDecorationTypeMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0]?.[0] as { color?: string } | undefined;
            expect(callArgs?.color).toMatch(/^#808080/);
        });

        it('should set italic font style for non-100% opacity', () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            const calls = createTextEditorDecorationTypeMock.mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const callArgs = calls[0]?.[0] as { fontStyle?: string } | undefined;
            expect(callArgs?.fontStyle).toBe('italic');
        });

        it('should update the global logDecoration variable', () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            expect(logDecoration).toBe(mockDecoration);
        });
    });

    describe('disposeDecoration', () => {
        it('should dispose existing decoration', () => {
            // First create a decoration
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            // Then dispose it
            disposeDecoration();

            expect(mockDispose).toHaveBeenCalledTimes(1);
        });

        it('should handle dispose when no decoration exists', () => {
            expect(() => disposeDecoration()).not.toThrow();
        });

        it('should not throw error if dispose is called multiple times', () => {
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            expect(() => {
                disposeDecoration();
                disposeDecoration();
                disposeDecoration();
            }).not.toThrow();
        });
    });

    describe('recreateDecoration', () => {
        it('should dispose old decoration and create new one', () => {
            // Create initial decoration
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');

            createDecoration();

            const firstDispose = mockDispose;

            // Create a new mock for the recreated decoration
            const newMockDispose = vi.fn();
            const newMockDecoration = {
                key: 'new-mock-decoration-key',
                dispose: newMockDispose,
            } as vscode.TextEditorDecorationType;
            createTextEditorDecorationTypeMock.mockReturnValue(newMockDecoration);

            // Change opacity
            getOpacityFromConfigMock.mockReturnValue(75);
            getColorFromConfigMock.mockReturnValue('#FFFFFF');
            convertOpacityToHexMock.mockReturnValue('BF');

            recreateDecoration();

            expect(firstDispose).toHaveBeenCalledTimes(1);
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledTimes(2);
            expect(getOpacityFromConfigMock).toHaveBeenCalledTimes(2);
        });

        it('should create decoration with updated opacity settings', () => {
            // Initial creation with 50% opacity
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');
            createDecoration();

            // Recreate with 100% opacity
            getOpacityFromConfigMock.mockReturnValue(100);
            recreateDecoration();

            // The second call should create empty decoration
            expect(createTextEditorDecorationTypeMock).toHaveBeenLastCalledWith({});
        });

        it('should handle recreation from opacity to 100%', () => {
            getOpacityFromConfigMock.mockReturnValue(60);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('99');
            createDecoration();

            getOpacityFromConfigMock.mockReturnValue(100);
            getColorFromConfigMock.mockReturnValue('#FFFFFF');
            recreateDecoration();

            expect(mockDispose).toHaveBeenCalledTimes(1);
            expect(createTextEditorDecorationTypeMock).toHaveBeenLastCalledWith({});
        });

        it('should handle recreation from 100% to opacity', () => {
            getOpacityFromConfigMock.mockReturnValue(100);
            getColorFromConfigMock.mockReturnValue('#FFFFFF');
            createDecoration();

            getOpacityFromConfigMock.mockReturnValue(60);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('99');
            recreateDecoration();

            expect(mockDispose).toHaveBeenCalledTimes(1);
            expect(createTextEditorDecorationTypeMock).toHaveBeenLastCalledWith({
                color: '#80808099',
                fontStyle: 'italic',
            });
        });

        it('should work correctly when called multiple times', () => {
            const opacities = [50, 75, 25, 100, 60];
            const hexValues = ['80', 'BF', '40', '', '99'];

            opacities.forEach((opacity, index) => {
                getOpacityFromConfigMock.mockReturnValue(opacity);
                getColorFromConfigMock.mockReturnValue('#808080');
                convertOpacityToHexMock.mockReturnValue(hexValues[index]);

                if (index === 0) {
                    createDecoration();
                } else {
                    recreateDecoration();
                }
            });

            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledTimes(5);
            expect(mockDispose).toHaveBeenCalledTimes(4); // All but the first
        });
    });

    describe('Integration scenarios', () => {
        it('should properly handle the full lifecycle: create -> recreate -> dispose', () => {
            // Create
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');
            createDecoration();

            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledTimes(1);

            // Recreate
            getOpacityFromConfigMock.mockReturnValue(75);
            getColorFromConfigMock.mockReturnValue('#FFFFFF');
            convertOpacityToHexMock.mockReturnValue('BF');
            recreateDecoration();

            expect(mockDispose).toHaveBeenCalledTimes(1);
            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledTimes(2);

            // Dispose
            disposeDecoration();

            expect(mockDispose).toHaveBeenCalledTimes(2);
        });

        it('should maintain correct decoration state through multiple changes', () => {
            // Start with 50%
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');
            createDecoration();

            // Change to 100%
            getOpacityFromConfigMock.mockReturnValue(100);
            getColorFromConfigMock.mockReturnValue('#FFFFFF');
            recreateDecoration();

            // Change back to 50%
            getOpacityFromConfigMock.mockReturnValue(50);
            getColorFromConfigMock.mockReturnValue('#808080');
            convertOpacityToHexMock.mockReturnValue('80');
            recreateDecoration();

            expect(createTextEditorDecorationTypeMock).toHaveBeenCalledTimes(3);
            expect(createTextEditorDecorationTypeMock).toHaveBeenNthCalledWith(2, {});
            expect(createTextEditorDecorationTypeMock).toHaveBeenNthCalledWith(3, {
                color: '#80808080',
                fontStyle: 'italic',
            });
        });
    });
});
