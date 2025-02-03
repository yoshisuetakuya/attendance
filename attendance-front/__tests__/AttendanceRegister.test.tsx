import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import '@testing-library/jest-dom';
import Attendance from '@/pages/Attendance/[year]/[month]';
import AttendanceRow from "@/components/AttendanceRow";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import userEvent from "@testing-library/user-event";


jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));


describe("handleSubmit関数のテスト", () => {

  const mockPush = jest.fn();

  beforeEach(() => {
    // router.pushのモック設定
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { year: '2025', month: '1' },
    });

    window.alert = jest.fn();

    jest.spyOn(console, 'log').mockImplementation(() => { });

  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it("登録APIが呼ばれて、成功のメッセージが表示される", async () => {

    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ success: true }),
    });

    render(<Attendance />);

    // //フォームに値を入力
    // fireEvent.change(screen.getByLabelText("始業時間"), {
    //   target: { value: "09:00" },
    // });
    // fireEvent.change(screen.getByLabelText("終業時間"), {
    //   target: { value: "17:30" },
    // });
    // fireEvent.change(screen.getByLabelText("休憩＋中抜け"), {
    //   target: { value: "01:00" },
    // });

    // fireEvent.change(screen.getByLabelText("残業"), {
    //   target: { value: "00:00" },
    // });
    // fireEvent.change(screen.getByLabelText("早出"), {
    //   target: { value: "00:00" },
    // });
    // fireEvent.change(screen.getByLabelText("深夜/休出"), {
    //   target: { value: "00:00" },
    // });
    // fireEvent.change(screen.getByLabelText("摘要"), {
    //   target: { value: "有給" },
    // });
    // fireEvent.change(screen.getByLabelText("備考"), {
    //   target: { value: "メモ" },
    // });

    // 最初に取得APIが呼ばれる
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
        body: JSON.stringify([
          //   {
          //   year: "2025",
          //   month: "1",
          //   day: "1",
          //   starttime: "09:00",
          //   endtime: "17:30",
          //   breaktime: "01:00",
          //   workinghours: "07:30",
          //   summary: "",
          //   memo: "",
          // },
        ]),
      });
    });

    // 成功のメッセージが表示され画面遷移を行ったことを確認
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

    // 失敗のメッセージが表示されたことを確認
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

    // 失敗のメッセージが表示されたことを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("登録処理中にエラーが発生しました");
    });
  });

  // 入力確認
  const mockData = {
    day: 1,
    weekday: '月',
    starttime: null,
    endtime: null,
    breaktime: null,
    workinghours: null,
    earlyhours: null,
    overtimehours: null,
    nightandholidayworks: null,
    summary: '有給',
    memo: '備考',
  };

  const mockHandleChange = jest.fn();  // 変更処理をモック

  it('入力確認テスト', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AttendanceRow
          data={mockData}
          handleStartTimeChange={mockHandleChange}
          handleEndTimeChange={mockHandleChange}
          handleBreakTimeChange={mockHandleChange}
          handleWorkingHoursChange={mockHandleChange}
          handleEarlyHoursChange={mockHandleChange}
          handleOvertimeHoursChange={mockHandleChange}
          handleNightAndHolidayWorksChange={mockHandleChange}
          handleSummaryChange={mockHandleChange}
          handleMemoChange={mockHandleChange}
        />
      </LocalizationProvider>
    );

    // 始業時間の確認
    const starttime = screen.getByLabelText('始業時間');
    fireEvent.change(starttime, { target: { value: '2025-02-03T08:30:00' } });
    // expect(starttime).toBeInTheDocument();

    // 終業時間の確認
    const endtime = screen.getByLabelText('終業時間');
    fireEvent.change(endtime, { target: { value: '2025-02-03T08:30:00' } });
    // expect(endtime).toBeInTheDocument();

    // 休憩時間の確認
    const breaktime = screen.getByLabelText('休憩＋中抜け');
    fireEvent.change(breaktime, { target: { value: '2025-02-03T08:30:00' } });
    // expect(breaktime).toBeInTheDocument();

    // 所定内時間の確認
    const workinghours = screen.getByLabelText('所定内');
    fireEvent.change(workinghours, { target: { value: '2025-02-03T08:30:00' } });
    // expect(workinghours).toBeInTheDocument();

    // 早出時間の確認
    const earlyhours = screen.getByLabelText('早出');
    fireEvent.change(earlyhours, { target: { value: '2025-02-03T08:30:00' } });
    // expect(earlyhours).toBeInTheDocument();

    // 残業時間の確認
    const overtimehours = screen.getByLabelText('残業');
    fireEvent.change(overtimehours, { target: { value: '2025-02-03T08:30:00' } });
    // expect(overtimehours).toBeInTheDocument();

    // 深夜/休出時間の確認
    const nightandholidayworks = screen.getByLabelText('深夜/休出');
    fireEvent.change(nightandholidayworks, { target: { value: '2025-02-03T08:30:00' } });
    // expect(nightandholidayworks).toBeInTheDocument();

    // 摘要の選択確認
    // 摘要のセレクトボックスを取得
    const summarySelect = screen.getByTestId('summary');

    // 期待する値を選択する
    // userEvent.selectOptions(summarySelect, '有給');

    // 期待する値が選択されたかを検証
    // expect(summarySelect).toHaveValue('有給');
    // expect(summary).toHaveTextContent('摘要');

    // 備考の入力確認
    // const memo = screen.getByTestId("memo");
    // fireEvent.change(memo, { target: { value: '代休' } });
    // expect(memo).toHaveTextContent('備考');
  });

});
