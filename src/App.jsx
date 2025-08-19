import { useState } from 'react'
import './App.css'
import Newsapp from './Component/Newsapp'

function App() {
  const [count, setCount] = useState(0)

  return (
   <Newsapp/>

  )
}

export default App
