import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { AttendanceDetailsProps } from '@/types';
import Holidays from 'date-holidays';

// 所定勤務日数を計算する関数
const calculateScheduledWorkDays = (year: string, month: string): number => {
    const hd = new Holidays('JP'); // 日本の祝日を取得するオブジェクトを作成
    const holidays = hd.getHolidays(parseInt(year)); // 指定された年の祝日を取得

    const holidaysInMonth: number[] = []; // 指定された月の祝日を保存するための配列

    // 指定された月の祝日の日付を取り出して保存
    for (let i = 0; i < holidays.length; i++) {
        const holiday = holidays[i];
        const holidayDate = new Date(holiday.date); // 祝日の日付をDateオブジェクトに変換
        const holidayMonth = holidayDate.getMonth() + 1; // 月を取得（0が1月なので、+1する）

        if (holidayMonth === parseInt(month)) { // 祝日が指定された月か確認
            const day = holidayDate.getDate(); // 日付を取得
            holidaysInMonth.push(day); // 祝日の日付を配列に追加
        }
    }

    const totalDays = new Date(parseInt(year), parseInt(month), 0).getDate(); // 月の最終日を取得
    let workDays = 0; // 勤務日数をカウントするための変数

    // 1日から月の最終日までループ
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(parseInt(year), parseInt(month) - 1, day); // 各日のDateオブジェクトを作成
        const dayOfWeek = date.getDay(); // 曜日を取得 (0: 日曜日, 6: 土曜日)
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 土日かどうかの判定
        const isHoliday = holidaysInMonth.includes(day); // 祝日かどうかの判定

        // 土日でも祝日でもない場合に勤務日数をカウント
        if (!isWeekend && !isHoliday) {
            workDays++;
        }
    }

    return workDays;
};

// 当月の勤務日数を計算する関数
const calculateWorkDays = (year: string, month: string, absentCount: number, paidLeaveCount: number, specialLeaveCount: number): number => {

    // 所定の勤務日数を計算
    const scheduledDays = calculateScheduledWorkDays(year, month);

    // すべての欠勤日数を合計
    const totalAbsent = absentCount + paidLeaveCount + specialLeaveCount;

    // 欠勤日数分を勤務日数から引く
    const workDays = scheduledDays - totalAbsent;

    return workDays;
};

const AttendanceDetails = ({
    year,
    month,
    initialTime,
    calculateWorkingHours,
    attendanceData,
}: AttendanceDetailsProps) => {
    const [paidLeaveCount, setPaidLeaveCount] = useState(0);
    const [specialLeaveCount, setSpecialLeaveCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);

    useEffect(() => {
        const updateCounts = () => {
            const paidLeave = attendanceData.filter(item => item.summary === '有給').length;
            const absent = attendanceData.filter(item => item.summary === '欠勤').length;
            const specialLeave = attendanceData.filter(item => item.summary === '特休').length;

            setPaidLeaveCount(paidLeave);
            setAbsentCount(absent);
            setSpecialLeaveCount(specialLeave);
        };
        updateCounts();
    }, [attendanceData]);

    return (
        <Table sx={{ width: '800px', marginTop: '20px', marginLeft: '20px' }}>
            <TableBody>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        所定勤務日数: {calculateScheduledWorkDays(year, month)}日
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        所定勤務時間: {calculateWorkingHours(initialTime)}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        当月勤務日数: {calculateWorkDays(year, month, absentCount, paidLeaveCount, specialLeaveCount)}日
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        有給取得日数: {paidLeaveCount}日
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        当月欠勤日数: {absentCount}日
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        特別休暇日数: {specialLeaveCount}日
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default AttendanceDetails;
