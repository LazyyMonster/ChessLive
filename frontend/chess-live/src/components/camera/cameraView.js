import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function CameraView({ points }) {
  const canvasRef = useRef(null);

  const videoConstraints = {
    facingMode: { exact: "environment" }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && points && points.length === 4) {
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set line style
      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;

      // Draw lines connecting the points
      ctx.beginPath();
      // ctx.moveTo(points[0].x, points[0].y);
      // ctx.lineTo(points[1].x, points[1].y);
      // ctx.lineTo(points[2].x, points[2].y);
      // ctx.lineTo(points[3].x, points[3].y);

      ctx.moveTo(50, 50);
      ctx.lineTo(200, 50);
      ctx.lineTo(200, 200);
      ctx.lineTo(50, 200);
      ctx.closePath();
      ctx.stroke();
    }
  }, [points]);

  return (
    <Webcam videoConstraints 
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "cover",
    }}
    />
  );
}