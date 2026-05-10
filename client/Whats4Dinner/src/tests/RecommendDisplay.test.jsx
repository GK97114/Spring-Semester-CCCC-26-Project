import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecommendationDisplay from "../components/RecommendDisplay";

vi.mock("../services/api", () => ({
    getRecommendations: vi.fn()
}));

import { getRecommendations } from "../services/api";

beforeEach(() => {
    vi.clearAllMocks();
});


// ─── RENDERING ────────────────────────────────────────────────────────────────

describe("RecommendationDisplay — rendering", () => {

    it("renders the get recommendations button", () => {
        render(<RecommendationDisplay />);

        expect(screen.getByRole("button", { name: "✨ Get Recommendations" })).toBeInTheDocument();
    });

    it("renders no recommendations by default", () => {
        render(<RecommendationDisplay />);

        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

});


// ─── LOADING STATE ────────────────────────────────────────────────────────────

describe("RecommendationDisplay — loading state", () => {

    it("shows thinking state and disables button while loading", async () => {
        getRecommendations.mockReturnValueOnce(new Promise(() => {}));

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        expect(screen.getByRole("button", { name: "Thinking..." })).toBeDisabled();
    });

});


// ─── STRING RECOMMENDATIONS ───────────────────────────────────────────────────

describe("RecommendationDisplay — string recommendations", () => {

    it("renders plain string recommendations", async () => {
        getRecommendations.mockResolvedValueOnce({
            recommendations: ["Italian", "Mexican", "Japanese"]
        });

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        await waitFor(() => {
            expect(screen.getByText("Italian")).toBeInTheDocument();
            expect(screen.getByText("Mexican")).toBeInTheDocument();
            expect(screen.getByText("Japanese")).toBeInTheDocument();
        });
    });

});


// ─── OBJECT RECOMMENDATIONS ───────────────────────────────────────────────────

describe("RecommendationDisplay — object recommendations", () => {

    it("renders cuisine and reason from object recommendations", async () => {
        getRecommendations.mockResolvedValueOnce({
            recommendations: [
                { cuisine: "Italian", reason: "You haven't tried this cuisine yet, give it a try!" },
                { cuisine: "Mexican", reason: "You've only had this cuisine recently" }
            ]
        });

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        await waitFor(() => {
            expect(screen.getByText(/Italian/)).toBeInTheDocument();
            expect(screen.getByText(/You haven't tried this cuisine yet/)).toBeInTheDocument();
            expect(screen.getByText(/Mexican/)).toBeInTheDocument();
        });
    });

    it("renders cuisine without reason if reason is absent", async () => {
        getRecommendations.mockResolvedValueOnce({
            recommendations: [{ cuisine: "Italian" }]
        });

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        await waitFor(() => {
            expect(screen.getByText("Italian")).toBeInTheDocument();
        });
    });

});


// ─── ERROR HANDLING ───────────────────────────────────────────────────────────

describe("RecommendationDisplay — error handling", () => {

    it("shows error message when getRecommendations throws", async () => {
        getRecommendations.mockRejectedValueOnce(new Error("Failed to fetch recommendations"));

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        await waitFor(() => {
            expect(screen.getByText("Failed to fetch recommendations")).toBeInTheDocument();
        });
    });

    it("re-enables button after error", async () => {
        getRecommendations.mockRejectedValueOnce(new Error("Failed to fetch recommendations"));

        render(<RecommendationDisplay />);

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "✨ Get Recommendations" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "✨ Get Recommendations" })).not.toBeDisabled();
        });
    });

});