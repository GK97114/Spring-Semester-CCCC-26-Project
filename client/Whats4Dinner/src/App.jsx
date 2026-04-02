import { useState } from 'react'
import './App.css'
import { fetchTestMessage } from './services/api'

function App() {
  const [count, setCount] = useState(0)

  // Start fetching the test message when the component mounts
  useEffect(() => {
    fetchTestMessage().then(data => setMessage(data.message));
  }, []);

  return (
    <>
      
    </>
  )
}

export default App
