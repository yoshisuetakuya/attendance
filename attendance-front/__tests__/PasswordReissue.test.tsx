import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordReissue from "@/components/PasswordReissue";
import "@testing-library/jest-dom";

describe("PasswordReissueコンポーネントのテスト", () => {
    const mockOnClose = jest.fn();

    afterEach(() => {
        jest.clearAllMocks(); // モックをクリア
    });

    it("正しいメールアドレスを入力した場合、パスワード再発行APIが呼ばれ成功する", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: async () => ({ success: true }),
        }) as jest.Mock;
        global.alert = jest.fn(); // alertのモック
        render(<PasswordReissue open={true} onClose={mockOnClose} />);

        // メールアドレスを入力
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:8080/reissue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: "user@example.com",
                }),
            });
        });
    });

    it("無効なメールアドレスの場合、エラーメッセージが表示される", async () => {
        render(<PasswordReissue open={true} onClose={mockOnClose} />);

        // 無効なメールアドレスを入力
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "invalid-email" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        // エラーメッセージが表示されることを確認
        await waitFor(() => {
            expect(screen.getByText("無効なメールアドレス形式です")).toBeInTheDocument();
        });
    });

    it("パスワード再発行成功時に成功メッセージを表示しダイアログを閉じる", async () => {
        render(<PasswordReissue open={true} onClose={mockOnClose} />);

        // メールアドレスを入力
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("パスワードを再発行しました");
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("メールアドレスが見つからない場合、エラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            status: 404,
            json: async () => ({ success: false }),
        });

        render(<PasswordReissue open={true} onClose={mockOnClose} />);

        // メールアドレスを入力
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "nonexistent@example.com" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("メールアドレスが見つかりませんでした");
        });
    });

    it("パスワード再発行処理に失敗した場合、エラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          status: 500,
          json: async () => ({ success: false }),
        });
    
        render(<PasswordReissue open={true} onClose={mockOnClose} />);
    
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
          target: { value: "user@example.com" },
        });
    
        fireEvent.click(screen.getByRole("button", { name: "送信" }));
    
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith("パスワードの再発行処理に失敗しました");
        });
      });

    it("APIエラー時にエラーメッセージを表示する", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("APIエラー"));

        render(<PasswordReissue open={true} onClose={mockOnClose} />);

        // メールアドレスを入力
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "user@example.com" },
        });

        // 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("パスワードの再発行処理中にエラーが発生しました");
        });
    });
});
