/**
 * Comonent to display a list of meals.
 * Currently uses mock data, but can be updated to fetch real data from the backend.
 * @returns a JSX element representing the meal list.
 */
function MealList() {
    // Mock data for meals - replace with actual data fetching logic
    const meals = [
        "Spaghetti Bolognese",
        "Chicken Alfredo",
        "Vegetable Stir Fry",
        "Beef Tacos",
        "Grilled Salmon"
    ];

    return (
        <div className="card">
            <h2>Recent Meals</h2>
            <ul>
                {meals.map((m, index) => (
                    <li key={index}>{m}</li>
                ))}
            </ul>
        </div>
    );
}
export default MealList;