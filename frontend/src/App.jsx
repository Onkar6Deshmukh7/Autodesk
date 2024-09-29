import { React, useEffect, useState , useRef } from 'react'
import { Canvas ,useFrame } from "@react-three/fiber"
import { useGLTF , OrbitControls , PerspectiveCamera } from "@react-three/drei"

function App() {  

  // GET ORDERS

  const [orders , setOrders] = useState(0)

  const handleGetOrders = (ord) => {
    useEffect(()=> {
      setOrders(ord/5)
    } , [])
  }   

  // GAME STATE

  const [isPaused , setIsPaused] = useState(false)

  // Production Stage
  
  const [stage , setStage] = useState('paused')

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
    if (stage === 'paused') {
      return(
        <>
         <button className='bg-gray-800 text-yellow-300 font-bold py-4 px-8 rounded-lg shadow-lg transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-md active:shadow-sm border border-gray-500 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-gray-700 before:via-gray-900 before:to-gray-700 before:rounded-lg before:opacity-0 hover:before:opacity-20' onClick={startGame}>Start</button>
        </>
      )
    } else if (stage === 'next') {
      return(
        <>
         <button className='bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 active:scale-95 active:shadow-sm border-4 border-yellow-800 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-yellow-600 before:to-yellow-800 before:rounded-lg before:opacity-0 hover:before:opacity-20' onClick={newInput}>New Product</button>
        </>
      )
    } else if (stage === 'hammering') {
      return(
        <>              
          <button
          className="bg-gray-900 text-red-500 font-bold py-4 px-8 rounded-md shadow-lg transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-md active:shadow-sm border-4 border-gray-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-gray-800 before:via-gray-600 before:to-gray-800 before:rounded-md before:opacity-0 hover:before:opacity-10"
            onMouseDown={startHammering}
            onMouseUp={stopHammering}
            onMouseLeave={stopHammering}>🔨 Hammer
          </button>
          <button className='bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-red-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-red-700 before:via-red-600 before:to-red-700 before:rounded-lg before:opacity-0 hover:before:opacity-10' onClick={endHammer}>🛑 End Hammering</button>
        </>
      )
    } else if (stage === 'quenching') {
      return(
        <>
          <button
          className='bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-blue-600 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-600 before:via-blue-500 before:to-blue-600 before:rounded-lg before:opacity-0 hover:before:opacity-10'         
            onMouseDown={startQuenching}
            onMouseUp={stopQuenching}
            onMouseLeave={stopQuenching}>💧 Quench
          </button>
          <button className='bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-blue-700 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-700 before:via-blue-600 before:to-blue-700 before:rounded-lg before:opacity-0 hover:before:opacity-10' onClick={endQuench}>🟦 End Quenching</button>    
        </>
      )
    } else if (stage === 'painting') {
      return(
        <>              
          <button
          className='bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:translate-y-1 active:translate-y-2 hover:shadow-lg active:shadow-sm border-4 border-green-600 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-green-600 before:via-green-500 before:to-green-600 before:rounded-lg before:opacity-0 hover:before:opacity-10'
            onMouseDown={startPainting}
            onMouseUp={stopPainting}
            onMouseLeave={stopPainting}>🖌️ Paint
          </button>
          <button className='bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 active:scale-95 active:shadow-sm border-4 border-blue-800 relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-blue-600 before:to-blue-800 before:rounded-lg before:opacity-0 hover:before:opacity-20' onClick={handleFinishedProduct}>Finish And Deploy</button>
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
              className="bg-green-500 h-full text-center text-white rounded-full"
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

    const Restart = () => {
      return(
        <>
          <div className='border w-screen h-screen bg-opacity-50 flex flex-col justify-center items-center absolute z-20'>
              <div className='flex flex-col'>
                <span>Your Stats :</span>
                <span> {`Orders finished : ${products} / ${orders}`} </span>
                <span> {`Profit : ${currency - 50 }`} </span>
              </div>

              <button className='flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95' onClick={resetGame}> 🔄 Restart Game </button>
          </div>
        </>
      )
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
              {/* <Workbench /> */}
            </mesh>

            <mesh position={[ -2 , 0.12 , 0 ]} rotation={[ 0 , 0 , 0]}>
              <Pipe />
            </mesh>

          </Canvas>


        </div>

        {/* HTML */}

        <div className="html_component w-screen h-1/2 flex flex-col justify-around items-center absolute bottom-0">

          <div id='modals' className='w-full flex items-center justify-center'>
            <Modals />
          </div>

          <div id='buttons' className='w-full h-min flex justify-around'>
              <Buttons />
          </div>

          {/* Score */}
          <div id='score' className='w-24 h-12 flex justify-center items-center absolute top-0 right-0 italic'>
            {`${currency >= 0 ? currency : 0} $`} <br/>
            {`Products - ${products > 0 ? products : ''} / ${orders}`}
          </div>

          {/* Timer */}
          <div id='timer' className='w-24 h-16 flex justify-center items-center absolute top-0 left-0 italic text-sm'>
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
  const [time, setTime] = useState(orderGenerator(randomNum)*5)    
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