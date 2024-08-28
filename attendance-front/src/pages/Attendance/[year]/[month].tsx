import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Header from '@/pages/components/Header';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import Holidays from 'date-holidays';

// 出勤簿の各日のデータ構造を定義
interface AttendanceData {
  attendanceid: number | null; // 勤怠情報ID（初期はnullになっており後でデータベースに保存される際に割り当てられる）
  day: number; // 日付
  weekday: string; // 曜日
  starttime: Date | null; // 始業時間
  endtime: Date | null; // 終業時間
  breaktime: Date | null; // 休憩時間
  workinghours: Date | null; // 所定内労働時間
  earlyhours: Date | null; // 早出時間
  overtimehours: Date | null; // 残業時間
  nightandholidayworks: Date | null; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}

interface GetAttendanceData {
  attendanceid: number | null; // 勤怠情報ID（初期はnullになっており後でデータベースに保存される際に割り当てられる）
  day: number; // 日付
  starttime: string; // 始業時間
  endtime: string; // 終業時間
  breaktime: string; // 休憩時間
  workinghours: string; // 所定内労働時間
  earlyhours: string; // 早出時間
  overtimehours: string; // 残業時間
  nightandholidayworks: string; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}

interface PostAttendanceData {
  year: string; // 年
  month: string; // 月
  day: string; // 日
  starttime: string | null; // 始業時間
  endtime: string | null; // 終業時間
  breaktime: string | null; // 休憩時間
  workinghours: string | null; // 所定内労働時間
  earlyhours: string | null; // 早出時間
  overtimehours: string | null; // 残業時間
  nightandholidayworks: string | null; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}
interface Initialtime {
  selectedStartTime: Date | null;
  selectedEndTime: Date | null;
  selectedBreakTime: Date | null;
}
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

// 時間を分単位に変換する関数
const convertTHouerToMinutes = (hours: number, minutes: number): number => {
  return hours * 60 + minutes;
};

const calculateTotalWorkingHours = (data: AttendanceData[]) => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.workinghours) {
      const hours = item.workinghours.getHours();
      const minutes = item.workinghours.getMinutes();
      total += convertTHouerToMinutes(hours, minutes);
    }
  }
  return total;
};

const calculateTotalEarlyHours = (data: AttendanceData[]): number => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.earlyhours) {
      const hours = item.earlyhours.getHours();
      const minutes = item.earlyhours.getMinutes();
      total += convertTHouerToMinutes(hours, minutes);
    }
  }
  return total;
};

const calculateTotalOvertimeHours = (data: AttendanceData[]): number => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.overtimehours) {
      const hours = item.overtimehours.getHours();
      const minutes = item.overtimehours.getMinutes();
      total += convertTHouerToMinutes(hours, minutes);
    }
  }
  return total;
};

const calculateTotalNightAndHolidayWorks = (data: AttendanceData[]): number => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.nightandholidayworks) {
      const hours = item.nightandholidayworks.getHours();
      const minutes = item.nightandholidayworks.getMinutes();
      total += convertTHouerToMinutes(hours, minutes);
    }
  }
  return total;
};

// 分単位を時間形式に変換する関数
const formatMinutesToHour = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

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
    if (year && month) {
      fetchAttendanceData(year as string, month as string);
    }
  }, [year, month]);

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
      // 月の日数を計算（yearとmonthは文字列なのでparseIntで整数に変換）
      const daysInMonth = new Date(parseInt(year as string), parseInt(month as string), 0).getDate();
      const defaultData: AttendanceData[] = [];
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

      // 月の日数分だけ出勤簿データを回す
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(parseInt(year as string), parseInt(month as string) - 1, day);
        const weekdayIndex = date.getDay(); // 日付から曜日のインデックスを取得
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
        const existingData = data.find((data: GetAttendanceData) => {
          return data.day === day
        });

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

  const handleStartTimeChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, starttime: time } : item
      )
    );
  };

  const handleEndTimeChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, endtime: time } : item
      )
    );
  };

  const handleBreakTimeChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, breaktime: time } : item
      )
    );
  };

  const handleWorkingHoursChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, workinghours: time } : item
      )
    );
  };

  const handleEarlyHoursChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, earlyhours: time } : item
      )
    );
  };

  const handleOvertimeHoursChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, overtimehours: time } : item
      )
    );
  };

  const handleNightAndHolidayWorksChange = (day: number, time: Date | null) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, nightandholidayworks: time } : item
      )
    );
  };

  const handleSummaryChange = (day: number, event: SelectChangeEvent<string>) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, summary: event.target.value } : item
      )
    );
  };

  const handleMemoChange = (day: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.day === day ? { ...item, memo: event.target.value } : item
      )
    );
  };

  const [paidLeaveCount, setPaidLeaveCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [specialLeaveCount, setSpecialLeaveCount] = useState(0);

  // attendanceDataが更新されるたびにカウントを更新
  useEffect(() => {
    const updateCounts = () => {
      const workDay = attendanceData.filter(item => item.summary === '').length;
      const paidLeave = attendanceData.filter(item => item.summary === '有給').length;
      const absent = attendanceData.filter(item => item.summary === '欠勤').length;
      const specialLeave = attendanceData.filter(item => item.summary === '特休').length;

      setPaidLeaveCount(paidLeave);
      setAbsentCount(absent);
      setSpecialLeaveCount(specialLeave);
    };
    updateCounts();
  }, [attendanceData]);

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
        alert("登録成功が成功しました");
        router.push('/MonthlyList');
      } else {
        alert("登録処理に失敗しました");
      }
    } catch (error) {
      console.log('登録エラー:', error);
    }
  };

