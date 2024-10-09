//Winning submission made by Onkar and Shailendra for AutoDesk Eduhack (Ctrl + Alt + Delete Challenge)

import { React, useEffect, useState , useRef } from 'react'
import { Canvas ,useFrame } from "@react-three/fiber"
import { useGLTF , OrbitControls , PerspectiveCamera } from "@react-three/drei"
import ForgeViewer from './components/viewer/ForgeViewer'

import ramm from '/sounds/ramm.mp3'
import quenchS from '/sounds/quench.mp3'
import sprayS from '/sounds/spray.mp3'

function App() {

  // Sounds

  const rammRef = useRef(new Audio(ramm));
  const QuenchSRef = useRef(new Audio(quenchS));
  const SpraySRef = useRef(new Audio(sprayS));

  // GET ORDERS

  const [orders , setOrders] = useState(0)

  const handleGetOrders = (ord) => {
    useEffect(()=> {
      setOrders(ord/15)
    } , [])
  }

  // GAME STATE

  const [isPaused , setIsPaused] = useState(false)

  // Production Stage

  const [stage , setStage] = useState('paused')

  // DECLARING CURRENCY AND PRODUCT COUNT

  const [currency , setCurrency] = useState(50);
  const [products , setProducts] = useState(0);

  const Pipe = () => {
    const {scene} = useGLTF('/assets/pipe/scene.gltf');

    return <primitive object={scene} scale={0.2} />
  }

  const startGame = () => {
    // const {scene} = useGLTF('/assets/pipe/scene.gltf');
    // scene.position.x = 1.5

    setCurrency((prev) => prev - 20)

    if(currency < 5) endGame();
    else setStage('hammering');

    setIsPaused(false)
  }

  const newInput = () => {
    const {scene} = useGLTF('/assets/pipe/scene.gltf');
    scene.position.x = 1.5

    setCurrency((prev) => prev - 20)
    if(currency < 5) endGame();
    else setStage('hammering');
  }

  // Hammering/Ramming

  const [toBeRammed , setToBeRammed] = useState(5)
  const [rammingNumber , setRammingNumber] = useState(0)

  const HammerRef = useRef(null);

  const startHammering = () => {
    if (HammerRef.current) return;
    HammerRef.current = setInterval(() => {
      rammRef.current.play()
      setRammingNumber((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopHammering = () => {
    rammRef.current.pause()
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
    if(currency < 5) endGame();
    else setStage('quenching')
  }

  // Quenching

  const [toBeQuenchedtime , setToBeQuenchedtime] = useState(5);
  const [quenchtime , setQuenchtime] = useState(0);

  const QuenchRef = useRef(null);

  const startQuenching = () => {
    if (QuenchRef.current) return;
    QuenchRef.current = setInterval(() => {
      QuenchSRef.current.play()
      setQuenchtime((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopQuenching = () => {
    QuenchSRef.current.pause()
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
    if(currency < 5) endGame();
    else setStage('painting');
  }

  // Paint

  const [toBePainted , setToBePainted] = useState(5)
  const [paintNumber , setPaintNumber] = useState(0)

  const PaintRef = useRef(null);

  const startPainting = () => {
    if (PaintRef.current) return;
    PaintRef.current = setInterval(() => {
      SpraySRef.current.play()
      setPaintNumber((prev) => Math.min(prev + 0.1, 100));
    }, 100);
  };

  const stopPainting = () => {
    SpraySRef.current.pause()
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
    if (stage === 'paused') {
      return(
        <>
         <button className='bg-gray-800 text-yellow-300 font-bold py-4 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-md active:shadow-sm border border-gray-500 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-gray-700 before:via-gray-900 before:to-gray-700 before:rounded-lg before:opacity-0 hover:before:opacity-20 z-30' onClick={startGame}>Start</button>
        </>
      )
    } else if (stage === 'next') {
      return(
        <>
         <button className='bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 active:scale-95 active:shadow-sm border-4 border-yellow-800 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-yellow-600 before:to-yellow-800 before:rounded-lg before:opacity-0 hover:before:opacity-20 z-30' onClick={newInput}>New Product</button>
        </>
      )
    } else if (stage === 'hammering') {
      return(
        <>
          <button
          className="bg-gray-900 text-red-500 font-bold py-4 px-8 rounded-md shadow-lg transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-md active:shadow-sm border-4 border-gray-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-gray-800 before:via-gray-600 before:to-gray-800 before:rounded-md before:opacity-0 hover:before:opacity-10 z-30"
            onMouseDown={startHammering}
            onMouseUp={stopHammering}
            onMouseLeave={stopHammering}>🔨 Hammer
          </button>
          <button className='bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-red-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-red-700 before:via-red-600 before:to-red-700 before:rounded-lg before:opacity-0 hover:before:opacity-10 z-30' onClick={endHammer}>🛑 End Hammering</button>
        </>
      )
    } else if (stage === 'quenching') {
      return(
        <>
          <button
          className='bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-blue-600 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-600 before:via-blue-500 before:to-blue-600 before:rounded-lg before:opacity-0 hover:before:opacity-10 z-30'
            onMouseDown={startQuenching}
            onMouseUp={stopQuenching}
            onMouseLeave={stopQuenching}>💧 Quench
          </button>
          <button className='bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-blue-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-700 before:via-blue-600 before:to-blue-700 before:rounded-lg before:opacity-0 hover:before:opacity-10 z-30' onClick={endQuench}>🟦 End Quenching</button>
        </>
      )
    } else if (stage === 'painting') {
      return(
        <>
          <button
          className='bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-green-600 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-green-600 before:via-green-500 before:to-green-600 before:rounded-lg before:opacity-0 hover:before:opacity-10 z-30'
            onMouseDown={startPainting}
            onMouseUp={stopPainting}
            onMouseLeave={stopPainting}>🖌️ Paint
          </button>
          <button className='bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 active:scale-95 active:shadow-sm border-4 border-blue-800 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-600 before:to-blue-800 before:rounded-lg before:opacity-0 hover:before:opacity-20 z-30' onClick={handleFinishedProduct}>Finish And Deploy</button>
        </>
      )
    }
  }

  // MODALS

  const Modals = () => {

     if (stage === 'hammering') {
      return(
        <>
          <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden z-30 border border-red-500">
            <div
              className="bg-red-500 h-full text-center text-white rounded-full z-30 relative"
              style={{ width: `${rammingNumber/toBeRammed*100}%` }}
            >
            </div>
          </div>
        </>
      )

    } else if(stage === 'quenching') {
      return(
        <>
         <div className="w-64 bg-gray-200 rounded-full h-4 z-30 border border-blue-500">
            <div
                className="bg-blue-500 h-full rounded-full z-30 relative"
                style={{ width: `${quenchtime/toBeQuenchedtime*100}%` }}
              />
          </div>
        </>
      )
    } else if(stage === 'painting') {
      return(
        <>
          <div className="w-64 bg-gray-200 rounded-full h-4 overflow-hidden z-30 border border-green-500">
            <div
              className="bg-green-500 h-full text-center text-white rounded-full z-30 relative"
              style={{ width: `${paintNumber/toBePainted*100}%`}}
            >
            </div>
          </div>
        </>
      )
    }
  }

    // COOLDOWN

    const handleTimeUp = (val) => {
      val ? endGame() : 0
    }

    // END GAME CHECK

    const endGame = () => {

    // RESET THE PROGRESS

      setRammingNumber(0)
      setQuenchtime(0)
      setPaintNumber(0)

      setIsPaused(true)
      setStage('paused')

      // alert('Game Over! Hit Refresh to start Again !')
    }

    // Value Evaluation

    const handleFinishedProduct = () => {

      const price = (Math.floor(rammingNumber)/toBeRammed)*50 + (Math.floor(quenchtime)/toBeQuenchedtime)*20 + (Math.floor(paintNumber)/toBePainted)*10
      setCurrency((prev) => prev + price)
      setProducts((prev) => prev+1)

      // reset the stage progresses

      setRammingNumber(0)
      setQuenchtime(0)
      setPaintNumber(0)

      setStage('next')
    }

    const resetGame = () => {
      window.location.reload();
    }

    // SHOW FINAL RESULTS

    const Restart = () => {
      return(
        <>
          <div className='flex flex-col justify-center items-center h-screen w-screen bg-gray-800 bg-opacity-75 rounded-lg shadow-xl absolute z-20 p-8'>
            <div className='flex flex-col text-center text-white mb-6'>
              <span className='text-lg font-semibold'>Your Stats:</span>
              <span className='text-md'>Orders finished: <span className='font-bold'> {`${products} / ${Math.floor(orders)}`} </span></span>
              <span className='text-md'>Profit: <span className='font-bold'>{`${currency - 50} $`} </span></span>
            </div>

            <button className='flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md' onClick={resetGame}>
              🔄 Restart Game
            </button>
          </div>

        </>
      )
    }


  return (
    <>
      <div className="h-auto w-screen flex flex-col border">

        <ForgeViewer>

          <div className="canvas_component w-screen h-3/4">

            <Canvas>

              {/* Camera */}

              <PerspectiveCamera makeDefault position={[ 0 , 2 , 2.8]} rotation={[ -Math.PI/4 , 0 , 0]}/>

              {/* Lightings */}

              <ambientLight  intensity={2}/>

              {/* Factory */}

              <mesh position={[ 0 , 0 , 0 ]}>
                {/* <Workbench /> */}
              </mesh>

              {/* <mesh position={[ -2 , 0.12 , 0 ]} rotation={[ 0 , 0 , 0]}>
                <Pipe />
              </mesh> */}

            </Canvas>

          </div>
        </ForgeViewer>
        {/* CANVAS  */}


        {/* HTML */}

        <div className="html_component w-screen h-1/2 flex flex-col justify-around items-center absolute bottom-0">

          <div id='modals' className='w-full flex items-center justify-center'>
            <Modals />
          </div>

          <div id='buttons' className='w-full h-min flex justify-around'>
              <Buttons />
          </div>

          {/* Score */}
          <div id='score' className='w-auto h-12 flex justify-center items-center absolute top-0 right-0 italic z-30 mr-24 text-xl'>
            {`${currency >= 0 ? currency : 0} $`} <br/>
            {`Orders - ${products > 0 ? products : 0} / ${orders}`}
          </div>

          {/* Timer */}
          <div id='timer' className='w-64 h-16 flex justify-center items-center absolute top-0 left-0 italic z-30 ml-24 text-xl'>
            <Timer onValReturn={handleTimeUp} getOrders={handleGetOrders}/>
          </div>
        </div>

        {isPaused ? <Restart /> : 0}


      </div>
    </>
  )
}

const Timer = ({onValReturn , getOrders}) => {

  const randomNum = orderGenerator()
  const [time, setTime] = useState(orderGenerator(randomNum)*15)
  getOrders(time)

  if (time <= 0) onValReturn(1);

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