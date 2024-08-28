import * as React from 'react';
import { Button, FormControl, Grid, InputLabel, Link, List, ListItem, MenuItem, Select, Typography } from "@mui/material";
import Header from "./components/Header";
import { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import router from 'next/router';
import PasswordUpdate from './components/PasswordUpdate';

const MonthlyList = () => {
  const years = [2024, 2025, 2026];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [year, setYear] = useState<string>('');
  // 編集期間の情報を保持
  const [SystemData, setSystemData] = useState([]);
   // ダイアログの表示状態を管理
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <Grid container justifyContent="center">
        <Grid item>
          <Typography component="h1" variant="h4" sx={{ marginTop: 4 }} gutterBottom>
            月別表示画面
          </Typography>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>対象年</InputLabel>
            <Select value={year} onChange={handleChange} label="対象年">
              <MenuItem value="" disabled>年を選択</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <List>
            {months.map((month) => (
              <ListItem key={month}>
                <Link href={`/Attendance/${year}/${month}`} underline="hover">
                  {month}月勤怠表
                </Link>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item container spacing={2} justifyContent="center" sx={{ marginTop: 12 }}>
          <Button variant="contained" sx={{ margin: 1 }} onClick={handleOpenPasswordDialog}>パスワードの変更</Button>
          <Button variant="contained" sx={{ margin: 1 }} onClick={handleLogout}>ログアウト</Button>
        </Grid>
      </Grid>

      <PasswordUpdate 
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword} 
      />
    </>
  );
};

export default MonthlyList;
