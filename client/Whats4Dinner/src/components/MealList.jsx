import { useState, useEffect } from "react";
import { getMeals, deleteMeal, updateMeal } from "../services/api";
import { formatDate } from "../utils/formatDate";

/**
 * A component for displaying a list of meals.
 * @returns the MealList component, which displays a list of meals and allows the user to delete meals from the list.
 * @throws an error if the meal list fails to load, which is displayed to the user.
 */
function MealList() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

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

    /**
     * Handles setting the form to edit mode 
     * on the particular meal object that the user wants to edit
     * @param {Object} meal is the meal object that needs to be edited 
     */
    async function handleEdit(meal) {
        setEditingId(meal.id);
        setEditForm({
            meal_name: meal.meal_name,
            cuisine: meal.cuisine,
            eaten_on: meal.eaten_on
        });
    }

    /**
     * Handles saving the edits to a meal by sending a PUT request to backend
     * @param {string} mealId is the meal being editied
     * @throws an error if it fails to update a meal
     */
    async function handleEditSave(mealId) {
        try {
            await updateMeal(mealId, editForm);
            setEditingId(null);
            setEditForm({});
            await loadMeals();
        } catch (err) {
            console.error("Failed to update meal", err);
            setError(err.message);
        }
    }

    /**
     * Cancels an edit state, returning the meal back to display mode
     */
    function handleEditCancel() {
        setEditingId(null);
        setEditForm({});
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
                            <th>Eaten</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal) => (
                            editingId === meal.id ? (
                                <tr key={meal.id}>
                                    <td>
                                        <input
                                            type="text"
                                            value={editForm.meal_name}
                                            onChange={(e) => setEditForm({ ...editForm, meal_name: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={editForm.cuisine}
                                            onChange={(e) => setEditForm({ ...editForm, cuisine: e.target.value })}
                                        >
                                            <option value="American">American</option>
                                            <option value="Barbeque">Barbeque</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Fish">Fish</option>
                                            <option value="German">German</option>
                                            <option value="Indian">Indian</option>
                                            <option value="Italian">Italian</option>
                                            <option value="Japanese">Japanese</option>
                                            <option value="Mediterranean">Mediterranean</option>
                                            <option value="Mexican">Mexican</option>
                                            <option value="Other">Other</option>
                                            <option value="Seafood">Seafood</option>
                                            <option value="Tex-Mex">Tex-Mex</option>
                                            <option value="Thai">Thai</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={editForm.eaten_on}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setEditForm({ ...editForm, eaten_on: e.target.value })}
                                        />
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="btn-primary"
                                            onClick={() => handleEditSave(meal.id)}
                                            aria-label={`Save ${meal.meal_name}`}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={handleEditCancel}
                                            aria-label="Cancel edit"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={meal.id}>
                                    <td className="meal-name">{meal.meal_name || meal.name}</td>
                                    <td>
                                        <span className="cuisine-badge">{meal.cuisine}</span>
                                    </td>
                                    <td className="date-text">
                                        {meal.eaten_on ? formatDate(meal.eaten_on) : "—"}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="btn-primary"
                                            onClick={() => handleEdit(meal)}
                                            aria-label={`Edit ${meal.meal_name}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(meal.id)}
                                            aria-label={`Delete ${meal.meal_name}`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default MealList;