import { useState, useEffect } from "react";
import { getMeals, deleteMeal } from "../services/api";

/**
 * A component for displaying a list of meals.
 * @returns the MealList component, which displays a list of meals and allows the user to delete meals from the list.
 * @throws an error if the meal list fails to load, which is displayed to the user.
 */
function MealList() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Loads the list of meals from the API and updates the state accordingly.
     */
    async function loadMeals() {
        try {
            setError("");

            const data = await getMeals();

            // supports both { meals: [...] } and [...] response formats
            setMeals(data.meals || data);
        } catch (err) {
            console.error("Failed to load meals", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Handles the deletion of a meal.
     * @param {string} mealId is the ID of the meal to be deleted
     */
    async function handleDelete(mealId) {
        try {
            await deleteMeal(mealId);
            await loadMeals(); // Refresh the meal list after deletion
        } catch (err) {
            console.error("Failed to delete meal", err);
            setError(err.message);
        }
    }

    // Load the meals when the component mounts
    useEffect(() => {
        loadMeals();
    }, []);

    // Conditional render to show loading message
    if (loading) {
        return <div>Loading meals...</div>;
    }

    return (
        <div className="meal-list">
            <h2> Recent Meal list</h2>

            {error && <p className="error">{error}</p>}

            {meals.length === 0 ? (
                <p>No meals found. Please add some meals!</p>
            ) : (
                <ul>
                    {meals.map((meal) => (
                        <li key={meal.id}>
                            <strong>{meal.meal_name || meal.name}</strong> ({meal.cuisine})
                            <button onClick={() => handleDelete(meal.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default MealList;