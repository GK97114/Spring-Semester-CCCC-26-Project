/**
 * Returns today's date in YYYY-MM-DD format using local time.
 * Uses local time methods instead of toISOString() to avoid UTC offset issues.
 * @returns {string} today's date as "YYYY-MM-DD"
 */
export function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}