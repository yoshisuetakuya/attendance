import React, { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AttendanceRowProps } from '@/types'

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
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px 4px', height: '30px', width: '3' }}>{data.day}</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px 4px', height: '30px' }}>{data.weekday}</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="starttime">
                        <TimePicker
                            value={data.starttime}
                            onChange={(time) => handleStartTimeChange(data.day, time)}
                            label="始業時間"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="endtime">
                        <TimePicker
                            value={data.endtime}
                            onChange={(time) => handleEndTimeChange(data.day, time)}
                            label="終業時間"
                            data-testid="endtime-picker"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="breaktime">
                        <TimePicker
                            value={data.breaktime}
                            onChange={(time) => handleBreakTimeChange(data.day, time)}
                            label="休憩＋中抜け"
                            data-testid="breaktime"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="workinghours">
                        <TimePicker
                            value={data.workinghours}
                            onChange={(time) => handleWorkingHoursChange(data.day, time)}
                            label="所定内"
                            data-testid="workinghours"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="earlyhours">
                        <TimePicker
                            value={data.earlyhours}
                            onChange={(time) => handleEarlyHoursChange(data.day, time)}
                            label="早出"
                            data-testid="earlyhours"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="overtimehours">
                        <TimePicker
                            value={data.overtimehours}
                            onChange={(time) => handleOvertimeHoursChange(data.day, time)}
                            label="残業"
                            data-testid="overtimehours"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <div data-testid="nightandholidayworks">
                        <TimePicker
                            value={data.nightandholidayworks}
                            onChange={(time) => handleNightAndHolidayWorksChange(data.day, time)}
                            label="深夜/休出"
                            data-testid="nightandholidayworks"
                            sx={{
                                '& .MuiInputBase-root': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                height: '50px',
                            }}
                        />
                    </div>
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <div data-testid="summary">
                    <FormControl fullWidth>
                        <Select
                            value={data.summary}
                            onChange={(event) => handleSummaryChange(data.day, event)}
                            sx={{
                                border: 'none',
                                '& .MuiSelect-select': {
                                    border: 'none',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                height: '30px',
                            }}
                        >
                            <MenuItem value="">選択なし</MenuItem>
                            <MenuItem value="有給">有給</MenuItem>
                            <MenuItem value="欠勤">欠勤</MenuItem>
                            <MenuItem value="特休">特休</MenuItem>
                            <MenuItem value="早退">早退</MenuItem>
                            <MenuItem value="遅刻">遅刻</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <TextField
                    value={data.memo}
                    sx={{ width: '300px' }}
                    multiline
                    onChange={(event) => handleMemoChange(data.day, event)}
                    InputProps={{
                        sx: {
                            border: 'none',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '30px',
                        },
                    }}
                    InputLabelProps={{
                        sx: { display: 'none' },
                    }}
                    data-testid="memo"
                />
            </TableCell>
        </TableRow>
    );
});

export default AttendanceRow;
