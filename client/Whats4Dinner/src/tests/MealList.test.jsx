import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealList from "../components/MealList";

vi.mock("../services/api", () => ({
    getMeals: vi.fn(),
    deleteMeal: vi.fn()
}));

import { getMeals, deleteMeal } from "../services/api";

beforeEach(() => {
    vi.clearAllMocks();
});


// ─── LOADING STATE ────────────────────────────────────────────────────────────

describe("MealList — loading state", () => {

    it("shows loading message while meals are being fetched", () => {
        // Never resolves — keeps component in loading state
        getMeals.mockReturnValueOnce(new Promise(() => {}));

        render(<MealList />);

        expect(screen.getByText("Loading meals...")).toBeInTheDocument();
    });

});


// ─── RENDERING MEALS ──────────────────────────────────────────────────────────

describe("MealList — rendering meals", () => {

    it("renders a list of meals after loading", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "1", meal_name: "Pizza", cuisine: "Italian" },
            { id: "2", meal_name: "Tacos", cuisine: "Mexican" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            expect(screen.getByText("Pizza")).toBeInTheDocument();
            expect(screen.getByText("Tacos")).toBeInTheDocument();
        });
    });

    it("shows empty state message when no meals exist", async () => {
        getMeals.mockResolvedValueOnce([]);

        render(<MealList />);

        await waitFor(() => {
            expect(screen.getByText("No meals logged yet — add one above!")).toBeInTheDocument();
        });
    });

    it("renders a delete button for each meal", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "1", meal_name: "Pizza", cuisine: "Italian" },
            { id: "2", meal_name: "Tacos", cuisine: "Mexican" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            const deleteButtons = screen.getAllByRole("btn-delete", { name: "/^Delete/" });
            expect(deleteButtons).toHaveLength(2);
        });
    });

});


// ─── DELETING MEALS ───────────────────────────────────────────────────────────

describe("MealList — deleting meals", () => {

    it("calls deleteMeal with correct id when delete button is clicked", async () => {
        getMeals.mockResolvedValue([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian" }
        ]);
        deleteMeal.mockResolvedValueOnce({ success: true });

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("btn-delete", { name: "Delete Pizza" }));

        expect(deleteMeal).toHaveBeenCalledWith("meal-1");
    });

    it("refreshes meal list after deletion", async () => {
        getMeals
            .mockResolvedValueOnce([{ id: "meal-1", meal_name: "Pizza", cuisine: "Italian" }])
            .mockResolvedValueOnce([]); // Empty after deletion
        deleteMeal.mockResolvedValueOnce({ success: true });

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("btn-delete", { name: "Delete Pizza" }));

        await waitFor(() => {
            expect(screen.getByText("No meals logged yet — add one above!")).toBeInTheDocument();
        });
    });

    it("shows error message when deletion fails", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian" }
        ]);
        deleteMeal.mockRejectedValueOnce(new Error("Failed to delete"));

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("btn-delete", { name: "Delete Pizza" }));

        await waitFor(() => {
            expect(screen.getByText("Failed to delete")).toBeInTheDocument();
        });
    });

});


// ─── ERROR HANDLING ───────────────────────────────────────────────────────────

describe("MealList — error handling", () => {

    it("shows error message when getMeals throws", async () => {
        getMeals.mockRejectedValueOnce(new Error("Failed to load meals"));

        render(<MealList />);

        await waitFor(() => {
            expect(screen.getByText("Failed to load meals")).toBeInTheDocument();
        });
    });

});