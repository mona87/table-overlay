import Paper from "paper";
import { useTableOverlayContext } from "./context";

const Delete = () => {
  const {
    setRect,
    setHandles,
    setCurrentTool,
    setGroup,
    setShowDropdown
  } = useTableOverlayContext();

  const onReset = () => {
    setRect(undefined);
    setHandles(undefined);
    setCurrentTool("");
    setGroup(new Paper.Group());
    setShowDropdown(false);
    Paper.view.onMouseDown = null;
    Paper.project.activeLayer.removeChildren();
  };

  return <button onClick={(e) => onReset()}>Delete</button>;
};

export default Delete;
