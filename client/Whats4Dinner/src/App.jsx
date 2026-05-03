import { useState, useEffect } from 'react'
import './App.css'

import { initSession } from './services/api.js';
import MealForm from './components/MealForm.jsx';
import MealList from './components/MealList.jsx';
import RecommendationDisplay from './components/RecommendDisplay.jsx';

function App() {
  const [userReady, setUserReady] = useState(false); // State to track if the user session is ready
  const [error, setError] = useState(""); // State to track any errors during initialization

  // On component mount, initialize the user session by calling the API.
  // This will check if the user is already logged in and set up the session accordingly.
  useEffect(() => {
    const initializeUser = async () => {
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

  // Conditional render to show a loading message while the user session is being initialized.
  if (!userReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="app-container">
        <h1>Whats4Dinner?</h1>

        {error && <p>{error}</p>}

        <MealForm />
        <MealList />
        <RecommendationDisplay />
      </div>
    </>
  );
}
export default App;