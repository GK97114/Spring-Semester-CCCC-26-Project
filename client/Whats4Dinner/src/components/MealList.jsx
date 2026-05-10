import { useState, useEffect } from "react";
import { getMeals, deleteMeal } from "../services/api";

/**
 * Function to format the date and time of a meal creation
 * @param {dateString} dateString is the date in string form 
 * @returns a formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric"});
}

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

    return (
        <div className="section-card">
            <h2>Recent meals</h2>

            {error && <p className="msg-error">{error}</p>}

            {loading ? (
                <p className="state-loading">Loading meals...</p>
            ) : meals.length === 0 ? (
                <p className="state-empty">No meals logged yet — add one above!</p>
            ) : (
                <table className="meals-table">
                    <thead>
                        <tr>
                            <th>Meal</th>
                            <th>Cuisine</th>
                            <th>Added</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal) => (
                            <tr key={meal.id}>
                                <td className="meal-name">{meal.meal_name || meal.name}</td>
                                <td>
                                    <span className="cuisine-badge">{meal.cuisine}</span>
                                </td>
                                <td className="date-text">
                                    {meal.created_at ? formatDate(meal.created_at) : "—"}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(meal.id)}
                                        aria-label={`Delete ${meal.meal_name}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default MealList;