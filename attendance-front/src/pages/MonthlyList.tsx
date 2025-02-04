import * as React from 'react';
import { Button, FormControl, Grid, InputLabel, Link, List, ListItem, MenuItem, Select, Typography } from "@mui/material";
import Header from "@/components/Header";
import { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import PasswordUpdate from '@/components//PasswordUpdate';
import { SystemData } from '@/types';

const MonthlyList = () => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // 編集期間の情報を保持
  const [SystemData, setSystemData] = useState<SystemData[]>([]);
  // ダイアログの表示状態を管理
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // 現在の年を取得
  const currentYear = new Date().getFullYear();
  const pastYears = 2; // 過去3年
  // デフォルト値で現在の年を設定
  const [year, setYear] = useState<string>(currentYear.toString());
  const years = [];
  const router = useRouter();
  // 過去３年分の年を生成する
  for (let i = pastYears; i >= 0; i--) {
    years.push(currentYear - i);
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true); // ダイアログを開く
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false); // ダイアログを閉じる
  };
  // パスワードの表示と非表示の切り替え処理
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getEdithingPeriod", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // クッキーを送信する
      });
      const data = await response.json();
      setSystemData(data);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status === 200) {
        alert("ログアウトに成功しました");
        router.push('/Login');
      } else {
        alert("ログアウトに失敗しました");
      }
    } catch (error) {
      console.log('エラー:', error);
    }
  };

  return (
    <>
      <Header />
      <Grid container justifyContent="center" alignItems="center" direction="column" >
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography component="h1" variant="h4" sx={{ marginTop: 4, marginBottom: 3 }} gutterBottom>
            月別表示画面
          </Typography>
          <FormControl variant="outlined" sx={{ minWidth: 100, marginBottom: 6 }}>
            <InputLabel>対象年</InputLabel>
            <Select value={year} onChange={handleChange} label="対象年" >
              <MenuItem value="" disabled>年を選択</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2} justifyContent="center">
            {months.map((month) => (
              <Grid item xs={4} key={month} sx={{ textAlign: 'center', marginTop: 1, fontWeight: 'bold' }}>
                <Link href={`/Attendance/${year}/${month}`} underline="hover">
                  {month}月勤怠表
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item container spacing={2} justifyContent="center" sx={{ marginTop: 15 }}>
          <Button variant="contained" sx={{ margin: '0 32px' }} onClick={handleOpenPasswordDialog}>パスワードの変更</Button>
          <Button variant="contained" sx={{ margin: '0 32px' }} onClick={handleLogout}>ログアウト</Button>
        </Grid>
      </Grid>

      <PasswordUpdate
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
      />
    </>
  );
};

export default MonthlyList;
