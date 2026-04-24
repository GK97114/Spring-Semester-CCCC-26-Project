import { useState, useEffect, use } from 'react'
import './App.css'

import { initSession } from './services/api.js';
import MealForm from './components/MealForm.jsx';
import MealList from './components/MealList.jsx';
import RecommendationDisplay from './components/RecommendDisplay.jsx';

function App() {
  const [meal, setMeal] = useState("");       // State to hold the current meal input by the user
  const [meals, setMeals] = useState([]);     // State to hold the list of meals added by the user
  const [message, setMessage] = useState(""); // State to hold the test message from the API

  const [ready, setReady] = useState(false); // State to track if the app is ready (e.g., after session initialization)

// On component mount, initialize the user session by calling the API.
// This will check if the user is already logged in and set up the session accordingly.
useEffect(() => {
  initSession().then(() => {
    setReady(true);
  }).catch((err) => {
    console.error("Failed to initialize session: ", err);
  })
});

if (!ready) {
  return <div>Loading...</div>;
}
  return (
    <>
      <div className="app-container">
        <h1>Whats4Dinner?</h1>
        <MealForm />
        <MealList />
        <RecommendationDisplay />
      </div>
    </>
  )
}

export default App