import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';

const AttendancePage: React.FC = () => {
  const router = useRouter();
  const { year, month } = router.query;

  const [attendanceData, setAttendanceData] = useState([]);

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
          credentials: 'include', // クッキーを送信する
      });
      const data = await response.json();
      setAttendanceData(data);
      console.log(data);
  } catch (error) {
      console.log(error);
  }
};

  

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        {year}年{month}月の勤怠データ
      </Typography>
    </div>
  );
};

export default AttendancePage;
