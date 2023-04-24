import { useEffect, useState } from 'react'
import SimulationScreen from './SimulationScreen';

window.DEBUG = true;

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
      <div>
        <SimulationScreen />
      </div>
    </>
  )
}

export default App
