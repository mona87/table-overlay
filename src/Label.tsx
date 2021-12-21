import Paper from "paper";
import { useTableOverlayContext } from "./context";
import {
  createRectangle,
  createHighlightRectangle,
  removeHandles
} from "./helpers";
import { useEffect, useCallback, useState, ChangeEvent } from "react";
import { getIntersections } from "./MergeHelpers/mergeIntersections";
import "./styles.css";

const Label = () => {
  const {
    rect,
    handles,
    canvas,
    setHandles,
    currentTool,
    setCurrentTool,
    group,
    showDropdown,
    setShowDropdown
  } = useTableOverlayContext();

  type LabelInterface = {
    label: string;
    color: string;
  };

  const [selectValue, setSelectValue] = useState<LabelInterface>();
  let currentMouse: paper.Point;
  let selectedRectangle: paper.Path.Rectangle;
  let xCoordinate: paper.Point | number[];
  let yCoordinate: paper.Point | number[];
  const colorIndex = {
    default: {
      label: "Data Table (default)",
      color: "blue"
    },
    label1: {
      label: "Label 1 Red",
      color: "red"
    },
    label2: {
      label: "Label 2 Green",
      color: "green"
    },
    label3: {
      label: "Label 3 Orange",
      color: "orange"
    }
  };

  const setTool = () => {
    removeHandles(handles);
    if (setHandles) setHandles(undefined);
    setCurrentTool("label");
    setShowDropdown(true);
  };

  const checkForRectangle = (rect: paper.Path.Rectangle) => {
    if (group && rect) {
      const isMatch = group.getItems({
        bounds: rect?.bounds
      });
      return isMatch.length > 0 ? isMatch[0] : false;
    }
  };

  const highlightLabel = (event: paper.MouseEvent) => {
    currentMouse = event.point;
    if (rect && rect.contains(event.point) && group && canvas) {
      // remove last highlight rectangle if a new rectangle is selected
      if (selectedRectangle && !selectedRectangle?.data.label) {
        selectedRectangle.remove();
      }

      if (selectValue) {
        //create highlight rectangle
        let {
          leftPoint,
          rightPoint,
          topPoint,
          bottomPoint
        } = createHighlightRectangle(rect, event, currentMouse);

        let horizontalPoints = getIntersections(
          event,
          leftPoint,
          rightPoint,
          event.point.x,
          0,
          "horizontal",
          canvas,
          group
        );
        let verticalPoints = getIntersections(
          event,
          topPoint,
          bottomPoint,
          event.point.y,
          1,
          "vertical",
          canvas,
          group
        );

        xCoordinate = [horizontalPoints[0][0], verticalPoints[0][1]];
        yCoordinate = [horizontalPoints[1][0], verticalPoints[1][1]];

        let colorIndex = selectValue.color;
        selectedRectangle = createRectangle(
          xCoordinate,
          yCoordinate,
          colorIndex,
          colorIndex
        );
        if (selectedRectangle && selectedRectangle.fillColor)
          selectedRectangle.fillColor.alpha = 0.2;
        let path = checkForRectangle(selectedRectangle);

        if (!path) {
          selectedRectangle.data.label = selectValue?.label;
          selectedRectangle.data.category = "labels";
          selectedRectangle.data.color = colorIndex;
          selectedRectangle.data.points = {
            l: Math.round(xCoordinate[0]),
            t: Math.round(xCoordinate[1]),
            r: Math.round(yCoordinate[0]),
            b: Math.round(yCoordinate[1])
          };
          group.addChild(selectedRectangle);
        } else {
          selectedRectangle.remove();
        }
      }
    }
  };

  const addLabel = () => {
    Paper.view.onMouseDown = (e: paper.MouseEvent) => highlightLabel(e);
  };

  const handleDropdownChange = (e: ChangeEvent) => {
    let val: Record<string, any> = e.target.value;
    setSelectValue(colorIndex[val]);
  };

  useEffect(() => {
    if (currentTool === "label") {
      addLabel();
    }
  }, [currentTool, selectValue]);

  return (
    <>
      <button onClick={(e) => setTool()}>Label</button>
      {showDropdown && rect ? (
        <select defaultValue="default" onChange={handleDropdownChange}>
          <option value="default" disabled>
            Data Table (default)
          </option>
          <option value="label1">Label 2 Red</option>
          <option value="label2">Label 3 Green</option>
          <option value="label3">Label 4 Orange</option>
        </select>
      ) : (
        false
      )}
    </>
  );
};

export default Label;
