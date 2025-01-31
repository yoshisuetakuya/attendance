import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordUpdate from "@/components/PasswordUpdate";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("PasswordUpdateコンポーネントのテスト", () => {
    const mockOnClose = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });

    afterEach(() => {
        jest.clearAllMocks(); // モックをクリア
    });

    it("正しいパスワードを入力時に、パスワード更新APIが呼ばれ成功する", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: async () => ({ success: true }),
        }) as jest.Mock;
        global.alert = jest.fn(); // alertのモック
        render(
            <PasswordUpdate open={true} onClose={mockOnClose} />
        );

        // フォームに入力
        fireEvent.change(screen.getByLabelText("現在のパスワード"), {
            target: { value: "currentPassword" },
        });
        fireEvent.change(screen.getByLabelText("新しいパスワード"), {
            target: { value: "newPassword123" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:8080/updatePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: "currentPassword",
                    newPassword: "newPassword123",
                }),
                "credentials": "include",
            });
        });
    });

    it("パスワード更新成功時に成功メッセージを表示しダイアログを閉じる", async () => {
        render(
            <PasswordUpdate open={true} onClose={mockOnClose} />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("現在のパスワード"), {
            target: { value: "currentPassword" },
        });
        fireEvent.change(screen.getByLabelText("新しいパスワード"), {
            target: { value: "newPassword123" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("パスワードの変更に成功しました");
            expect(mockOnClose).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith("/Login");
        });
    });

    it("現在のパスワードが違う場合、エラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 404,
        });

        render(
            <PasswordUpdate open={true} onClose={mockOnClose} />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("現在のパスワード"), {
            target: { value: "wrongPassword" },
        });
        fireEvent.change(screen.getByLabelText("新しいパスワード"), {
            target: { value: "newPassword123" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("現在のパスワードが違います");
        });
    });

    it("パスワード更新失敗時にエラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 500,
        });

        render(
            <PasswordUpdate open={true} onClose={mockOnClose} />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("現在のパスワード"), {
            target: { value: "currentPassword" },
        });
        fireEvent.change(screen.getByLabelText("新しいパスワード"), {
            target: { value: "newPassword123" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("パスワードの変更に失敗しました");
        });
    });

    it("パスワード変更中にエラーが発生した場合、エラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

        render(
            <PasswordUpdate open={true} onClose={mockOnClose} />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("現在のパスワード"), {
            target: { value: "currentPassword" },
        });
        fireEvent.change(screen.getByLabelText("新しいパスワード"), {
            target: { value: "newPassword123" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("パスワードの変更中にエラーが発生しました");
        });
    });
});
