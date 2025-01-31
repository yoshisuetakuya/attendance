import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateNewUser from "@/components/CreateNewUser";
import "@testing-library/jest-dom";

describe("CreateNewUserコンポーネントのテスト", () => {
    const mockOnClose = jest.fn();
    const mockHandleClickShowPassword = jest.fn();

    afterEach(() => {
        jest.clearAllMocks(); // モックをクリア
    });

    it("正しいデータ入力時に、新規登録APIが呼ばれ成功する", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: async () => ({ success: true }),
        }) as jest.MockedFunction<typeof fetch>;
        global.alert = jest.fn(); // alertのモック
        render(
            <CreateNewUser
                open={true}
                onClose={mockOnClose}
                showPassword={false}
                handleClickShowPassword={mockHandleClickShowPassword}
            />
        );

        // フォームに入力
        fireEvent.change(screen.getByLabelText("名前"), {
            target: { value: "テスト" },
        });
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("パスワード"), {
            target: { value: "password" },
        });

        // 登録ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "登録" }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:8080/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "テスト",
                    email: "user@example.com",
                    password: "password",
                }),
            });
        });
    });

    it("登録成功時に成功メッセージを表示しダイアログを閉じる", async () => {
        render(
            <CreateNewUser
                open={true}
                onClose={mockOnClose}
                showPassword={false}
                handleClickShowPassword={mockHandleClickShowPassword}
            />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("名前"), {
            target: { value: "テスト" },
        });
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("パスワード"), {
            target: { value: "password" },
        });

        // 登録ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "登録" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("登録に成功しました");
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("APIのレスポンスが409の場合、メールアドレスがすでに登録されているエラーメッセージを表示する", async () => {
        // fetchのモックを設定
        global.fetch = jest.fn().mockResolvedValueOnce({
            status: 409,
            json: async () => ({ success: false, message: "このメールアドレスはすでに登録されています" }),
        });

        render(
            <CreateNewUser
                open={true}
                onClose={mockOnClose}
                showPassword={false}
                handleClickShowPassword={mockHandleClickShowPassword}
            />
        );

        // フォームに入力
        fireEvent.change(screen.getByLabelText("名前"), { target: { value: "テスト" } });
        fireEvent.change(screen.getByLabelText("メールアドレス"), { target: { value: "user@example.com" } });
        fireEvent.change(screen.getByLabelText("パスワード"), { target: { value: "password123" } });

        // 登録ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "登録" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("このメールアドレスはすでに登録されています");
        });
    });

    it("ユーザー登録に失敗した場合にエラーメッセージを表示する", async () => {
        // fetchのモックを設定 (失敗シナリオ)
        global.fetch = jest.fn().mockResolvedValueOnce({
            status: 500,
            json: async () => ({ success: false }),
        });

        global.alert = jest.fn(); // alertのモック

        render(
            <CreateNewUser
                open={true}
                onClose={mockOnClose}
                showPassword={false}
                handleClickShowPassword={mockHandleClickShowPassword}
            />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("名前"), {
            target: { value: "テスト" },
        });
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("パスワード"), {
            target: { value: "password123" },
        });

        // 登録ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "登録" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("ユーザー登録に失敗しました");
        });
    });

    it("ユーザー登録中にエラーが発生した場合にエラーメッセージを表示する", async () => {
        // fetchのモックを設定
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"));
        global.alert = jest.fn(); // alertのモック

        render(
            <CreateNewUser
                open={true}
                onClose={mockOnClose}
                showPassword={false}
                handleClickShowPassword={mockHandleClickShowPassword}
            />
        );

        // データ入力
        fireEvent.change(screen.getByLabelText("名前"), {
            target: { value: "テスト" },
        });
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("パスワード"), {
            target: { value: "password123" },
        });

        // 登録ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "登録" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("ユーザー登録中にエラーが発生しました");
        });
    });

});
