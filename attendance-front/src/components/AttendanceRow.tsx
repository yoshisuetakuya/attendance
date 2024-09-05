import React, { memo } from 'react';
import { TableRow, TableCell, Box, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {AttendanceRowProps} from '@/types'

const AttendanceRow = memo(function AttendanceRow({
    data,
    handleStartTimeChange,
    handleEndTimeChange,
    handleBreakTimeChange,
    handleWorkingHoursChange,
    handleEarlyHoursChange,
    handleOvertimeHoursChange,
    handleNightAndHolidayWorksChange,
    handleSummaryChange,
    handleMemoChange,
}: AttendanceRowProps) {
    return (
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
    );
});

export default AttendanceRow;
