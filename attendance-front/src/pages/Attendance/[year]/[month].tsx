import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Holidays from 'date-holidays';
import Header from '@/components/Header';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { AttendanceData, GetAttendanceData, PostAttendanceData, Initialtime } from '@/types';
import AttendanceDetails from '@/components/AttendanceDetails';
import AttendanceRow from '@/components/AttendanceRow';
import TableTotal from '@/components/TableTotal';

const Attendance = () => {
  const router = useRouter();
  const { year, month } = router.query; // URLから年と月を取得
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [initialTime, setInitialTime] = useState<Initialtime>({
    selectedStartTime: new Date(new Date().setHours(9, 0)),
    selectedEndTime: new Date(new Date().setHours(17, 30)),
    selectedBreakTime: new Date(new Date().setHours(1, 0)),
  });

  useEffect(() => {
    const fetchAttendanceData = async (year: string, month: string) => {
      try {
        const response = await fetch(`http://localhost:8080/getAttendance/${year}/${month}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // クッキーを送信
        });
        const data = await response.json();
        console.log(data);

        // デフォルトデータを先に設定する
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        const defaultData: AttendanceData[] = [];
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

        // 月の日数分だけ出勤簿データを回す
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(parseInt(year), parseInt(month) - 1, day);
          const weekdayIndex = date.getDay(); // 日付から曜日のインデックス
          const weekday = weekdays[weekdayIndex]; // 曜日のインデックスを使って曜日を取得

          // データを初期化
          const detileDayData: AttendanceData = {
            attendanceid: null,
            day,
            weekday,
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

          // データがある場合更新する
          const existingData = data.find((data: GetAttendanceData) => data.day === day);
          if (existingData) {
            detileDayData.starttime = existingData.starttime ? parseTime(existingData.starttime, parseInt(year), parseInt(month), day) : null;
            detileDayData.endtime = existingData.endtime ? parseTime(existingData.endtime, parseInt(year), parseInt(month), day) : null;
            detileDayData.breaktime = existingData.breaktime ? parseTime(existingData.breaktime, parseInt(year), parseInt(month), day) : null;
            detileDayData.workinghours = existingData.workinghours ? parseTime(existingData.workinghours, parseInt(year), parseInt(month), day) : null;
            detileDayData.earlyhours = existingData.earlyhours ? parseTime(existingData.earlyhours, parseInt(year), parseInt(month), day) : null;
            detileDayData.overtimehours = existingData.overtimehours ? parseTime(existingData.overtimehours, parseInt(year), parseInt(month), day) : null;
            detileDayData.nightandholidayworks = existingData.nightandholidayworks ? parseTime(existingData.nightandholidayworks, parseInt(year), parseInt(month), day) : null;
            detileDayData.summary = existingData.summary;
            detileDayData.memo = existingData.memo;
          }

          defaultData.push(detileDayData);
        }

        setAttendanceData(defaultData);
      } catch (error) {
        console.log(error);
      }
    };

    if (year && month) {
      fetchAttendanceData(year as string, month as string);
    }
  }, [year, month]);


  const handleSubmit = async () => {
    try {
      const formattedData = convertToPostAttendanceData(attendanceData, year as string, month as string);
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
        credentials: 'include',
      });
      if (response.status === 200) {
        alert("登録が成功しました");
        router.push('/MonthlyList');
      } else {
        alert("登録処理に失敗しました");
      }
    } catch (error) {
      console.log('登録エラー:', error);
    }
  };

  const handleSelectedStartTime = (value: Date | null) => {
    setInitialTime((prevTime) => ({
      ...prevTime,
      selectedStartTime: value,
    }));
  };

  const handleSelectedEndTime = (value: Date | null) => {
    setInitialTime((prevTime) => ({
      ...prevTime,
      selectedEndTime: value,
    }));
  };

  const handleSelectedBreakTime = (value: Date | null) => {
    setInitialTime((prevTime) => ({
      ...prevTime,
      selectedBreakTime: value,
    }));
  };

  const handleStartTimeChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, starttime: time } : data
      )
    );
  }, []);

  const handleEndTimeChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, endtime: time } : data
      )
    );
  }, []);

  const handleBreakTimeChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, breaktime: time } : data
      )
    );
  }, []);

  const handleWorkingHoursChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, workinghours: time } : data
      )
    );
  }, []);

  const handleEarlyHoursChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, earlyhours: time } : data
      )
    );
  }, []);

  const handleOvertimeHoursChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, overtimehours: time } : data
      )
    );
  }, []);

  const handleNightAndHolidayWorksChange = useCallback((day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, nightandholidayworks: time } : data
      )
    );
  }, []);

  const handleSummaryChange = useCallback((day: number, event: SelectChangeEvent<string>) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, summary: event.target.value } : data
      )
    );
  }, []);

  const handleMemoChange = useCallback((day: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.day === day ? { ...data, memo: event.target.value } : data
      )
    );
  }, []);

  // 自動入力ボタン
  const handleInput = () => {
    const confirm = window.confirm('自動入力を行いますか');

    if (!confirm) {
      return;
    }

    const holidaysInMonth = getHolidaysInMonth(year as string, month as string);
    setAttendanceData(attendanceData.map(item => {
      const weekday = new Date(parseInt(year as string), parseInt(month as string) - 1, item.day);
      const isHoliday = holidaysInMonth.includes(item.day); // 祝日かどうかの判定

      if (isWeekend(weekday) || isHoliday) {
        // 土日または祝日
        return {
          ...item,
          starttime: new Date(new Date().setHours(0, 0)),
          endtime: new Date(new Date().setHours(0, 0)),
          breaktime: new Date(new Date().setHours(0, 0)),
          workinghours: new Date(new Date().setHours(0, 0)),
          earlyhours: new Date(new Date().setHours(0, 0)),
          overtimehours: new Date(new Date().setHours(0, 0)),
          nightandholidayworks: new Date(new Date().setHours(0, 0)),
          summary: '',
          memo: '',
        };
      }

      // 平日
      return {
        ...item,
        starttime: initialTime.selectedStartTime,
        endtime: initialTime.selectedEndTime,
        breaktime: initialTime.selectedBreakTime,
        workinghours: timeStringToDate(calculateWorkingHours(initialTime)),
        earlyhours: new Date(new Date().setHours(0, 0)),
        overtimehours: new Date(new Date().setHours(0, 0)),
        nightandholidayworks: new Date(new Date().setHours(0, 0)),
        summary: '',
        memo: '',
      };
    }));
  };

  // 指定された年と月の祝日を取得する関数
  const getHolidaysInMonth = (year: string, month: string): number[] => {
    const hd = new Holidays('JP'); // 日本の祝日データを扱うオブジェクトを作成
    const holidays = hd.getHolidays(parseInt(year)); // 指定された年の全ての祝日を取得

    const holidaysInMonth: number[] = []; // 指定された月の祝日の日付を保存するための配列

    // 祝日リストの長さを取得
    const length = holidays.length;

    // 祝日リストを通常のforループで処理
    for (let i = 0; i < length; i++) {
      const holiday = holidays[i]; // 現在の祝日データを取得
      const holidayDate = new Date(holiday.date); // 祝日の日付をDateオブジェクトに変換
      const holidayMonth = holidayDate.getMonth() + 1; // 月を取得（0が1月なので、+1する）

      // 祝日が指定された月かどうかを確認
      if (holidayMonth === parseInt(month)) {
        const day = holidayDate.getDate(); // 祝日の日にちを取得
        holidaysInMonth.push(day); // 祝日の日にちを配列に追加
      }
    }

    return holidaysInMonth; // 指定された月の祝日の日にちを含む配列を返す
  };

  // 土日かどうか判定
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 日曜日 (0) または 土曜日 (6)
  };

  const timeStringToDate = (timeString: string): Date => {
    const time = timeString.split(':');

    // 時間と分を抽出
    const hours = Number(time[0]);
    const minutes = Number(time[1]);

    // 現在の日付を基準に時間と分を設定
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    return date;
  };
  const calculateWorkingHours = (initialTime: Initialtime): string => {
    if (!initialTime.selectedStartTime || !initialTime.selectedEndTime || !initialTime.selectedBreakTime) {
      return "00:00";
    }

    // 開始時刻と終了時刻と休憩時間の時間と分を取得
    const startHour = initialTime.selectedStartTime.getHours();
    const startMinutes = initialTime.selectedStartTime.getMinutes();
    const endHour = initialTime.selectedEndTime.getHours();
    const endMinutes = initialTime.selectedEndTime.getMinutes();
    const breakHour = initialTime.selectedBreakTime.getHours();
    const breakMinutes = initialTime.selectedBreakTime.getMinutes();

    // 分単位に変換
    const startInMinutes = startHour * 60 + startMinutes;
    const endInMinutes = endHour * 60 + endMinutes;
    const breakInMinutes = breakHour * 60 + breakMinutes;

    // 勤務時間を計算
    const workkingMinutes = endInMinutes - startInMinutes - breakInMinutes;

    // 分単位の勤務時間を時間形式の文字列に変換
    const hours = Math.floor(workkingMinutes / 60);
    const minutes = workkingMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const parseTime = (timeString: string, year: number, month: number, day: number): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);

    return date;
  };

  const convertToPostAttendanceData = (data: AttendanceData[], year: string, month: string): PostAttendanceData[] => {
    return data.map(dayData => ({
      year,
      month,
      day: dayData.day.toString(),
      starttime: formatTime(dayData.starttime),
      endtime: formatTime(dayData.endtime),
      breaktime: formatTime(dayData.breaktime),
      workinghours: formatTime(dayData.workinghours),
      earlyhours: formatTime(dayData.earlyhours),
      overtimehours: formatTime(dayData.overtimehours),
      nightandholidayworks: formatTime(dayData.nightandholidayworks),
      summary: dayData.summary || '',
      memo: dayData.memo || '',
    }));
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [isSticky, setIsSticky] = useState(false);
  const tableHeadRef = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tableHeadRef.current) {
        const tableRect = tableHeadRef.current.getBoundingClientRect();
        setIsSticky(tableRect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <Grid container justifyContent="center">
          <Typography variant="h4" component="h1" style={{ marginTop: '30px' }} gutterBottom>
            出勤簿
          </Typography>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Typography variant="h6" component="h1" gutterBottom>
            {year}年{month}月
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Grid container alignItems="center">
              <TimePicker
                label="始業時間"
                value={initialTime.selectedStartTime}
                onChange={handleSelectedStartTime}
              />
              <Typography style={{ margin: '10px' }}>〜</Typography>
              <TimePicker
                label="終業時間"
                value={initialTime.selectedEndTime}
                onChange={handleSelectedEndTime}
              />
            </Grid>
          </Grid>
          <Grid item xs={4} justifyContent="center">
            <TimePicker
              label="休憩時間"
              value={initialTime.selectedBreakTime}
              onChange={handleSelectedBreakTime}
            />
          </Grid>
          <Grid item xs={4} container justifyContent="flex-end">
            <Button variant="contained" onClick={handleInput}>自動入力</Button>
          </Grid>
        </Grid>
        <TableContainer style={{
          overflow: 'visible',
        }}>
          <Table>
            <TableHead
              ref={tableHeadRef}
              style={{
                position: isSticky ? 'sticky' : 'relative',
                top: isSticky ? 0 : 'auto',
                backgroundColor: 'white',
                zIndex: 1,
                width: '100%',
                boxShadow: isSticky ? '0px 2px 0px 0px #333' : 'none',
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>日</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>曜日</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>始業時間</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>終業時間</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>休憩＋中抜け</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>所定内</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>早出</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>残業</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>深夜/休出</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>摘要</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>備考</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((data) => (
                <AttendanceRow
                  key={data.day}
                  data={data}
                  handleStartTimeChange={handleStartTimeChange}
                  handleEndTimeChange={handleEndTimeChange}
                  handleBreakTimeChange={handleBreakTimeChange}
                  handleWorkingHoursChange={handleWorkingHoursChange}
                  handleEarlyHoursChange={handleEarlyHoursChange}
                  handleOvertimeHoursChange={handleOvertimeHoursChange}
                  handleNightAndHolidayWorksChange={handleNightAndHolidayWorksChange}
                  handleSummaryChange={handleSummaryChange}
                  handleMemoChange={handleMemoChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* フッター部分を固定 */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            // zIndex: 1000,
            // borderTop: '2px solid #333', // 黒い横線
          }}
        >
          <TableTotal
            attendanceData={attendanceData}
          />
          <AttendanceDetails
            year={year as string}
            month={month as string}
            attendanceData={attendanceData}
          />
          <Grid container justifyContent="center" style={{ marginTop: '30px' }} alignItems="center">
            <Grid item>
              <Button variant="contained" onClick={handleSubmit}>
                登録
              </Button>
            </Grid>
          </Grid>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default Attendance;
