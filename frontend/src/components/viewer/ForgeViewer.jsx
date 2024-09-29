import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const ForgeViewer = () => {
  const viewerDiv = useRef(null);
  const viewer = useRef(null);
  const modelRef = useRef(null); // Reference to the loaded model

  const initializeViewer = async () => {
    const Autodesk = window.Autodesk;

    if (!Autodesk) {
      console.error("Autodesk Forge Viewer library is not loaded.");
      return;
    }

    Autodesk.Viewing.Initializer(
      { accessToken: '' },
      async () => {
        viewer.current = new Autodesk.Viewing.GuiViewer3D(viewerDiv.current);
        viewer.current.start();
        viewer.current.setTheme('dark-theme');

        await viewer.current.loadExtension('Autodesk.glTF');

        // Load your model
          viewer.current.loadModel('/assets/worker.glb', {}, (model) => {
          modelRef.current = model; // Store a reference to the model

          // Set camera position for a 180-degree view
          const position = new window.THREE.Vector3(0, 0, -5);
          const target = new window.THREE.Vector3(0, 0, 0);
          viewer.current.navigation.setPosition(position);
          viewer.current.navigation.setTarget(target);
          viewer.current.navigation.update();

          // Optional: Rotate the model by 180 degrees around the Y-axis
          const instanceTree = model.getInstanceTree();
          const rootId = instanceTree.getRootId();
          const rotationMatrix = new window.THREE.Matrix4().makeRotationY(Math.PI);
          const transform = instanceTree.getModelTransform(rootId);
          transform.multiplyMatrices(rotationMatrix, transform);
          viewer.current.impl.model.setWorldTransform(transform);
          viewer.current.impl.invalidate(true);
        });
      }
    );
  };

  // Function to handle the model movement
  const moveModel = (delta) => {
    if (!modelRef.current) return; // Ensure the model is loaded

    const moveSpeed = 0.01; // Speed of the model movement
    const instanceTree = modelRef.current.getInstanceTree();
    const rootId = instanceTree.getRootId();
    
    // Update the model's position
    const transform = instanceTree.getModelTransform(rootId);
    transform.setPosition(transform.getPosition().add(new window.THREE.Vector3(moveSpeed * delta, 0, 0))); // Move in x direction

    // Set the new transformation
    viewer.current.impl.model.setWorldTransform(transform);
    viewer.current.impl.invalidate(true); // Refresh the viewer
  };

  useEffect(() => {
    initializeViewer();

    return () => {
      if (viewer.current) {
        viewer.current.uninitialize();
      }
      if (viewerDiv.current) {
        viewerDiv.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={viewerDiv} style={{ width: '500px', height: '500px' }}></div>
  );
};

export default ForgeViewer;
