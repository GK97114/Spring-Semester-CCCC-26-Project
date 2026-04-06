/**
 * Component to display the recommended meal suggestion
 * Currently uses a static suggestion, but can be updated to fetch dynamic suggestions from the backend.
 * @returns JSX element representing the recommendation display
 */
function RecommendationDisplay() {
    return (
        <div className="card">
            <h2>Tonight's Suggestion</h2>
            <p>Try something different: Thai Food!</p>
            <button>What's for Dinner?</button>
        </div>
    );
}
export default RecommendationDisplay;