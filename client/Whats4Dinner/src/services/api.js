const API_DEV_BASE_URL = "http://localhost:5000/api";

/**
 * Makes a request to the API endpoint.
 * @param {string} path is the API endpoint path
 * @param {Object} options is an object containing fetch options
 * @returns the JSON response from the API if successful
 * @throws an error if the request fails
 */
async function request(path, options = {}) {
    // Make the API request using fetch, and include any headers from options
    const res = await fetch (`${API_DEV_BASE_URL}${path}`, {
        credentials: "include", // Include cookies for session management
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    let jsonData;
    try {
        jsonData = await res.json();
    } catch {
        jsonData = null;
    }

    // If the response is not OK, throw an error with the message from the API (if available)
    if (!res.ok) {
        const error = new Error(jsonData?.message || "API request failed");
        error.status = res.status;
        error.data = jsonData;
        throw error;
    }

    return jsonData;
}

/**
 * Pings the server to check if the user session is valid and initializes it if necessary.
 * @returns the user session data if successful
 * @throws an error if the request fails, which can be used to determine if the user is not logged in or if there was a server issue.
 */
export async function initSession() {
    return request("/users/session", {
        method: "GET",
    });
}

/**
 * Fetches a list of all meals.
 * @returns the list of meals if successful
 * @throws an error if the request fails.
 */
export async function getMeals() {
    return request("/meals");
}

/**
 * Creates a new meal.
 * @param {JSON} mealData is an object containing the meal information to be created, such as { name: "Spaghetti", ingredients: ["pasta", "tomato sauce"] }
 * @returns the created meal if successful
 * @throws an error if the request fails.
 */
export async function createMeal(mealData) {
    return request("/meals", {
        method: "POST",
        body: JSON.stringify(mealData),
    });
}

/**
 * Deletes a meal.
 * @param {string} mealId is the ID of the meal to be deleted
 * @returns the deleted meal if successful
 * @throws an error if the request fails.
 */
export async function deleteMeal(mealId) {
    return request(`/meals/${mealId}`, {
        method: "DELETE",
    });
}

/**
 * Fetches recommended meals based on a list of meal IDs.
 * @param {string[]} mealIds is an array of meal IDs for which to fetch recommendations
 * @returns the list of recommended meals if successful
 * @throws an error if the request fails.
 */
export async function getRecommendations(mealIds) {
    return request("/recommendations");
}