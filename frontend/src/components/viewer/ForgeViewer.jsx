import React, { useEffect, useRef } from 'react';

const ForgeViewer = () => {
  const viewerDiv = useRef(null);
  const viewer = useRef(null);

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
        viewer.current.setTheme('light-theme');

        await viewer.current.loadExtension('Autodesk.glTF');

        viewer.current.loadModel('/assets/pipe/scene.gltf');
      }
    );
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
    <div ref={viewerDiv}></div>
  );
};

export default ForgeViewer;
