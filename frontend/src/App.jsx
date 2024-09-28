import { React, useEffect, useState , useRef } from 'react'
import { Canvas ,useFrame } from "@react-three/fiber"
import { useGLTF , OrbitControls , PerspectiveCamera } from "@react-three/drei"

function App() {
  
  const Workbench = () => {
    const {scene} = useGLTF('/assets/workbench/scene.gltf');
    return <primitive object={scene} scale={1} />
  }

  const Conveyer = () => {
    const {scene} = useGLTF('/assets/conveyer/scene.gltf');
    return <primitive object={scene} scale={[ 0.5 , 1 , 2]} />
  }
  
  const Axe = () => {
    const {scene} = useGLTF('/assets/axe/scene.gltf');
    return <primitive object={scene} scale={0.002} />
  }

  // GET ORDERS

  const [orders , setOrders] = useState(0)   
  
  // Production Stage
  
  const [stage , setStage] = useState('')

  // DECLARING CURRENCY AND PRODUCT COUNT

  const [currency , setCurrency] = useState(50);
  const [products , setProducts] = useState(0);

  // Call new Pipe / Make Pipe 
  // SHAILEN BHAI IDHAR NEW INOUT RAW MATERIAL DEFINE KARA H, JAB BHI CALL HOGA ANIMATION AISA RAHE KI EK RAW ITEM LEFT CONVEYER BELT SE TABLE TAK AA RAHA H
  
  // ANIMATION KA EXAMPLE H LINE 48 PE 

  const Pipe = () => {
    const {scene} = useGLTF('/assets/pipe/scene.gltf');

    return <primitive object={scene} scale={0.2} />
  }

  const startGame = () => {
    const {scene} = useGLTF('/assets/pipe/scene.gltf');
    scene.position.x = 1.5

    setCurrency((prev) => prev - 20)
    if(currency < 5) alert('gameover');
    else setStage('hammering');
  }

  const newInput = () => {
    const {scene} = useGLTF('/assets/pipe/scene.gltf');
    scene.position.x = 1.5   

    setCurrency((prev) => prev - 20)
    if(currency < 5) alert('gameover');
    else setStage('hammering');
  }

  // Hammering/Ramming

  const [toBeRammed , setToBeRammed] = useState(5)
  const [rammingNumber , setRammingNumber] = useState(0)

  const HammerRef = useRef(null);

  const startHammering = () => {
    if (HammerRef.current) return;
    HammerRef.current = setInterval(() => {
      setRammingNumber((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopHammering = () => {
    clearInterval(HammerRef.current);
    HammerRef.current = null;
  };

  useEffect(() => {
    if (rammingNumber === toBeRammed) {
      stopHammering()
    };
  }, [rammingNumber]);

  const endHammer = () => {
    setCurrency((prev) => prev - 5)
    if(currency < 5) alert('gameover');
    else setStage('quenching')
  }

  // Quenching

  const [toBeQuenchedtime , setToBeQuenchedtime] = useState(5);
  const [quenchtime , setQuenchtime] = useState(0);

  const QuenchRef = useRef(null);

  const startQuenching = () => {
    if (QuenchRef.current) return;
    QuenchRef.current = setInterval(() => {
      setQuenchtime((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopQuenching = () => {
    clearInterval(QuenchRef.current);
    QuenchRef.current = null;
  };

  useEffect(() => {
    if (quenchtime >= toBeQuenchedtime) {
      console.log(quenchtime)
      stopQuenching()
    };
  }, [quenchtime]);

  const endQuench = () => {
    setCurrency((prev) => prev - 5)
    if(currency < 5) alert('gameover');
    else setStage('painting');
  }

  // Paint

  const [toBePainted , setToBePainted] = useState(5)
  const [paintNumber , setPaintNumber] = useState(0)

  const PaintRef = useRef(null);

  const startPainting = () => {
    if (PaintRef.current) return;
    PaintRef.current = setInterval(() => {
      setPaintNumber((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopPainting = () => {
    clearInterval(PaintRef.current);
    PaintRef.current = null;
  };

  useEffect(() => {
    if (paintNumber === toBePainted) {
      stopPainting()
    };
  }, [paintNumber]);

  // BUTTONS

  const Buttons = () => {
    if (stage === '' && products === 0) {
      return(
        <>
         <button onClick={startGame}>Start</button>
        </>
      )
    } else if (stage === '' && products > 0) {
      return(
        <>
         <button onClick={newInput}>New Product</button>
        </>
      )
    } else if (stage === 'hammering') {
      return(
        <>              
          <button
            onMouseDown={startHammering}
            onMouseUp={stopHammering}
            onMouseLeave={stopHammering}>Hammer
          </button>
          <button onClick={endHammer}>endHammer</button>
        </>
      )
    } else if (stage === 'quenching') {
      return(
        <>
          <button         
            onMouseDown={startQuenching}
            onMouseUp={stopQuenching}
            onMouseLeave={stopQuenching}>Quench
          </button>
          <button onClick={endQuench}>endQuench</button>    
        </>
      )
    } else if (stage === 'painting') {
      return(
        <>              
          <button
            onMouseDown={startPainting}
            onMouseUp={stopPainting}
            onMouseLeave={stopPainting}>Paint
          </button>
          <button onClick={handleFinishedProduct}>Finish and Deploy</button>
        </>
      )
    }
  }

  // MODALS
  
  const Modals = () => {

     if (stage === 'hammering') {
      return(
        <>
          <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden ">
            <div
              className="bg-red-500 h-full text-center text-white rounded-full"
              style={{ width: `${rammingNumber/toBeRammed*100}%` }}
            >
            </div>
          </div>
        </>
      )
      
    } else if(stage === 'quenching') {
      return(
        <>
         <div className="w-64 bg-gray-200 rounded-full h-4">
            <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${quenchtime/toBeQuenchedtime*100}%` }}
              />
          </div>
        </>
      )
    } else if(stage === 'painting') {
      return(
        <>
          <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-red-500 h-full text-center text-white rounded-full"
              style={{ width: `${paintNumber/toBePainted*100}%`}}
            >
            </div>
          </div>
        </>
      )
    }
  }

    // COOLDOWN


    // END GAME CHECK

    const endGame = () => {


    // RESET THE PROGRESS

      setRammingNumber(0)
      setQuenchtime(0)
      setPaintNumber(0)

      setStage('')
    }

    // Value Evaluation

    // SHAILEN BHAI IDHAR FINISH PRODUCT WALA FUNCTION H,  JAB CLICK HOGA TAB EK ANMATION LAGA DENA KI EK FINISHED PRODUCT TABLE SE RIGHT WALE CONVEYOR BELT KE THROUGH SCREEN KE BAHAAR RIGHT ME JAA RAHA

    const handleFinishedProduct = () => {

      const price = (Math.floor(rammingNumber)/toBeRammed)*50 + (Math.floor(quenchtime)/toBeQuenchedtime)*20 + (Math.floor(paintNumber)/toBePainted)*10 
      setCurrency( (prev) => prev + price)
      setProducts((prev) => prev+1)

      // reset the stage progresses

      setRammingNumber(0)
      setQuenchtime(0)
      setPaintNumber(0)

      setStage('')
    }
  

  return (
    <>
      <div className="h-screen w-screen flex flex-col">

        {/* CANVAS  */}

        <div className="canvas_component w-screen h-3/4">

          <Canvas>

            {/* Camera */}

            <PerspectiveCamera makeDefault position={[ 0 , 2 , 2.8]} rotation={[ -Math.PI/4 , 0 , 0]}/>

            {/* Lightings */}

            <ambientLight  intensity={2}/>

            {/* Factory */}

            <mesh position={[ 0 , 0 , 0 ]}>
              <Workbench />
            </mesh>

            <mesh position={[ -2 , 0.12 , 0 ]} rotation={[ 0 , 0 , 0]}>
              <Pipe />
            </mesh>

          </Canvas>


        </div>

        {/* HTML */}

        <div className="html_component w-screen h-1/2 flex flex-col justify-around items-center absolute bottom-0 border">

          <div id='modals' className='border w-full flex items-center justify-center'>
            <Modals />
          </div>

          <div id='buttons' className='border w-full h-min flex justify-around'>
              <Buttons />
          </div>

          {/* Score */}
          <div id='score' className='border w-24 h-12 flex justify-center items-center absolute top-0 right-0 italic'>
            {`${currency >= 0 ? currency : 0} $`} <br/>
            {`Products - ${products}`}
          </div>

          {/* Timer */}
          <div id='timer' className='border w-24 h-16 flex justify-center items-center absolute top-0 left-0 italic text-sm'>
            <Timer />
          </div>
        </div>
          
      </div>
    </>
  )
}

// SHAILEN BHAAI TIMER KA JUGAAD LAGAO. TAAKI 0 HONE PE GAME STOP HO JAEEEE!!!

const Timer = () => {
  const orders = orderGenerator();
  const [time, setTime] = useState(orders*2);
    
  useEffect(() => {
    if (time === 0) return; // Stop when time is 0
    const timer = setInterval(() => setTime((prev) => prev - 1), 1000);

    return () => clearInterval(timer); // Clear the interval on unmount
  }, []);

  return <div>{time > 0 ? `Time remaining: ${time}` : "Time's up!"}</div>;

}

function orderGenerator () {
  const orders = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
  return orders;
}

export default App