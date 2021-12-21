import Paper from "paper";
import { useTableOverlayContext } from "./context";

const Overlay = () => {
  let {
    rect,
    handles,
    setHandles,
    setRect,
    setCurrentTool,
    setGroup,
    setShowDropdown
  } = useTableOverlayContext();

  let dragging: boolean = false;
  let oppositePoint: paper.Point | undefined;
  let offset: number[];
  const handleRadius: number = 5;

  const createRectangle = (
    from: paper.Point | number[],
    to: paper.Point | number[]
  ) => {
    return new Paper.Path.Rectangle({
      from,
      to,
      strokeColor: "blue",
      fillColor: "lightBlue",
      strokeWidth: 1,
      alpha: 0.5,
      fullySelected: false,
      onMouseDown: null
    });
  };

  const createHandles = () => {
    if (rect) {
      handles = rect.segments.map(
        (segment: paper.Segment, index: number) =>
          new Paper.Path.Rectangle({
            from: [
              segment.point.x - handleRadius,
              segment.point.y - handleRadius
            ],
            to: [
              segment.point.x + handleRadius,
              segment.point.y + handleRadius
            ],
            fillColor: "blue",
            // We store the segment index bound to this specific handle in the custom
            // data object. This will allow us to know, when an handle is clicked,
            // which segment is concerned by the event.
            name: "handle",
            data: { segmentIndex: index },
            onMouseDown: (event: paper.MouseEvent) => {
              // ...get and store the opposite segment point.
              // We will use it later to redraw the rectangle.
              const oppositeSegmentIndex = (index + 2) % 4;

              if (rect) {
                oppositePoint = rect.segments[oppositeSegmentIndex].point;
                // Store the offset.
                let x = event.point.x - rect.segments[index].point.x;
                let y = event.point.y - rect.segments[index].point.y;

                offset = [x, y];
              }

              // Activate dragging state.
              dragging = true;
            }
          })
      );

      setHandles(handles);
      setRect(rect);
    }
  };

  const onMouseMove = (event: paper.MouseEvent) => {
    if (!dragging) {
      return;
    }
    // Get the new corner position by applying the offset to the event point.
    let activePointX: number = event.point.x + offset[0];
    let activePointY: number = event.point.y + offset[1];
    const activePoint: number[] = [activePointX, activePointY];

    if (rect && oppositePoint) {
      // // Recreate the rectangle with the new corner.
      rect.remove();
      rect = createRectangle(oppositePoint, activePoint);
      setRect(rect);
      //For each corner...

      rect.segments.forEach((segment, index) => {
        if (handles) {
          // ...place an handle...
          handles[index].position = segment.point;
          // ...store the potentially new segment <=> corner bound.
          handles[index].data.segmentIndex = index;
        }
      });
      rect.sendToBack();
    }
  };

  const onMouseUp = (event: paper.MouseEvent) => {
    dragging = false;
  };

  const onReset = () => {
    setRect(undefined);
    setHandles(undefined);
    setCurrentTool("");
    setGroup(new Paper.Group());
    setShowDropdown(false);
    Paper.view.onMouseDown = null;
    Paper.project.activeLayer.removeChildren();
  };

  const createOverlay = () => {
    setCurrentTool("overlay");
    if (rect) onReset();
    rect = createRectangle([40, 90], [280, 280]);
    createHandles();
    setHandles(handles);
    Paper.view.onMouseMove = (event: paper.MouseEvent) => onMouseMove(event);
    Paper.view.onMouseUp = (event: paper.MouseEvent) => onMouseUp(event);
  };

  return <button onClick={(e) => createOverlay()}>Add Overlay</button>;
};

export default Overlay;
