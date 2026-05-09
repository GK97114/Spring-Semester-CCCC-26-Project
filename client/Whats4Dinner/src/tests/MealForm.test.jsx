import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealForm from "../components/MealForm";

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

        expect(screen.getByPlaceholderText("Meal Name")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Meal" })).toBeInTheDocument();
    });

    it("renders all cuisine options in the dropdown", () => {
        render(<MealForm />);

        expect(screen.getByRole("option", { name: "Italian" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Mexican" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Japanese" })).toBeInTheDocument();
    });

    it("renders with empty fields by default", () => {
        render(<MealForm />);

        expect(screen.getByPlaceholderText("Meal Name").value).toBe("");
        expect(screen.getByRole("combobox").value).toBe("");
    });

});


// ─── SUCCESSFUL SUBMISSION ────────────────────────────────────────────────────

describe("MealForm — successful submission", () => {

    it("calls createMeal with correct data on submit", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

        expect(createMeal).toHaveBeenCalledWith({ meal_name: "Pizza", cuisine: "Italian" });
    });

    it("shows success message after meal is created", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

        await waitFor(() => {
            expect(screen.getByText("Meal added successfully!")).toBeInTheDocument();
        });
    });

    it("clears form fields after successful submission", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian" });

        render(<MealForm />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

        await waitFor(() => {
            expect(screen.getByPlaceholderText("Meal Name").value).toBe("");
            expect(screen.getByRole("combobox").value).toBe("");
        });
    });

    it("calls onMealCreated callback after successful submission", async () => {
        createMeal.mockResolvedValueOnce({ id: "meal-1", meal_name: "Pizza", cuisine: "Italian" });

        render(<MealForm onMealCreated={onMealCreated} />);

        const onMealCreated = vi.fn();
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

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

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

        await waitFor(() => {
            expect(screen.getByText("API request failed")).toBeInTheDocument();
        });
    });

    it("does not call onMealCreated when createMeal throws", async () => {
        createMeal.mockRejectedValueOnce(new Error("API request failed"));

        render(<MealForm onMealCreated={onMealCreated} />);

        const onMealCreated = vi.fn();
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Meal Name"), "Pizza");
        await user.selectOptions(screen.getByRole("combobox"), "Italian");
        await user.click(screen.getByRole("button", { name: "Add Meal" }));

        await waitFor(() => {
            expect(onMealCreated).not.toHaveBeenCalled();
        });
    });

});