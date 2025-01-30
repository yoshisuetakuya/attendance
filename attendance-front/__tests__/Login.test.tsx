import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/Login";
import "@testing-library/jest-dom"; // 追加
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("Login Component", () => {
  it("ログイン成功時に月別表示画面に画面遷移する", async () => {
    const pushMock = useRouter().push as jest.Mock;

    // APIのモック
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200, // ステータスコードを200に設定
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<Login />);

    // フォームに入力
    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password" },
    });

    // ログインボタンをクリック
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    // 非同期処理が完了するのを待つ
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/MonthlyList");
    });
  });
});
