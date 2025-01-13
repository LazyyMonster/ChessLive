import React, { useEffect, useRef } from "react";
import { VIDEO_WIDTH, VIDEO_HEIGHT, CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT } from '../settings/constants';
import { useGlobalVariables } from "../../globalVariables/globalVariables";

export default function CanvasOverlay() {
    const canvasRef = useRef(null);
    const { detectedCorners } = useGlobalVariables();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detectedCorners) {
            const scaleX = VIDEO_WIDTH / CAPTURED_IMAGE_WIDTH;
            const scaleY = VIDEO_HEIGHT / CAPTURED_IMAGE_HEIGHT;

            const scaledCorners = Object.values(detectedCorners).map(([x, y]) => ({
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
    }, [detectedCorners]);

    return (
        <canvas
            ref={canvasRef}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 2,
            }}
        />
    );
}
