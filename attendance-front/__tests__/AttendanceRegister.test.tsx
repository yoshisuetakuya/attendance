import { render, screen, fireEvent, waitFor, getByRole, within } from "@testing-library/react";
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
      summary: '有給',
      memo: 'メモ',
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

    // ---- 入力値の設定 ----

    // 始業時間の入力テスト
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

    // 摘要の確認
    const summary = screen.getByTestId('summary');
    expect(summary).toBeInTheDocument();

    // セレクトボックスの要素を取得してクリック
    const selectButton = summary.querySelector('listbox');
    if (selectButton) {
      await userEvent.click(selectButton);
    }

    // 「有給」メニューアイテムをクリック
    const menuItem = await screen.findByText('有給');
    await userEvent.click(menuItem);

    // 「有給」が選択されたことを確認
    const selectedOption = await screen.findAllByText('有給');
    expect(selectedOption[0]).toHaveTextContent('有給');

    // 備考欄の確認
    const memo = screen.getByTestId('memo');
    const memoInput = memo.querySelector('textarea');

    if (memoInput) {
      await userEvent.type(memoInput, 'メモ');
    }

    // 入力された値を確認する
    expect(memoInput).toHaveValue('メモ');

    // 最初に取得APIが呼ばれる
    expect(global.fetch).toHaveBeenNthCalledWith(1, "http://localhost:8080/getAttendance/2025/1", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      "credentials": "include",
    });

    // 登録ボタンクリック
    fireEvent.click(screen.getByText("登録"));

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

  it('入力確認テスト', async () => {

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
      summary: '有給',
      memo: 'メモ',
    };

    const mockHandleChange = jest.fn();

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <table>
          <tbody>
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
          </tbody>
        </table>
      </LocalizationProvider>
    );

    //始業時間の確認
    // const starttime = screen.getByTestId('starttime');
    // const input = starttime.querySelector('input') as HTMLInputElement;
    // fireEvent.change(input, { target: { value: '09:00 AM' } });
    // expect(input).toHaveValue('09:00 AM'); // 変更された値を確認
    // expect(mockStartHandleChange).toHaveBeenCalledTimes(1);
    // console.log("二回目Start time value:", starttime.value);

    // 始業時間の確認
    const starttime = screen.getByTestId('starttime');
    const input = starttime.querySelector('input') as HTMLInputElement;
    // キーボードでの入力をシミュレート
    await userEvent.type(input, '09:00 AM');
    // 入力値を確認
    expect(input).toHaveValue('09:00 AM');

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

    // 摘要の確認
    const summary = screen.getByTestId('summary');
    expect(summary).toBeInTheDocument();

    // セレクトボックスの要素を取得してクリック
    const selectButton = summary.querySelector('listbox');
    if (selectButton) {
      await userEvent.click(selectButton);
    }

    // 「有給」メニューアイテムをクリック
    const menuItem = await screen.findByText('有給');
    await userEvent.click(menuItem);

    // 「有給」が選択されたことを確認
    const selectedOption = await screen.findAllByText('有給');
    expect(selectedOption[0]).toHaveTextContent('有給');

    // 備考欄の確認
    const memo = screen.getByTestId('memo');
    const memoInput = memo.querySelector('textarea');

    if (memoInput) {
      await userEvent.type(memoInput, 'メモ');
    }

    // 入力された値を確認する
    expect(memoInput).toHaveValue('メモ');


    // // 始業時間の確認
    // const starttime1 = screen.getByTestId('starttime');
    // const button01 = starttime1.querySelector('button');
    // const input01 = starttime1.querySelector('input');
    // if (button01) {
    //   fireEvent.click(button01);
    // }
    // fireEvent.click(screen.getByRole('option', { name: '1 hours' }));

    // fireEvent.click(screen.getByRole('option', { name: '15 minutes' }));

    // // fireEvent.click(screen.getByRole('option', { name: '15 minutes' }));

    // expect(input01).toHaveValue("01:15 AM");

    // // 終業時間の確認
    // const endtime = screen.getByTestId('endtime');
    // const button02 = endtime.querySelector('button');
    // const input02 = endtime.querySelector('input');
    // if (button02) {
    //   fireEvent.click(button02);
    // }

    // fireEvent.click(screen.getByRole('option', { name: '2 hours' }));

    // fireEvent.click(screen.getByRole('option', { name: '00 minutes' }));

    // expect(input02).toHaveValue("02:00 AM");

    // // 時間選択
    // const hourDropdown = screen.getAllByLabelText('Select hours')[1];
    // fireEvent.click(hourDropdown);

    // const hourOptions = within(hourDropdown).queryAllByRole('option');
    // console.log(hourOptions.map(option => option.textContent));
    // fireEvent.click(within(hourDropdown).getByRole('option', { name: '2 hours' }));

    // // 分選択
    // const minuteDropdown = screen.getAllByLabelText('Select minutes')[0];
    // fireEvent.click(minuteDropdown);

    // const minuteOptions = within(minuteDropdown).queryAllByRole('option');
    // console.log(minuteOptions.map(option => option.textContent));

    // fireEvent.click(within(minuteDropdown).getByRole('option', { name: '10 minutes' }));

    // 値の確認
    // expect(input02).toHaveValue('02:10 AM');



    // 時間選択ボタンをクリック
    // fireEvent.click(screen.getAllByRole("button"));
    // fireEvent.click(screen.getByRole("button", { name: "Choose time" }));
    // fireEvent.click(screen.getByTestId('starttime'));
    // fireEvent.click(screen.getByRole("option", { name: "1 hours" }));
    // fireEvent.click(screen.getByRole("option", { name: "55 minutes" }));

    // expect(input).toHaveValue("01:55 AM");

    // // endtimeをtestidで取得
    // const endtime = screen.getByTestId('endtime');
    // fireEvent.click(screen.getAllByRole("button")[1]);
    // // const endTime = screen.getByTestId("endtime").closest("div");
    // // const button = within(endTime!).getByRole("button");
    // // fireEvent.click(button)
    // fireEvent.click(screen.getByRole("option", { name: "10 hours" }));

    // expect(endtime).toHaveValue("10:00 AM");


    // 終業時間の確認
    // const endtime = screen.getByLabelText('終業時間');
    // fireEvent.change(endtime, { target: { value: '2025-02-03T17:30:00' } });
    // expect(endtime).toBeInTheDocument();

    // 休憩時間の確認
    // const breaktime = screen.getByLabelText('休憩＋中抜け');
    // fireEvent.change(breaktime, { target: { value: '2025-02-03T01:00:00' } });
    // expect(breaktime).toBeInTheDocument();

    // 所定内時間の確認
    // const workinghours = screen.getByLabelText('所定内');
    // fireEvent.change(workinghours, { target: { value: '2025-02-03T07:30:00' } });
    // // expect(workinghours).toBeInTheDocument();

    // // 早出時間の確認
    // const earlyhours = screen.getByLabelText('早出');
    // fireEvent.change(earlyhours, { target: { value: '2025-02-03T00:00:00' } });
    // // expect(earlyhours).toBeInTheDocument();

    // // 残業時間の確認
    // const overtimehours = screen.getByLabelText('残業');
    // fireEvent.change(overtimehours, { target: { value: '2025-02-03T00:00:00' } });
    // // expect(overtimehours).toBeInTheDocument();

    // // 深夜/休出時間の確認
    // const nightandholidayworks = screen.getByLabelText('深夜/休出');
    // fireEvent.change(nightandholidayworks, { target: { value: '2025-02-03T00:00:00' } });
    // // expect(nightandholidayworks).toBeInTheDocument();

    // // 摘要の選択確認
    // // セレクトボックスを取得してクリック
    // const summary = screen.getByLabelText('摘要');
    // expect(summary).toBeInTheDocument();
    // await userEvent.click(summary);

    // // メニューアイテムをクリックして選択
    // const menuItem = screen.getByRole('option', { name: '有給' });
    // await userEvent.click(menuItem);

    // // 備考
    // const memoInput = screen.getByLabelText("備考");
    // fireEvent.change(memoInput, { target: { value: "メモ" } });
    // // expect(mockHandleChange).toHaveBeenCalledTimes(1);
    // expect(memoInput).toHaveValue('メモ');

  });

});
