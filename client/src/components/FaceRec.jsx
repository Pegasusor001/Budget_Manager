import React, { useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";

import { drawMesh } from "../helper/utilities";
import { useHistory } from "react-router-dom";

export default function FaceRec(props) {
  const history = useHistory();
  // setup ref for canvas and webcam
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  // load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      // passing phone to webmesh with fixed size
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });

    // call detect function every 10ms
    const detectFace = setInterval(() => {
      detect(net);
    }, 10);

    setTimeout(() => {
      clearInterval(detectFace);
      setTimeout(() => props.showFace(), 4500);
    }, 2500);

  };

  const detect = async (net) => {
    // check webcam is running to receive data or not
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // video prop
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      // set vedio width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      // detect face
      const face = await net.estimateFaces(video);

      // get canvas context
      const ctx = canvasRef.current.getContext("2d");
      
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
      
    }
  };
  runFacemesh();
  return (
    <>
    
    <div className="face">
    <h2>Smile please! 🤑</h2>
      <header className="face-header ">
        
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: -9,
            width: 320,
            height: 240
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: -9,
            width: 320,
            height: 240
          }}
        />
      </header>
    </div>
    </>
  );
}
