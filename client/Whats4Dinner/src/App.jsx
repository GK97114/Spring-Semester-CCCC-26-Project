import { useState, useEffect } from 'react'
import './App.css'

import { initSession } from './services/api.js';
import MealForm from './components/MealForm.jsx';
import MealList from './components/MealList.jsx';
import RecommendationDisplay from './components/RecommendDisplay.jsx';

function App() {
  const [userReady, setUserReady] = useState(false); // State to track if the user session is ready
  const [error, setError] = useState(""); // State to track any errors during initialization
  const [refreshMealsKey, setRefreshMealsKey] = useState(0); // State to trigger refresh of meals list when a new meal is added or deleted

  // On component mount, initialize the user session by calling the API.
  // This will check if the user is already logged in and set up the session accordingly.
  useEffect(() => {
    async function initializeUser() {
      try {
        await initSession(); // Call the API to initialize the user session
      } catch (error) {
        console.error("Failed to initialize user", error);
        setError("Failed to initialize user session. Please try again.");
      } finally {
        setUserReady(true);}
    };
    initializeUser();
  }, []);

  function handleMealCreated() {
    setRefreshMealsKey(prevKey => prevKey + 1); // Increment the key to trigger a refresh of the meals list
  }

  // Conditional render to show a loading message while the user session is being initialized.
  if (!userReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="app-container">
        <h1>Whats4Dinner?</h1>

        {error && <p>{error}</p>}

        <MealForm onMealCreated={handleMealCreated} />
        <MealList key={refreshMealsKey} />
        <RecommendationDisplay />
      </div>
    </>
  );
}
export default App;