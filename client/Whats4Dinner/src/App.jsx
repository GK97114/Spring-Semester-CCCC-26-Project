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
  const initializeUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUserId(data.user_id);
      setUserReady(true);
    } catch (error) {
      console.error("Failed to initialize user", error);
    }
  };
  initializeUser();
}, []);

// Conditional render
return userReady ? <Dashboard /> : <LoadingSpinner />;

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