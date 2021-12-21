import { useRef, useEffect } from "react";
import Paper from "paper";
import { useTableOverlayContext } from "./context";

const Canvas = () => {
  const { setCanvas } = useTableOverlayContext();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      if (setCanvas) setCanvas(canvas);
      canvas.style.height = "calc(100vh/1.5)";
      canvas.style.width = "100vw";
      canvas.style.border = "1px solid black";
      Paper.setup(canvas);
    }
  }, [setCanvas]);

  return (
    <>
      <canvas ref={canvasRef} id="canvas" />
    </>
  );
};

export default Canvas;
