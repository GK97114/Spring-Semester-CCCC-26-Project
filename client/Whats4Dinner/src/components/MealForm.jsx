import { use, useState } from "react";
import { createMeal } from "../services/api";

/***
 * A component for creating a new meal.
 * @param {Object} props is an object containing the onMealCreated callback function, which is called after a meal is successfully created to allow the parent component to refresh the meal list or perform other actions.
 * @param {() => Promise<void>} props.onMealCreated is a callback function that is called after a meal is successfully created, allowing the parent component to refresh the meal list or perform other actions.
 * @returns the MealForm component, which includes a form for entering the meal name and cuisine, and handles the submission of the form to create a new meal.
 * @throws an error if the meal creation fails, which is displayed to the user.
 */
function MealForm({ onMealCreated }) {
    // State variables to track the meal name, cuisine, and any error or success messages
    const [mealName, setMealName] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            // Call the API to create a new meal with the provided meal name and cuisine
            await createMeal({ meal_name: mealName, cuisine });

            // Clear the form fields after successful creation
            setMealName("");
            setCuisine("");

            setSuccess("Meal added successfully!");

            // Call the onMealCreated callback to refresh the meal list or perform other actions after a meal is created
            if (onMealCreated) {
                await onMealCreated();
            }

        } catch (err) {
            console.error("Failed to create meal", err);
            setError(err.message);
        }
    }

    return (
        <div className="meal-form">
            <h2>Add a New Meal</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Meal Name"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    required
                />
                <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} required>
                    <option value="">Select a Cuisine</option>
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

                <button type="submit">Add Meal</button>
            </form>
        </div>
    );
}

export default MealForm;