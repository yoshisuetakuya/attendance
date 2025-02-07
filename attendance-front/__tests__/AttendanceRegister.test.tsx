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

describe("勤怠登録画面のテスト", () => {

  const mockPush = jest.fn();

  beforeEach(() => {
    // router.pushのモック設定
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: { year: '2025', month: '1' },
    });
    window.alert = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("入力を行い登録APIが呼ばれて、成功のメッセージが表示される", async () => {

    const mockData = {
      day: 3,
      weekday: '月',
      starttime: null,
      endtime: null,
      breaktime: null,
      workinghours: null,
      earlyhours: null,
      overtimehours: null,
      nightandholidayworks: null,
      summary: '',
      memo: '',
    };

    const mockHandleChange = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ success: true }),
    });

    render(
      <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Attendance />
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
            handleMemoChange={mockHandleChange} />
        </LocalizationProvider>
      </>
    );

    // 始業時間の確認
    const starttime = screen.getByTestId('starttime');
    const startInput = starttime.querySelector('input') as HTMLInputElement;
    await userEvent.type(startInput, '09:00 AM');
    expect(startInput).toHaveValue('09:00 AM');

    // 終業時間の確認
    const endtime = screen.getByTestId('endtime');
    const endtimeInput = endtime.querySelector('input') as HTMLInputElement;
    await userEvent.type(endtimeInput, '05:00 PM');
    expect(endtimeInput).toHaveValue('05:00 PM');

    // 休憩＋中抜けの確認
    const breaktime = screen.getByTestId('breaktime');
    const breaktimeInput = breaktime.querySelector('input') as HTMLInputElement;
    await userEvent.type(breaktimeInput, '12:00 AM');
    expect(breaktimeInput).toHaveValue('12:00 AM');

    // 所定内の確認
    const workinghours = screen.getByTestId('workinghours');
    const workinghoursInput = workinghours.querySelector('input') as HTMLInputElement;
    await userEvent.type(workinghoursInput, '12:00 AM');
    expect(workinghoursInput).toHaveValue('12:00 AM');

    // 早出の確認
    const earlyhours = screen.getByTestId('earlyhours');
    const earlyhoursInput = earlyhours.querySelector('input') as HTMLInputElement;
    await userEvent.type(earlyhoursInput, '12:00 AM');
    expect(earlyhoursInput).toHaveValue('12:00 AM');

    // 残業の確認
    const overtimehours = screen.getByTestId('overtimehours');
    const overtimehoursInput = overtimehours.querySelector('input') as HTMLInputElement;
    await userEvent.type(overtimehoursInput, '12:00 AM');
    expect(overtimehoursInput).toHaveValue('12:00 AM');

    // 深夜/休出の確認
    const nightandholidayworks = screen.getByTestId('nightandholidayworks');
    const nightandholidayworksInput = nightandholidayworks.querySelector('input') as HTMLInputElement;
    await userEvent.type(nightandholidayworksInput, '12:00 AM');
    expect(nightandholidayworksInput).toHaveValue('12:00 AM');

    // 摘要要素の確認
    const summary = screen.getByTestId('summary');
    // セレクトボックスの要素取得とクリック
    const selectButton = summary.querySelector('listbox');
    if (selectButton) {
      await userEvent.click(selectButton);
      await waitFor(() => {
        expect(screen.getByText("有給")).toBeInTheDocument();
      });
      // 「有給」を選択
      const menuItem = await screen.findByRole('option', { name: '有給' });
      await userEvent.click(menuItem);
      // 「有給」の選択確認
      const selectedOption = await screen.findByText('有給');
      expect(selectedOption).toBeInTheDocument();
    }

    // 備考欄の確認
    const memoInput = screen.getByTestId('memo').querySelector('textarea');
    if (memoInput) {
      await userEvent.type(memoInput, 'メモ');
    };
    // "メモ" という文字列が入力されていることを確認
    await waitFor(() => {
      expect(screen.findByDisplayValue('メモ')).resolves.toBeInTheDocument();
    });

    // 登録ボタンクリック
    fireEvent.click(screen.getByText("登録"));

    // 次に登録APIが呼ばれることを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        "credentials": "include",
        body: JSON.stringify([
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

});
