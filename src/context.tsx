import { createContext, useContext } from "react";

export type TableOverlayInterface = {
  rect?: paper.Path.Rectangle | undefined;
  setRect: (r: paper.Path.Rectangle | undefined) => void;
  handles?: paper.Path.Rectangle[] | undefined;
  setHandles: (h: paper.Path.Rectangle[] | undefined) => void;
  canvas?: HTMLCanvasElement;
  setCanvas?: (c: HTMLCanvasElement) => void;
  currentTool: string;
  setCurrentTool: (s: string) => void;
  group: paper.Group | undefined;
  setGroup: (g: paper.Group | undefined) => void;
  showDropdown?: boolean;
  setShowDropdown: (b: boolean) => void;
};

export const TableOverlayContext = createContext<TableOverlayInterface>({
  handles: undefined,
  setRect: () => {},
  setHandles: () => {},
  currentTool: "",
  setCurrentTool: () => {},
  group: undefined,
  setGroup: () => {},
  setShowDropdown: () => {}
});

export const useTableOverlayContext = () => useContext(TableOverlayContext);

export type SelectionInterface = {
  prev: paper.Point[];
  next: paper.Point[];
};
