import React, { useEffect, useRef } from "react";

export default function CanvasOverlay({
    corners,
    videoWidth,
    videoHeight,
    capturedImageWidth,
    capturedImageHeight,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (corners) {
            const scaleX = videoWidth / capturedImageWidth;
            const scaleY = videoHeight / capturedImageHeight;

            const scaledCorners = Object.values(corners).map(([x, y]) => ({
                x: x * scaleX,
                y: y * scaleY,
            }));

            ctx.strokeStyle = "red";
            ctx.lineWidth = 10;

            ctx.beginPath();
            scaledCorners.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = "blue";
            scaledCorners.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }, [corners, videoWidth, videoHeight, capturedImageWidth, capturedImageHeight]);

    return (
        <canvas
            ref={canvasRef}
            width={videoWidth}
            height={videoHeight}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}
