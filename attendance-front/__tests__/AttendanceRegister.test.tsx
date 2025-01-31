import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import '@testing-library/jest-dom';
import Attendance from '@/pages/Attendance/[year]/[month]';

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("handleSubmit関数のテスト", () => {
  // グローバルモック
  const mockPush = jest.fn();

  beforeEach(() => {
    // router.pushのモック設定
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { year: '2025', month: '1' },
    });

    // alertモック
    window.alert = jest.fn();

    jest.spyOn(console, 'log').mockImplementation(() => { });

    // fetchモック
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve([
          {
            day: 1,
            startTime: "9:00",
            endTime: "17:30",
            breakTime: "1:00",
            workingHours: "7:30",
            earlyHours: "0:00",
            overtimeHours: "0:00",
            nightAndHolidayWorks: "0:00",
            summary: "有給",
            memo: "test",
          },
        ]),
    }) as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("登録APIが呼ばれて、成功のメッセージが表示される", async () => {

    render(<Attendance />);

    // 最初に取得APIが呼ばれることを確認
    expect(global.fetch).toHaveBeenNthCalledWith(1, "http://localhost:8080/getAttendance/2025/1", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      "credentials": "include",
    });

    // 登録ボタンクリック
    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    // 次に登録APIが呼ばれることを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(2, "http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        "credentials": "include",
        body: JSON.stringify([]),
      });
    });

    // alertとrouter.pushが正しく呼ばれたことを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("登録が成功しました");
      expect(mockPush).toHaveBeenCalledWith("/MonthlyList");
    });
  });

  it("登録処理に失敗した場合、失敗のメッセージが表示される", async () => {
    // fetchモックを失敗させる
    global.fetch = jest.fn().mockResolvedValue({
      status: 500, // 失敗のステータスコード
    }) as jest.MockedFunction<typeof fetch>;

    render(<Attendance />);

    // 登録ボタンクリック
    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    // alertが正しく呼ばれたことを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("登録処理に失敗しました");
    });
  });

  it("登録処理中にエラーが発生した場合、失敗のメッセージが表示される", async () => {
    // fetchモックをエラーにする
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error")) as jest.MockedFunction<typeof fetch>;

    render(<Attendance />);

    // 登録ボタンクリック
    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    // alertが正しく呼ばれたことを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("登録処理中にエラーが発生しました");
    });
  });
  
});
