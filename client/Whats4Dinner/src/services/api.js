const API_DEV_BASE_URL = "http://localhost:5000/api";

// --- Core Fetch Wrapper ---
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

// --- USERS ---
export async function initSession() {
    return request("/users/session", {
        method: "GET",
    });
}

// --- MEALS ---
export async function getMeals() {
    return request("/meals");
}

export async function createMeal(mealData) {
    return request("/meals", {
        method: "POST",
        body: JSON.stringify(mealData),
    });
}

export async function deleteMeal(mealId) {
    return request(`/meals/${mealId}`, {
        method: "DELETE",
    });
}

// --- RECOMMENDATIONS ---
export async function getRecommendations(mealIds) {
    return request("/recommendations");
}