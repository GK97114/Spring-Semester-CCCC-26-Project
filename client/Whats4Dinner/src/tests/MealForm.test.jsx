import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealForm from "../components/MealForm";
import { getToday } from "../utils/getToday";

// Mock the api module so no real fetch calls happen
vi.mock("../services/api", () => ({
    createMeal: vi.fn()
}));

import { createMeal } from "../services/api";

beforeEach(() => {
    vi.clearAllMocks();
});


// ─── RENDERING ────────────────────────────────────────────────────────────────

describe("MealForm — rendering", () => {

    it("renders the form with meal name input, cuisine select, and submit button", () => {
        render(<MealForm />);

        expect(screen.getByPlaceholderText("e.g. Chicken tikka masala")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add meal" })).toBeInTheDocument();
    });

    it("renders all cuisine options in the dropdown", () => {
        render(<MealForm />);

        expect(screen.getByRole("option", { name: "American" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Barbeque" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Chinese" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Fish" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "German" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Indian" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Italian" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Japanese" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Mediterranean" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Mexican" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Other" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Seafood" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Tex-Mex" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Thai" })).toBeInTheDocument();
    });

    it("renders date input defaulting to today", () => {
        render(<MealForm />);

        const dateInput = screen.getByLabelText("Date eaten");
        expect(dateInput).toBeInTheDocument();
        expect(dateInput.value).toBe(getToday());
    });

    it("renders with empty fields by default", () => {
        render(<MealForm />);

        expect(screen.getByPlaceholderText("e.g. Chicken tikka masala").value).toBe("");
        expect(screen.getByRole("combobox").value).toBe("");
        expect(screen.getByLabelText("Date eaten").value).toBe(getToday());
    });

});


// ─── SUCCESSFUL SUBMISSION ────────────────────────────────────────────────────

describe("MealForm — successful submission", () => {

    it("calls createMeal with correct data on submit", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        expect(createMeal).toHaveBeenCalledWith({ meal_name: "Pizza", cuisine: "Italian", eaten_on: expect.any(String) });
    });

    it("shows success message after meal is created", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        await waitFor(() => {
            expect(screen.getByText("Meal added successfully!")).toBeInTheDocument();
        });
    });

    it("clears form fields after successful submission", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        await waitFor(() => {
            expect(screen.getByPlaceholderText("e.g. Chicken tikka masala").value).toBe("");
            expect(screen.getByRole("combobox").value).toBe("");
            expect(screen.getByLabelText("Date eaten").value).toBe(getToday());
        });
    });

    it("calls onMealCreated callback after successful submission", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian", eaten_on: "2026-05-09" });
        const onMealCreated = vi.fn();

        render(<MealForm onMealCreated={onMealCreated} />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        await waitFor(() => {
            expect(onMealCreated).toHaveBeenCalledOnce();
        });
    });

});


// ─── FAILED SUBMISSION ────────────────────────────────────────────────────────

describe("MealForm — failed submission", () => {

    it("shows error message when createMeal throws", async () => {
        createMeal.mockRejectedValueOnce(new Error("API request failed"));

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        await waitFor(() => {
            expect(screen.getByText("API request failed")).toBeInTheDocument();
        });
    });

    it("does not call onMealCreated when createMeal throws", async () => {
        createMeal.mockRejectedValueOnce(new Error("API request failed"));
        const onMealCreated = vi.fn();

        render(<MealForm onMealCreated={onMealCreated} />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("e.g. Chicken tikka masala"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add meal" }));

        await waitFor(() => {
            expect(onMealCreated).not.toHaveBeenCalled();
        });
    });

});