/**
 * Function to format the date and time of a meal creation
 * @param {dateString} dateString is the date in string form 
 * @returns a formatted date
 */
export function formatDate(dateString) {
    // Handle both "YYYY-MM-DD" and full ISO timestamp "YYYY-MM-DDT..."
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = today - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}