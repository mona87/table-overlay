import Paper from "paper";
import { useTableOverlayContext } from "./context";
import { createLine, removeHandles } from "./helpers";
import { useEffect } from "react";

const Horizontal = () => {
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
    setCurrentTool("horizontal");
    setShowDropdown(false);
  };

  const addHorizontal = () => {
    removeHandles(handles);
    if (setHandles) setHandles(undefined);

    Paper.view.onMouseDown = (event: paper.MouseEvent) => {
      if (
        currentTool === "horizontal" &&
        canvas &&
        rect &&
        rect.contains(event.point) &&
        Paper.project.activeLayer.getItems({ name: "handle" }).length === 0
      ) {
        let from: number[] = [rect.segments[0].point.x, event.point.y];
        let to: number[] = [rect.segments[2].point.x, event.point.y];
        createLine(from, to, canvas, "blue");
        let line = createLine(from, to, canvas, "blue");
        line.data.name = "horizontal";

        if (group) {
          group.addChild(line);
          setGroup(group);
          Paper.project.activeLayer.addChild(group);
        }
      }
    };
  };

  useEffect(() => {
    if (currentTool === "horizontal") {
      addHorizontal();
    }
  });

  return <button onClick={(e) => setTool()}>Horizontal</button>;
};

export default Horizontal;
