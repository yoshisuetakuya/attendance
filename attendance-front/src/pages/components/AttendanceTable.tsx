import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Select, MenuItem, FormControl, TextField, SelectChangeEvent } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AttendanceData, AttendanceTableProps } from '../types/index';


const AttendanceTable =  ({attendanceData, setAttendanceData,}: AttendanceTableProps) => {
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
    const calculateTotalWorkingHours = (data: AttendanceData[]): string => {
        let totalMinutes = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i]; // 配列の要素を代入

            if (item.workinghours) { // item.workinghours が存在する場合に処理
                const hours = item.workinghours.getHours(); // 時間を取得
                const minutes = item.workinghours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分に追加
            }
        }

        // 合計分を時間形式に変換
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const calculateTotalEarlyHours = (data: AttendanceData[]): string => {
        let totalMinutes = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i]; // 配列の要素を代入

            if (item.earlyhours) { // item.earlyhours が存在する場合に処理
                const hours = item.earlyhours.getHours(); // 時間を取得
                const minutes = item.earlyhours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分に追加
            }
        }

        // 合計分を時間形式に変換
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const calculateTotalOvertimeHours = (data: AttendanceData[]): string => {
        let totalMinutes = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i]; // 配列の要素を代入

            if (item.overtimehours) { // item.overtimehours が存在する場合に処理
                const hours = item.overtimehours.getHours(); // 時間を取得
                const minutes = item.overtimehours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分に追加
            }
        }

        // 合計分を時間形式に変換
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const calculateTotalNightAndHolidayWorks = (data: AttendanceData[]): string => {
        let totalMinutes = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i]; // 配列の要素を代入

            if (item.nightandholidayworks) { // item.nightandholidayworks が存在する場合に処理
                const hours = item.nightandholidayworks.getHours(); // 時間を取得
                const minutes = item.nightandholidayworks.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分に追加
            }
        }

        // 合計分を時間形式に変換
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {['日', '曜日', '始業時間', '終業時間', '休憩＋中抜け', '所定内', '早出', '残業', '深夜/休出', '摘要', '備考'].map(header => (
                        <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {attendanceData.map((data) => (
                    <TableRow key={data.day}>
                        <TableCell>{data.day}</TableCell>
                        <TableCell>{data.weekday}</TableCell>
                        <TableCell>
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
                                    <MenuItem value="">選択なし</MenuItem>
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
                        所定内:{calculateTotalWorkingHours(attendanceData)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        早出:{calculateTotalEarlyHours(attendanceData)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        残業:{calculateTotalOvertimeHours(attendanceData)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        深夜/休出:{calculateTotalNightAndHolidayWorks(attendanceData)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default AttendanceTable;
