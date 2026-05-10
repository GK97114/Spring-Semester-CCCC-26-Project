import { useState } from "react";
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
    const [eatenOn, setEatenOn] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /**
     * Get today's date in YYYY-MM-DD format for the date input default
     * @returns todays date
     */
    function getToday() {
        return new Date().toISOString().split("T")[0];
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            // Call the API to create a new meal with the provided meal name and cuisine
            await createMeal({ meal_name: mealName, cuisine, eaten_on: eatenOn });

            // Clear the form fields after successful creation
            setMealName("");
            setCuisine("");
            setEatenOn(getToday());

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
        <div className="section-card">
            <h2>Add a meal</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="meal-name">Meal name</label>
                        <input
                            id="meal-name"
                            type="text"
                            placeholder="e.g. Chicken tikka masala"
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="cuisine">Cuisine</label>
                        <select
                            id="cuisine"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            required
                        >
                            <option value="">Select cuisine</option>
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
                    </div>

                    <div className="form-field">
                        <label htmlFor="eaten-on">Date eaten</label>
                        <input
                            id="eaten-on"
                            type="date"
                            value={eatenOn}
                            max={getToday()} // ← prevents future dates
                            onChange={(e) => setEatenOn(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Add meal
                    </button>
                </div>
            </form>

            {error && <p className="msg-error">{error}</p>}
            {success && <p className="msg-success">{success}</p>}
        </div>
    );
}

export default MealForm;