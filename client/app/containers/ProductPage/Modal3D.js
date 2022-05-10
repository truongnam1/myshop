/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState, Suspense } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Canvas } from 'react-three-fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './modal3d.css';

const Modal3D = props => {
  const { buttonLabel, className, file3dUrl } = props;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  let modelPath = '/test3d/buster_drone/scene.gltf';
  if (file3dUrl) {
    modelPath = file3dUrl;
  }

  function Model(props) {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} />;
  }

  return (
    <div>
      <Button color='transp' onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        size='lg'
        contentClassName="modal-3d-content"
      >
        {/* <ModalHeader toggle={toggle}>Modal title</ModalHeader> */}
        <ModalBody>
          <Canvas
            pixelRatio={[1, 2]}
            camera={{ position: [-10, 15, 15], fov: 50 }}
          >
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </ModalBody>
        {/* <ModalFooter>
          <Button color='primary' onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
};

export default Modal3D;
