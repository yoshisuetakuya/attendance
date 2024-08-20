import * as React from 'react';
import { FormControl, Grid, InputLabel, Link, List, ListItem, MenuItem, Select, Typography } from "@mui/material";
import Header from "./components/Header";
import { SelectChangeEvent } from '@mui/material/Select';

const MonthlyList = () => {
  const years = [2024, 2025, 2026];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [year, setYear] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setYear(event.target.value);
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
      </Grid>
    </>
  );
};

export default MonthlyList;
