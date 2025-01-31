import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MonthlyList from "@/pages/MonthlyList";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// モックを設定
jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("MonthlyListコンポーネントのテスト", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        // useRouterのmockを設定
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        // モックのクリア
        jest.clearAllMocks();
    });

    it("ログアウトに成功して、ログイン画面に遷移する", async () => {
        // APIのモック
        global.fetch = jest.fn(() =>
            Promise.resolve({
                status: 200, // ステータスコード200（成功）を設定
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;
        render(<MonthlyList />);

        // ログアウトボタンをクリック
        fireEvent.click(screen.getByText("ログアウト"));

        // ログアウトAPI呼び出し後に、Loginページへリダイレクトされることを確認
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/Login");
        });
    });
});
