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
        <div className="section-card">
            <h2>What should I eat?</h2>

            <button
                className="btn-recommend"
                onClick={handleGetRecommendations}
                disabled={loading}
            >
                {loading ? "Thinking..." : "✨ Get recommendations"}
            </button>

            {error && <p className="msg-error">{error}</p>}

            {recommendations.length > 0 && (
                <ul className="rec-list">
                    {recommendations.map((rec, index) => (
                        <li key={index} className="rec-item">
                            <div className="rec-number">{index + 1}</div>
                            <div>
                                {typeof rec === "string" ? (
                                    <p className="rec-cuisine">{rec}</p>
                                ) : (
                                    <>
                                        <p className="rec-cuisine">{rec.cuisine}</p>
                                        {rec.reason && (
                                            <p className="rec-reason">{rec.reason}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RecommendationDisplay;