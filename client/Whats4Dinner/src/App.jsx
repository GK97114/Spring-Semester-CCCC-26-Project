import { useState } from 'react'
import './App.css'
import { fetchTestMessage } from './services/api'

function App() {
  const [meal, setMeal] = useState("");
  const [meals, setMeals] = useState([]);

  // Start fetching the test message when the component mounts
  useEffect(() => {
    fetchTestMessage().then(data => setMessage(data.message));
  }, []);

  // Function to add a meal to the list
  const addMeal = () => {
    if (!meal) return;  // Do not add empty meals

    // Add the new meal to the list of meals
    setMeals([...meals, meal]);
    setMeal("");
  }

  return (
    <>
      <div >
        <h1>Whats4Dinner?</h1>

        <input>
          type="text"
          placeholder="Enter a meal"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
        </input>
        <button onClick={addMeal}>Add Meal</button>

        <h2>Recent Meals</h2>
        <ul>
          {meals.map((m, index) => (
            <li key={index}>{m}</li>
          ))}
        </ul>

        <button>What's for dinner?</button>
      </div>
    </>
  )
}

export default App
