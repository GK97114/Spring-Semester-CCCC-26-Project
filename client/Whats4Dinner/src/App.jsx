import { useState, useEffect } from 'react'
import './App.css'
import { fetchTestMessage } from './services/api'

import MealForm from './components/MealForm';
import MealList from './components/MealList';
import RecommendationDisplay from './components/RecommendDisplay';

function App() {
  const [meal, setMeal] = useState("");       // State to hold the current meal input by the user
  const [meals, setMeals] = useState([]);     // State to hold the list of meals added by the user
  const [message, setMessage] = useState(""); // State to hold the test message from the API

  // Start fetching the test message when the component mounts
  // Remove this useEffect when you no longer need the test message
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
      <div className="app-container">
        <h1>Whats4Dinner?</h1>
        <MealForm />
        <MealList />
        <RecommendationDisplay />
        <p>{message}</p> {/* Display the test message from the API */}
      </div>
    </>
  )
}

export default App