import React, { useState } from "react";
import { showSnackbar } from "../components/alerts/customSnackbar";
import Button from "@mui/material/Button";
import CameraView from "../components/camera/cameraView";
import CanvasOverlay from "../components/camera/canvasOverlay";
import { useCapture } from "../components/camera/captureContext";

import * as ort from "onnxruntime-web";
import DetectTensor from "./tensorflowDetect";

// const ort = require('onnxruntime-web');

async function LoadModels() {
  // const session = await ort.InferenceSession.create('./model.onnx');



};

async function runModel(inputTensor, imgWidth, imgHeight) {
  try {
    const response = await fetch("/models/corners.onnx");
    const modelBuffer = await response.arrayBuffer();

    // Create an ONNX runtime session with the model
    const session = await ort.InferenceSession.create(modelBuffer);
    // Run the model with the input tensor
    const output = await session.run({ images: inputTensor });
    const rawOutput = output["output0"].data;

    // Process the model output
    return processOutput(rawOutput, imgWidth, imgHeight);
  } catch (error) {
    console.error("Failed to load and run the ONNX model:", error);
    throw error;
  }
}

async function prepareInput(base64Image) {
  return new Promise((resolve, reject) => {
    // Convert base64 to Blob
    const base64Response = fetch(base64Image)
      .then(res => res.blob())
      .then(blob => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 640; // Match your model's input size
          canvas.height = 640;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0, 640, 640);

          // Get image data and normalize pixel values
          const imgData = context.getImageData(0, 0, 640, 640);
          const pixels = imgData.data;

          const red = [];
          const green = [];
          const blue = [];
          for (let i = 0; i < pixels.length; i += 4) {
            red.push(pixels[i] / 255.0);
            green.push(pixels[i + 1] / 255.0);
            blue.push(pixels[i + 2] / 255.0);
          }

          const inputTensor = Float32Array.from([...red, ...green, ...blue]);
          resolve(new ort.Tensor("float32", inputTensor, [1, 3, 640, 640]));
        };

        img.onerror = (err) => {
          console.error("Error loading image:", err);
          reject(err);
        };
      })
      .catch(reject);
  });
}


function processOutput(output, img_width, img_height) {
  let boxes = [];
  for (let index = 0; index < 8400; index++) {
    const [class_id, prob] = [...Array(80).keys()]
      .map(col => [col, output[8400 * (col + 4) + index]])
      .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
    if (prob < 0.5) {
      continue;
    }
    const label = yolo_classes[class_id];
    const xc = output[index];
    const yc = output[8400 + index];
    const w = output[2 * 8400 + index];
    const h = output[3 * 8400 + index];
    const x1 = (xc - w / 2) / 640 * img_width;
    const y1 = (yc - h / 2) / 640 * img_height;
    const x2 = (xc + w / 2) / 640 * img_width;
    const y2 = (yc + h / 2) / 640 * img_height;
    boxes.push([x1, y1, x2, y2, label, prob]);
  }

  boxes = boxes.sort((box1, box2) => box2[5] - box1[5])
  const result = [];
  while (boxes.length > 0) {
    result.push(boxes[0]);
    boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
  }
  return result;
}


function iou(box1, box2) {
  return intersection(box1, box2) / union(box1, box2);
}

function union(box1, box2) {
  const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
  const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
  const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1)
  const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1)
  return box1_area + box2_area - intersection(box1, box2)
}


function intersection(box1, box2) {
  const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
  const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
  const x1 = Math.max(box1_x1, box2_x1);
  const y1 = Math.max(box1_y1, box2_y1);
  const x2 = Math.min(box1_x2, box2_x2);
  const y2 = Math.min(box1_y2, box2_y2);
  return (x2 - x1) * (y2 - y1)
}


const yolo_classes = [
  'corner'
];



export default function DetectCorners() {
  const { capture, setWebcamRef } = useCapture();
  const [loading, setLoading] = useState(false);

  const handleDetectCorners = async () => {
    const image = capture();
    if (image) {
      setLoading(true);
      try {
        const tensor = await prepareInput(image);
        const corners = await runModel(tensor);
        console.log("Detected corners:", corners);
        showSnackbar("Corners detected successfully!", "success");
      } catch (error) {
        console.error("Error detecting corners:", error);
        showSnackbar("Failed to detect corners!", "error");
      }
      setLoading(false);
    } else {
      showSnackbar("Please enable the camera and capture an image!", "info");
    }
  };

  return (
    <div style={{ flexDirection: "column", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <CameraView ref={setWebcamRef} />
        <CanvasOverlay />
      </div>

      {/* <Button
        variant="contained"
        onClick={handleDetectCorners}
        color="secondary"
        disabled={loading}
        sx={{ width: "100%" }}
      >
        {loading ? "Detecting..." : "Detect Corners"}
      </Button> */}
      <DetectTensor></DetectTensor>

    </div>
  );
}
