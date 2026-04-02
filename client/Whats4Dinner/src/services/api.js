/**
 * Fetches a test message from the API.
 * @returns {Promise<Object>} The test message data.
 * @throws {Error} If the fetch request fails.
 */
export async function fetchTestMessage() {
    const response = await fetch("http://localhost:5000/api/test");
    if (!response.ok) {
        throw new Error("Failed to fetch test message");
    }
    return response.json();
}