import {
  findMatchingDiagramId,
  getAllDiagramsFromStorage,
  SavedDiagram,
  updateDiagram,
} from "@/lib/storage.utils";
import {
  getMermaidCodeFromUrl,
  updateUrlWithMermaidCode,
} from "@/lib/url.utils";
import debounce from "lodash.debounce";
import { create } from "zustand";

// Added for panel settings
interface UseResizablePanelsOptions {
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  isVertical?: boolean;
}

const initialMermaidCode = `graph TD
  A[Start] --> B{Is it Friday?};
  B -- Yes --> C[Party!];
  B -- No --> D[Code];
  D --> E[Coffee];
  E --> D;
  C --> F[Sleep];
`;

interface MermaidState {
  mermaidCode: string;
  debouncedCode: string;
  hasUnsavedChanges: boolean;
  currentDiagramId?: string;
  openLoadDialog: boolean;
  alertMessage: string | null;
  setMermaidCode: (code: string) => void;
  setDebouncedCode: (code: string) => void;
  setHasUnsavedChanges: (changed: boolean) => void;
  setCurrentDiagramId: (id: string | undefined) => void;
  setOpenLoadDialog: (open: boolean) => void;
  setAlertMessage: (message: string | null) => void;
  handleEditorChange: (value: string | undefined) => void;
  handleLoadDiagram: (diagram: SavedDiagram) => void;
  handleNewDiagram: () => void;
  handleSaveDiagram: (diagramId: string | undefined) => void;
  handleCloseLoadDialog: () => void;
  handleAlertClose: () => void;
  initialize: () => void;

  // Resizable Panel State & Actions
  panelSize: number;
  isPanelResizing: boolean;
  panelMinSize: number;
  panelMaxSize: number;
  panelIsVertical: boolean;

  initializePanelSettings: (options?: UseResizablePanelsOptions) => void;
  setPanelSize: (size: number) => void;
  startPanelResize: () => void;
  stopPanelResize: () => void;
  updatePanelSizeWithConstraints: (newPotentialSize: number) => void;
}

const useMermaidStore = create<MermaidState>((set, get) => {
  // Debounced setter for debouncedCode
  const debouncedSetDiagramCode = debounce((code: string) => {
    set({ debouncedCode: code });
  }, 300);

  return {
    mermaidCode: "",
    debouncedCode: "",
    hasUnsavedChanges: false,
    currentDiagramId: undefined,
    openLoadDialog: false,
    alertMessage: null,

    // Resizable Panel initial state
    panelSize: 50, // Default initial size
    isPanelResizing: false,
    panelMinSize: 10, // Default min size
    panelMaxSize: 90, // Default max size
    panelIsVertical: false, // Default orientation

    setMermaidCode: (code) => set({ mermaidCode: code }),
    setDebouncedCode: (code) => set({ debouncedCode: code }),
    setHasUnsavedChanges: (changed) => set({ hasUnsavedChanges: changed }),
    setCurrentDiagramId: (id) => set({ currentDiagramId: id }),
    setOpenLoadDialog: (open) => set({ openLoadDialog: open }),
    setAlertMessage: (message) => set({ alertMessage: message }),
    handleEditorChange: (value) => {
      const newCode = value || "";
      set({ mermaidCode: newCode });
      debouncedSetDiagramCode(newCode);
      const { currentDiagramId } = get();
      if (currentDiagramId) {
        const savedDiagrams = getAllDiagramsFromStorage();
        const currentSaved = savedDiagrams.find(
          (d) => d.id === currentDiagramId,
        );
        if (currentSaved && currentSaved.code !== newCode) {
          set({ hasUnsavedChanges: true });
        } else {
          set({ hasUnsavedChanges: false });
        }
      } else if (newCode !== initialMermaidCode) {
        set({ hasUnsavedChanges: true });
      }
    },
    handleLoadDiagram: (diagram) => {
      set({
        mermaidCode: diagram.code,
        debouncedCode: diagram.code,
        currentDiagramId: diagram.id,
        hasUnsavedChanges: false,
        alertMessage: `Loaded diagram: ${diagram.name}`,
      });
      updateUrlWithMermaidCode(diagram.code);
      get().handleCloseLoadDialog();
    },
    handleNewDiagram: () => {
      set({
        mermaidCode: initialMermaidCode,
        debouncedCode: initialMermaidCode,
        currentDiagramId: undefined,
        hasUnsavedChanges: false,
        alertMessage: "Created new diagram",
      });
      updateUrlWithMermaidCode(initialMermaidCode);
      get().handleCloseLoadDialog();
    },
    handleSaveDiagram: (diagramId) => {
      const { mermaidCode } = get();
      if (diagramId) {
        const updated = updateDiagram(diagramId, { code: mermaidCode });
        if (updated) {
          set({ hasUnsavedChanges: false, alertMessage: "Diagram updated" });
        }
      }
    },
    handleCloseLoadDialog: () => {
      set({ openLoadDialog: false });
      const { currentDiagramId, mermaidCode } = get();
      if (!currentDiagramId && mermaidCode === "") {
        set({
          mermaidCode: initialMermaidCode,
          debouncedCode: initialMermaidCode,
        });
        updateUrlWithMermaidCode(initialMermaidCode);
      }
    },
    handleAlertClose: () => set({ alertMessage: null }),
    initialize: () => {
      const codeFromUrl = getMermaidCodeFromUrl();
      if (codeFromUrl) {
        set({ mermaidCode: codeFromUrl, debouncedCode: codeFromUrl });
        const matchedId = findMatchingDiagramId(codeFromUrl);
        if (matchedId) {
          set({ currentDiagramId: matchedId, hasUnsavedChanges: false });
        }
        return;
      }
      const savedDiagrams = getAllDiagramsFromStorage();
      if (savedDiagrams.length > 0) {
        set({ openLoadDialog: true });
      } else {
        set({
          mermaidCode: initialMermaidCode,
          debouncedCode: initialMermaidCode,
        });
        updateUrlWithMermaidCode(initialMermaidCode);
      }
    },

    // Resizable Panel Actions
    initializePanelSettings: (options = {}) => {
      const currentSettings = {
        initialSize: get().panelSize,
        minSize: get().panelMinSize,
        maxSize: get().panelMaxSize,
        isVertical: get().panelIsVertical,
      };
      const newSettings = { ...currentSettings, ...options };
      set({
        panelSize: newSettings.initialSize,
        panelMinSize: newSettings.minSize,
        panelMaxSize: newSettings.maxSize,
        panelIsVertical: newSettings.isVertical,
        isPanelResizing: false, // Reset resizing state on initialization
      });
    },
    setPanelSize: (size) => set({ panelSize: size }),
    startPanelResize: () => set({ isPanelResizing: true }),
    stopPanelResize: () => set({ isPanelResizing: false }),
    updatePanelSizeWithConstraints: (newPotentialSize) => {
      const { panelMinSize, panelMaxSize, panelIsVertical } = get();
      let constrainedSize;
      if (panelIsVertical) {
        // For vertical panels, constraints are typically 0 to 100 (percentage of height)
        constrainedSize = Math.min(Math.max(newPotentialSize, 0), 100);
      } else {
        // For horizontal panels, use the configured min/max size
        constrainedSize = Math.min(
          Math.max(newPotentialSize, panelMinSize),
          panelMaxSize,
        );
      }
      set({ panelSize: constrainedSize });
    },
  };
});

export default useMermaidStore;
export type { MermaidState, UseResizablePanelsOptions }; // Export new type
