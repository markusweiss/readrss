import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import FeedBox from "../components/FeedBox/FeedBox";

describe("<FeedBox />", () => {
    beforeEach(() => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({ items: [] }),
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Render FeedBox", () => {
        const wrapper = render(
            <FeedBox
                handleChange={undefined}
                handleKeyDown={undefined}
                handleUri={() => {}}
                defaultText={""}
            />,
        );
        expect(wrapper).toBeTruthy();
    });
});
