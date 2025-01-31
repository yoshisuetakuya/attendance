import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/Login";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("ログインコンポーネントのテスト", () => {
  it("ログインに成功時し、月別表示画面に画面遷移する", async () => {
    const pushMock = useRouter().push as jest.Mock;

    // APIのモック
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        status: 200, // ステータスコードを200に設定
        json: () => Promise.resolve({ success: true }),
      });
    }) as jest.Mock;

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
      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: "user@example.com",  // メールアドレスを含める
          password: "password",       // パスワードを含める
        }),
        credentials: "include",
      });

      expect(pushMock).toHaveBeenCalledWith("/MonthlyList");
    });
  });

  it("ログインに失敗した場合、エラーメッセージが表示される", async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      });
    }) as jest.Mock;

    render(<Login />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    await waitFor(() => {
      const errorMessages = screen.getAllByText("メールアドレスまたはパスワードが違います");
      expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    });
  });


  it("ログイン時にネットワークエラーが発生した場合、エラーメッセージが表示される", async () => {
    global.fetch = jest.fn(() => Promise.reject("Network Error")) as jest.Mock;

    render(<Login />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(screen.getByText("ログインに失敗しました")).toBeInTheDocument();
    });
  });
});
