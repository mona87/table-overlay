import Paper from "paper";

export const createLine = (
  from: paper.Point | number[],
  to: paper.Point | number[],
  canvas: HTMLCanvasElement,
  color: string
) => {
  return new Paper.Path.Line({
    from,
    to,
    strokeColor: color,
    fullySelected: false,
    strokeWidth: 1,
    onMouseDown: function () {},
    onMouseEnter: () => {
      canvas?.style.setProperty("cursor", "pointer");
    },
    onMouseLeave: () => {
      canvas?.style.setProperty("cursor", "default");
    }
  });
};

export const createRectangle = (
  from: paper.Point | number[],
  to: paper.Point | number[],
  fillColor: string,
  strokeColor: string,
  alpha?: number
) => {
  return new Paper.Path.Rectangle({
    from,
    to,
    strokeColor: strokeColor,
    fillColor: fillColor,
    strokeWidth: 1,
    alpha: alpha || 0.5,
    fullySelected: false,
    onMouseDown: null
  });
};

export const createHighlightRectangle = (
  rect: paper.Path,
  event: paper.MouseEvent,
  currentMouse: paper.Point
) => {
  let point1x = rect.segments[0].point.x;
  let point2x = rect.segments[2].point.x;
  let point1y = rect.segments[1].point.y;
  let point2y = rect.segments[3].point.y;

  return {
    leftPoint: [Math.round(point1x), Math.round(event.point.y)],
    rightPoint: [Math.round(point2x), Math.round(event.point.y)],
    topPoint: [Math.round(currentMouse.x), Math.round(point1y)],
    bottomPoint: [Math.round(currentMouse.x), Math.round(point2y)]
  };
};

export const removeDuplicates = (arr: number[]) => {
  let tmp: string[] = [];
  //remove duplicate points
  let noDuplicates = arr.filter((v) => {
    if (tmp.indexOf(v.toString()) < 0) {
      tmp.push(v.toString());
      return v;
    }
    return false;
  });
  return noDuplicates;
};

export const removeHandles = (handles: paper.Path.Rectangle[] | undefined) => {
  if (handles)
    handles.forEach((segment: paper.Path.Rectangle) => {
      segment.remove();
    });
};
