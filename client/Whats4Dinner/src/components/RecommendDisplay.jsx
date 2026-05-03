import { useState } from "react";
import { getRecommendations } from "../services/api";

/**
 * A component for displaying recommended meals based on the user's meal history.
 * @returns the RecommendationDisplay component, which includes a button to fetch recommendations and displays the list of recommended meals.
 * @throws an error if the recommendation fetch fails, which is displayed to the user.
 */
function RecommendationDisplay() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGetRecommendations() {
        try {
            setLoading(true);
            setError("");

            const data = await getRecommendations();

            // supports both { recommendations: [...] } and [...] response formats
            setRecommendations(data.recommendations || data);
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
            setError(err.message || "Failed to fetch recommendations");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="recommendation-display">
            <h2>Here's what we recommend!</h2>

            <button onClick={handleGetRecommendations} disabled={loading}>
                {loading ? "Thinking..." : "Get Recommendations"}
            </button>

            {error && <p className="error">{error}</p>}

            {recommendations.length > 0 && (
                <ul>
                    {recommendations.map((rec, index) => {
                        // Case 1: Backend returned plain strings
                        if (typeof rec === "string") {
                            return <li key={index}>{rec}</li>;
                        }

                        // Case 2: Backend returned objects
                        return (
                            <li key={index}>
                                <strong>{rec.cuisine}</strong>
                                {rec.reason ? ` - ${rec.reason}` : ""}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default RecommendationDisplay;