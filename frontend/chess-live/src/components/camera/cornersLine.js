import React, { useRef, useEffect } from "react";


export default function cornersLine({ points }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.lineTo(points[3].x, points[3].y);

    //   ctx.moveTo(50, 50);
    //   ctx.lineTo(200, 50);
    //   ctx.lineTo(200, 200);
    //   ctx.lineTo(50, 200);
      ctx.closePath();
      ctx.stroke();
    }
  }, [points]);

  return (
    <canvas
        ref={canvasRef}
        style={{
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
  );
}