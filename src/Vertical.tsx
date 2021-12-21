import Paper from "paper";
import { useTableOverlayContext } from "./context";
import { createLine, removeHandles } from "./helpers";
import { useEffect } from "react";

const Vertical = () => {
  const {
    rect,
    handles,
    canvas,
    setHandles,
    currentTool,
    setCurrentTool,
    group,
    setGroup,
    setShowDropdown
  } = useTableOverlayContext();

  const setTool = () => {
    setCurrentTool("vertical");
    setShowDropdown(false);
  };

  const addVertical = () => {
    removeHandles(handles);
    if (setHandles) setHandles(undefined);

    Paper.view.onMouseDown = (event: paper.MouseEvent) => {
      if (
        currentTool === "vertical" &&
        canvas &&
        rect &&
        rect.contains(event.point) &&
        Paper.project.activeLayer.getItems({ name: "handle" }).length === 0
      ) {
        let from = [event.point.x, rect.segments[1].point.y];
        let to = [event.point.x, rect.segments[3].point.y];
        let line = createLine(from, to, canvas, "blue");

        if (group) {
          group.addChild(line);
          setGroup(group);
          Paper.project.activeLayer.addChild(group);
        }
      }
    };
  };

  useEffect(() => {
    if (currentTool === "vertical") {
      addVertical();
    }
  });

  return <button onClick={(e) => setTool()}>Vertical</button>;
};

export default Vertical;
