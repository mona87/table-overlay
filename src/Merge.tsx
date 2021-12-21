import Paper from "paper";
import { useTableOverlayContext, SelectionInterface } from "./context";
import {
  createRectangle,
  createHighlightRectangle,
  removeHandles
} from "./helpers";
import {
  findIntersections,
  getIntersections
} from "./MergeHelpers/mergeIntersections";
import { checkMatches, findMatchingPoints } from "./MergeHelpers/mergeMatch";

import { useEffect, useCallback, useState } from "react";

const Merge = () => {
  let {
    rect,
    currentTool,
    setCurrentTool,
    canvas,
    group,
    setGroup,
    handles,
    setHandles,
    setShowDropdown
  } = useTableOverlayContext();

  const [tool] = useState<paper.Tool>(new Paper.Tool());
  let currentMouse: paper.Point | undefined;
  let selectedRectangle: paper.Path.Rectangle | undefined;
  let selection: SelectionInterface = { prev: [], next: [] };
  let tempRect: paper.Path.Rectangle | undefined = undefined;
  let xCoordinate: paper.Point | number[];
  let yCoordinate: paper.Point | number[];
  let highlight: paper.Path | paper.Item | undefined = undefined;
  let arr: number[] | undefined;
  let allPoints: number[] = [];
  let matches: number[];

  const setTool = () => {
    setCurrentTool("merge");
    setShowDropdown(false);
  };

  const onShiftDown = (event: paper.KeyEvent) => {
    if (currentMouse && rect?.contains(currentMouse)) {
      if (event.key === "shift" && selectedRectangle) {
        //highlight second rectangle
        tempRect = createRectangle(xCoordinate, yCoordinate, "#9d1d96", "blue");
        if (tempRect && tempRect.fillColor) tempRect.fillColor.alpha = 0.4;
        tempRect.data.name = "temp";
        if (selection.next) {
          selection.prev = selection.next;
        } else {
          selection.prev = [];
        }

        if (group) {
          group.addChild(tempRect);
          setGroup(group);
          Paper.project.activeLayer.addChild(group);
        }
      }
    }
  };

  const onShiftUp = (event: paper.KeyEvent) => {
    if (event.key === "shift") {
      //remove highlighted rectangles
      if (selectedRectangle) {
        selectedRectangle.remove();
        selectedRectangle = undefined;
      }
      if (tempRect) tempRect.remove();
    }
  };

  const onHighlight = (event: paper.MouseEvent) => {
    currentMouse = event.point;

    if (selectedRectangle) {
      selectedRectangle.remove();
      selectedRectangle = undefined;
    }

    if (rect?.contains(event.point) && canvas && group) {
      //create highlight rectangle
      let {
        leftPoint,
        rightPoint,
        topPoint,
        bottomPoint
      } = createHighlightRectangle(rect, event, currentMouse);
      //get interstections
      let horizontalPoints: number[] = getIntersections(
        event,
        leftPoint,
        rightPoint,
        event.point.x,
        0,
        "horizontal",
        canvas,
        group
      );

      let verticalPoints: number[] = getIntersections(
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

      selectedRectangle = createRectangle(
        xCoordinate,
        yCoordinate,
        "#9d1d96",
        "blue"
      );
      if (selectedRectangle && selectedRectangle.fillColor)
        selectedRectangle.fillColor.alpha = 0.2;
    }

    let values = findIntersections(group, highlight, selectedRectangle, arr);
    arr = values?.arr;
    highlight = values?.highlight;

    //check for matches

    matches = findMatchingPoints(
      selection,
      selectedRectangle,
      highlight,
      allPoints,
      matches,
      arr
    );
    if (matches?.length === 2 && group && canvas) {
      let values = checkMatches(group, canvas, matches, selection, allPoints);
      selection = values.selection;
      allPoints = values.allPoints;
      matches = values.matches;
    }
  };

  const onMerge = () => {
    removeHandles(handles);
    if (setHandles) setHandles(undefined);
    Paper.view.onMouseDown = (e: paper.MouseEvent) => onHighlight(e);
    tool.onKeyDown = (e: paper.KeyEvent) => onShiftDown(e);
    tool.onKeyUp = (e: paper.KeyEvent) => onShiftUp(e);
  };

  useEffect(() => {
    if (currentTool === "merge") {
      onMerge();
    }
  }, [currentTool]);

  return <button onClick={(e) => setTool()}>Merge</button>;
};

export default Merge;
