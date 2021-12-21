import { createLine } from "../helpers";

export const findIntersections = (
  group: paper.Group | undefined,
  highlight: paper.Path | paper.Item | undefined,
  selectedRectangle: paper.Path.Rectangle,
  arr: paper.Point[] | undefined
) => {
  if (group) {
    let groupChildren: paper.PathItem[] | paper.Item[] = group.children;
    highlight = groupChildren[group.children.length - 1];
    let intersections: paper.CurveLocation[][] | undefined = [];

    for (let i = 0; i < groupChildren.length; i++) {
      let child = groupChildren[i] as paper.Path;
      let noInstersections = selectedRectangle?.getIntersections(child);

      if (noInstersections && noInstersections.length < 3 && noInstersections) {
        //only add curvelocations with lines (no rectangle)
        let sel = selectedRectangle.getIntersections(child);
        intersections.push(sel);
      }
    }
    let intersectionsFlat = intersections.flat();

    arr = [];
    //get points from curvelocations
    if (intersectionsFlat) {
      for (let i = 0; i < intersectionsFlat.length; i++) {
        arr.push(intersectionsFlat[i].point.round());
      }
    }
    return { arr, highlight };
  }
};

export const getIntersections = (
  event: paper.MouseEvent,
  from: paper.Point | number[],
  to: any | paper.Point | number[],
  eventPoint: number,
  index: number,
  type: string,
  canvas: HTMLCanvasElement,
  group: paper.Group
) => {
  let intersectionPoints: any = [];
  //need to create a temporary line to find intersections
  let fullLine = createLine(from, to, canvas, "red");
  group?.children.forEach((child: any) => {
    if (fullLine.intersects(child) && child.visible) {
      intersectionPoints.push(fullLine.getIntersections(child));
    }
  });
  fullLine.remove();
  //create a line between segments
  let endPointVal = to[index];
  let startPointVal = index;
  let endPoint = to;
  let startPoint = from;
  let intersectionPoint: number;

  for (let i = 0; i < intersectionPoints.length; i++) {
    intersectionPoint =
      type === "horizontal"
        ? intersectionPoints[i][0].point.x
        : intersectionPoints[i][0].point.y;

    if (intersectionPoint < eventPoint) {
      //compare closest points to mouse click
      let val1 = eventPoint - startPointVal;
      let val2 = eventPoint - intersectionPoint;

      if (val2 < val1) {
        startPointVal = intersectionPoint;
        startPoint = [
          intersectionPoints[i][0].point.x,
          intersectionPoints[i][0].point.y
        ];
      }
    } else if (intersectionPoint > eventPoint) {
      //compare closest points to mouse click
      let val1 = endPointVal - eventPoint;
      let val2 = intersectionPoint - eventPoint;
      if (val2 < val1) {
        endPointVal = intersectionPoint;
        endPoint = [
          intersectionPoints[i][0].point.x,
          intersectionPoints[i][0].point.y
        ];
      }
    }
  }
  return [startPoint, endPoint];
};
