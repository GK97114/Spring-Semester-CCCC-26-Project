import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealList from "../components/MealList";

vi.mock("../services/api", () => ({
    getMeals: vi.fn(),
    deleteMeal: vi.fn(),
    updateMeal: vi.fn()
}));

import { getMeals, deleteMeal, updateMeal } from "../services/api";

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
            { id: "1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" },
            { id: "2", meal_name: "Tacos", cuisine: "Mexican", eaten_on: "2026-05-10" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            expect(screen.getByText("Pizza")).toBeInTheDocument();
            expect(screen.getByText("Tacos")).toBeInTheDocument();
        });
    });

    it("renders Eaten column header", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            expect(screen.getByText("Eaten")).toBeInTheDocument();
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
            { id: "1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" },
            { id: "2", meal_name: "Tacos", cuisine: "Mexican", eaten_on: "2026-05-10" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            const deleteButtons = screen.getAllByRole("button", { name: /^Delete/ });
            expect(deleteButtons).toHaveLength(2);
        });
    });

});


// ─── DELETING MEALS ───────────────────────────────────────────────────────────

describe("MealList — deleting meals", () => {

    it("calls deleteMeal with correct id when delete button is clicked", async () => {
        getMeals.mockResolvedValue([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" }
        ]);
        deleteMeal.mockResolvedValueOnce({ success: true });

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Delete Pizza" }));

        expect(deleteMeal).toHaveBeenCalledWith("meal-1");
    });

    it("refreshes meal list after deletion", async () => {
        getMeals
            .mockResolvedValueOnce([{ id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" }])
            .mockResolvedValueOnce([]); // Empty after deletion
        deleteMeal.mockResolvedValueOnce({ success: true });

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Delete Pizza" }));

        await waitFor(() => {
            expect(screen.getByText("No meals logged yet — add one above!")).toBeInTheDocument();
        });
    });

    it("shows error message when deletion fails", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" }
        ]);
        deleteMeal.mockRejectedValueOnce(new Error("Failed to delete"));

        render(<MealList />);

        const user = userEvent.setup();

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Delete Pizza" }));

        await waitFor(() => {
            expect(screen.getByText("Failed to delete")).toBeInTheDocument();
        });
    });

});

// ─── EDITING MEALS ────────────────────────────────────────────────────────────

describe("MealList — editing meals", () => {

    it("renders an edit button for each meal", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" },
            { id: "2", meal_name: "Tacos", cuisine: "Mexican", eaten_on: "2026-05-08" }
        ]);

        render(<MealList />);

        await waitFor(() => {
            const editButtons = screen.getAllByRole("button", { name: /^Edit/ });
            expect(editButtons).toHaveLength(2);
        });
    });

    it("shows editable fields when edit button is clicked", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));

        expect(screen.getByDisplayValue("Pizza")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Italian")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2026-05-08")).toBeInTheDocument();
    });

    it("shows save and cancel buttons when editing", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));

        expect(screen.getByRole("button", { name: "Save Pizza" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel edit" })).toBeInTheDocument();
    });

    it("calls updateMeal with correct data on save", async () => {
        getMeals.mockResolvedValue([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        updateMeal.mockResolvedValueOnce({ success: true });
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));
        await user.click(screen.getByRole("button", { name: "Save Pizza" }));

        expect(updateMeal).toHaveBeenCalledWith("meal-1", {
            meal_name: "Pizza",
            cuisine: "Italian",
            eaten_on: "2026-05-08"
        });
    });

    it("exits edit mode and refreshes list after save", async () => {
        getMeals.mockResolvedValue([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        updateMeal.mockResolvedValueOnce({ success: true });
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));
        await user.click(screen.getByRole("button", { name: "Save Pizza" }));

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "Save Pizza" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Edit Pizza" })).toBeInTheDocument();
        });
    });

    it("cancels edit and restores original row", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));
        await user.click(screen.getByRole("button", { name: "Cancel edit" }));

        expect(screen.getByText("Pizza")).toBeInTheDocument();
        expect(screen.queryByDisplayValue("Pizza")).not.toBeInTheDocument();
    });

    it("shows error when updateMeal fails", async () => {
        getMeals.mockResolvedValueOnce([
            { id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-08" }
        ]);
        updateMeal.mockRejectedValueOnce(new Error("Failed to update"));
        const user = userEvent.setup();

        render(<MealList />);

        await waitFor(() => screen.getByText("Pizza"));
        await user.click(screen.getByRole("button", { name: "Edit Pizza" }));
        await user.click(screen.getByRole("button", { name: "Save Pizza" }));

        await waitFor(() => {
            expect(screen.getByText("Failed to update")).toBeInTheDocument();
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