// 所定勤務日数を計算する関数
const calculateScheduledWorkDays = (year: string, month: string): number => {
  const hd = new Holidays('JP');
  const holidays = hd.getHolidays(parseInt(year));

  // 指定月の祝日だけを抽出し、DD形式で返す
  const holidaysInMonth = holidays
    .filter(holiday => new Date(holiday.date).getMonth() + 1 === parseInt(month))
    .map(holiday => {
      const date = new Date(holiday.date);
      // DD形式に変換
      return String(date.getDate()).padStart(2, '0');
    });

  console.log(holidaysInMonth);

  const totalDays = new Date(parseInt(year), parseInt(month), 0).getDate();
  let workDays = 0;

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(parseInt(year), parseInt(month) - 1, day);
    const dayOfWeek = date.getDay();
    // DD形式に変換
    const dateString = String(date.getDate()).padStart(2, '0');
    console.log(dateString);

    // 土日を除外
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // 祝日を除外
    if (holidaysInMonth.includes(dateString)) continue;

    workDays++;
  }

  return workDays;
};
  // 当月勤務日数を計算する関数
  const calculateWorkDays = (year: string, month: string, holidays: string, absences: number[], paidLeaves: number[], specialLeaves: number[]) => {
    const scheduledDays = calculateScheduledWorkDays(year, month);

    // 当月の出勤日数を計算
    let workDays = scheduledDays;

    // 出勤しなかった日数を引く
    const allAbsences = [...absences, ...paidLeaves, ...specialLeaves];
    workDays -= allAbsences.length;

    return workDays;
  };

  const handleselectedStartTime = () => {
    setInitialTime
  };
  const handleselectedEndTime = () => {
    setInitialTime
  };
  const handleselectedBreakTime = () => {
    setInitialTime
  };

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
                onChange={handleselectedStartTime}
              />
              <Typography variant="body1" style={{ margin: '10px' }}>〜</Typography>
              <TimePicker
                label="終業時間"
                value={initialTime.selectedEndTime}
                onChange={handleselectedEndTime}
              />
            </Grid>
          </Grid>
          <Grid item xs={4} justifyContent="center">
            <TimePicker
              label="休憩時間"
              value={initialTime.selectedBreakTime}
              onChange={handleselectedBreakTime}
            />
          </Grid>
          <Grid item xs={4} container justifyContent="flex-end">
            <Button variant="contained">自動入力</Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
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
                <TableRow key={data.day}>
                  <TableCell>{data.day}</TableCell>
                  <TableCell>{data.weekday}</TableCell>
                  <TableCell >
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="始業時間"
                        value={data.starttime}
                        onChange={(time) => handleStartTimeChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="終業時間"
                        value={data.endtime}
                        onChange={(time) => handleEndTimeChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="休憩＋中抜け"
                        value={data.breaktime}
                        onChange={(time) => handleBreakTimeChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="所定内"
                        value={data.workinghours}
                        onChange={(time) => handleWorkingHoursChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="早出"
                        value={data.earlyhours}
                        onChange={(time) => handleEarlyHoursChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="残業"
                        value={data.overtimehours}
                        onChange={(time) => handleOvertimeHoursChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '120px' }}>
                      <TimePicker
                        label="深夜/休出"
                        value={data.nightandholidayworks}
                        onChange={(time) => handleNightAndHolidayWorksChange(data.day, time)}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={data.summary}
                        onChange={(event) => handleSummaryChange(data.day, event)}
                      >
                        <MenuItem value="" >選択なし</MenuItem>
                        <MenuItem value="有給">有給</MenuItem>
                        <MenuItem value="欠勤">欠勤</MenuItem>
                        <MenuItem value="特休">特休</MenuItem>
                        <MenuItem value="早退">早退</MenuItem>
                        <MenuItem value="遅刻">遅刻</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={data.memo}
                      sx={{ width: '300px' }}
                      multiline
                      onChange={(event) => handleMemoChange(data.day, event)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#007bff', color: 'white' }}>合計</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  所定内:{formatMinutesToHour(calculateTotalWorkingHours(attendanceData))}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  早出:{formatMinutesToHour(calculateTotalEarlyHours(attendanceData))}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  残業:{formatMinutesToHour(calculateTotalOvertimeHours(attendanceData))}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  深夜/休出:{formatMinutesToHour(calculateTotalNightAndHolidayWorks(attendanceData))}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Table sx={{ width: '800px', marginTop: '20px', marginLeft: '20px' }}>
          <TableBody >
            <TableRow >
              <TableCell sx={{ fontWeight: 'bold', }}>
                所定勤務日数: {calculateScheduledWorkDays(year as string, month as string)}日
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', }}>
                所定勤務時間: 時間
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', }}>
                当月勤務日数: 日
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', }}>
                有給取得日数: {paidLeaveCount}日
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', }}>
                当月欠勤日数: {absentCount}日
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', }}>
                特別休暇日数: {specialLeaveCount}日
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Grid container justifyContent="center" style={{ marginTop: '30px' }} alignItems="center">
          <Grid item>
            <Button variant="contained" onClick={handleSubmit}>
              登録
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
};

export default Attendance;
