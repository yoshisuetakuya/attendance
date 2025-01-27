import React, { memo } from 'react';
import { TableRow, TableCell, Box, TextField, FormControl, Select, MenuItem } from '@mui/material';
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
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px'}}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.starttime}
                        onChange={(time) => handleStartTimeChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.endtime}
                        onChange={(time) => handleEndTimeChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.breaktime}
                        onChange={(time) => handleBreakTimeChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.workinghours}
                        onChange={(time) => handleWorkingHoursChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.earlyhours}
                        onChange={(time) => handleEarlyHoursChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.overtimehours}
                        onChange={(time) => handleOvertimeHoursChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
                <Box sx={{ width: '120px' }}>
                    <TimePicker
                        value={data.nightandholidayworks}
                        onChange={(time) => handleNightAndHolidayWorksChange(data.day, time)}
                        sx={{
                            '& .MuiInputBase-root': {
                                border: 'none',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            height: '50px',
                        }}
                    />
                </Box>
            </TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '1px', height: '30px' }}>
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
                />
            </TableCell>
        </TableRow>
    );
});

export default AttendanceRow;
