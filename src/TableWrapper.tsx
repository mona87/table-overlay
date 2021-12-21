import Paper from "paper";
import Canvas from "./Canvas";
import { useEffect, useState } from "react";
import Horizontal from "./Horizontal";
import Vertical from "./Vertical";
import Overlay from "./Overlay";
import Delete from "./Delete";
import Merge from "./Merge";
import Label from "./Label";
import { TableOverlayContext } from "./context";

const TableWrapper = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [currentTool, setCurrentTool] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  let [handles, setHandles] = useState<paper.Path.Rectangle[] | undefined>();
  let [rect, setRect] = useState<paper.Path.Rectangle>();
  let [group, setGroup] = useState<paper.Group>();

  useEffect(() => {
    setGroup(new Paper.Group());
  }, []);

  return (
    <>
      <TableOverlayContext.Provider
        value={{
          rect,
          handles,
          setHandles,
          setRect,
          canvas,
          setCanvas,
          currentTool,
          setCurrentTool,
          group,
          setGroup,
          showDropdown,
          setShowDropdown
        }}
      >
        <Canvas />
        <section>
          <Overlay />
          <Horizontal />
          <Vertical />
          <Merge />
          <Label />
          <Delete />
        </section>
      </TableOverlayContext.Provider>
    </>
  );
};

export default TableWrapper;
