import { TableCell, TableRow } from "@mui/material";
import { AttendanceData, TableTotalPrpps } from "@/types";

const TableTotal = ({
    attendanceData,
}: TableTotalPrpps) => {
    const calculateTotalWorkingHours = (data: AttendanceData[]): string => {
        let totalMinutes = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            if (item.workinghours) { // item.workinghours が存在する場合に処理
                const hours = item.workinghours.getHours(); // 時間を取得
                const minutes = item.workinghours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分
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
            const item = data[i];

            if (item.earlyhours) { // item.earlyhours が存在する場合に処理
                const hours = item.earlyhours.getHours(); // 時間を取得
                const minutes = item.earlyhours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分
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
            const item = data[i];

            if (item.overtimehours) { // item.overtimehours が存在する場合に処理
                const hours = item.overtimehours.getHours(); // 時間を取得
                const minutes = item.overtimehours.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分
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
            const item = data[i];

            if (item.nightandholidayworks) { // item.nightandholidayworks が存在する場合に処理
                const hours = item.nightandholidayworks.getHours(); // 時間を取得
                const minutes = item.nightandholidayworks.getMinutes(); // 分を取得
                totalMinutes += hours * 60 + minutes; // 合計分
            }
        }

        // 合計分を時間形式に変換
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    return (
        <TableRow>
            <TableCell colSpan={5} sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#007bff', color: 'white', width: 70 }}>合 計</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 150, border: '1px solid #ccc'}}>
                所定内: {calculateTotalWorkingHours(attendanceData)}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 150, border: '1px solid #ccc'}}>
                早出: {calculateTotalEarlyHours(attendanceData)}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 150, border: '1px solid #ccc'}}>
                残業: {calculateTotalOvertimeHours(attendanceData)}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 150, border: '1px solid #ccc'}}>
                深夜/休出: {calculateTotalNightAndHolidayWorks(attendanceData)}
            </TableCell>
        </TableRow>
    )
};
export default TableTotal;