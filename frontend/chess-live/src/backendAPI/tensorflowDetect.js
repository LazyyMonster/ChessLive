import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useCapture } from "../components/camera/captureContext";


const DetectTensor = () => {
    const [model, setModel] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const { capture } = useCapture(); // Access capture function from context

    useEffect(() => {
        const loadModel = async () => {
            const yoloModel = await tf.loadGraphModel("models/best_corners_web_model/model.json");
            setModel(yoloModel);
        };
        loadModel();
    }, []);

    const handleScreenshotAndDetect = async () => {
        const imageSrc = capture(); // Take a screenshot from webcam
        if (!imageSrc || !model) return;

        // Create a TensorFlow tensor from the screenshot
        const image = new Image();
        image.src = imageSrc;

        image.onload = async () => {
            const inputTensor = tf.browser.fromPixels(image);
            const resizedTensor = tf.image.resizeBilinear(inputTensor, [640, 640]); // YOLO input size
            const expandedTensor = resizedTensor.expandDims(0); // Add batch dimension

            const results = await model.executeAsync(expandedTensor); // Run inference
            setPredictions(processResults(results)); // Process YOLO output
            tf.dispose([inputTensor, resizedTensor, expandedTensor]); // Cleanup
        };
    };

    const processResults = (results) => {
        // Example: Parse YOLO outputs into bounding boxes and class predictions
        console.log("predictions", predictions);
        return results; // Replace with your parsing logic
    };

    return (
        <div>
            <button onClick={handleScreenshotAndDetect}>Capture & Detect</button>
            {/* <div>
                {predictions.map((pred, idx) => (
                    <div key={idx}>{JSON.stringify(pred)}</div>
                ))}
            </div> */}
        </div>
    );
};

export default DetectTensor;
