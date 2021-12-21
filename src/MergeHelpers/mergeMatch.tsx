import Paper from "paper";
import { createLine, removeDuplicates } from "../helpers";
import { SelectionInterface } from "../context";

export const createNewLine = (
  p1: paper.Point | number[],
  p2: paper.Point | number[],
  child?: paper.PathItem,
  canvas?: HTMLCanvasElement,
  group?: paper.Group
) => {
  if (child) {
    child.visible = false;
    child.data.name = "mergeLine";
    child.data.type = "original";
  }

  if (canvas) {
    let line = createLine(p1, p2, canvas, "blue");
    line.data.name = "mergeLine";
    line.data.type = "split";
    group?.addChild(line);
  }
};

type DuplicateType = { [key: number]: number };

export const findMatchingPoints = (
  selection: SelectionInterface,
  selectedRectangle: paper.Path.Rectangle,
  highlight: paper.Path | paper.Item,
  allPoints: paper.Point[],
  matches: paper.Point[],
  arr: paper.Point[]
) => {
  //remove duplicate points
  selection.next = removeDuplicates(arr);

  if (
    selectedRectangle &&
    highlight?.data.name === "temp" &&
    selectedRectangle.segments.length > 0
  ) {
    let test: paper.Point[] = selection.prev;
    //combine all the points
    allPoints = selection.next.concat(test);
    //find the matching instersections in both rectangles

    let dupes = allPoints.reduce((a: DuplicateType, e: paper.Point) => {
      let index = (e as unknown) as number;
      a[index] = ++a[index] || 0;
      return a;
    }, {});

    let findDuplicates = allPoints.filter((e) => {
      let index = (e as unknown) as number;
      return dupes[index];
    });

    //remove duplicates to get final set of points
    matches = removeDuplicates(findDuplicates).sort(
      (a: paper.Point, b: paper.Point) => {
        return a.y - b.y;
      }
    );
  }
  return matches;
};

export const checkMatches = (
  group: paper.Group,
  canvas: HTMLCanvasElement,
  matches: paper.Point[],
  selection: SelectionInterface,
  allPoints: paper.Point[]
) => {
  let p1 = new Paper.Point(matches[0]).round();
  let p2 = new Paper.Point(matches[1]).round();
  if (group) {
    for (let i = 0; i < group.children.length; i++) {
      let child = group.children[i] as paper.Path;
      if (
        child.hitTest(p1) &&
        child.hitTest(p2) &&
        child.segments.length === 2 &&
        child.data.name !== "horizontal"
      ) {
        let cp1 = child.firstSegment.point.round();
        let cp2 = child.lastSegment.point.round();
        //find and replace the line with matching intersection points and add new lines
        if (p1.equals(cp1)) {
          createNewLine(p2, cp2, child, canvas, group);
        } else if (p1.equals(cp2)) {
          createNewLine(p2, cp1, child, canvas, group);
        } else if (p2.equals(cp1)) {
          createNewLine(p1, cp2, child, canvas, group);
        } else if (p2.equals(cp2)) {
          createNewLine(p1, cp1, child, canvas, group);
        } else {
          createNewLine(p2, cp2, child, canvas, group);
          createNewLine(p1, cp1, undefined, canvas, group);
        }
      }
    }
  }

  selection.next = [];
  allPoints = [];
  matches = [];

  return { selection, allPoints, matches };
};
