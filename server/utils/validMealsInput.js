/**
 * Validates the input for a new meal
 * @param {string} name - The name of the meal
 * @param {string} cuisine - The cuisine type of the meal
 * @returns {string|null} - The validation error message or null if valid
 */
export function validateMealInput(name, cuisine) {
    if (!name || name.trim() === "") {
        return "Meal name is required";
    }

    if (name.length > 255) {
        return "Meal name must be less than 255 characters";
    }

    if (!cuisine || cuisine.trim() === "") {
        return "Cuisine type is required";
    }

    if (cuisine.length > 255) {
        return "Cuisine type must be less than 255 characters";
    }

    return null; // No validation errors
}