import * as React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import router from "next/router";
import Header from "@/components/Header";
import { Controller, useForm } from "react-hook-form";
import CreateNewUser from "@/components/CreateNewUser";
import PasswordReissue from "@/components/PasswordReissue";
import { FormValues } from "@/types";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openRegister, setOpenEmployeeRegister] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  // useFormフックを使ってフォームの管理とバリデーションを設定
  const { control, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();

  // パスワードの表示と非表示の切り替え処理
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 新規登録ダイアログの開閉の処理
  const handleOpenEmployeeRegister = () => {
    setOpenEmployeeRegister(true);
  };
  const handleCloseEmployeeRegister = () => {
    setOpenEmployeeRegister(false);
  };

  // パスワード再発行ダイアログの開閉処理
  const handleOpenResetPassword = () => {
    setOpenResetPassword(true);
  };
  const handleCloseResetPassword = () => {
    setOpenResetPassword(false);
  };

  // フォーム送信処理
  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;

    // URLSearchParams()を使用してapplication/x-www-form-urlencoded形式で送信する
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        // リクエストにクッキーを含める
        credentials: 'include'
      });
      // ステータスコードが２００の時ログイン
      if (response.status === 200) {
        router.push('/MonthlyList');
      } else {
        setError('email', {
          type: 'manual',
          message: 'メールアドレスまたはパスワードが違います',
        });
        setError('password', {
          type: 'manual',
          message: 'メールアドレスまたはパスワードが違います',
        });
      }
    } catch {
      setError('password', {
        type: 'manual',
        message: 'ログインに失敗しました',
      });
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            ログイン
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            {/* メールアドレス入力フィールド */}
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "メールアドレスは必須です" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="メールアドレス"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "パスワードは必須です" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="パスワード"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              ログイン
            </Button>

            <Grid container>
              <Grid item xs>
                <Button onClick={handleOpenResetPassword}>
                  パスワード再発行
                </Button>
              </Grid>

              <Grid item>
                <Button onClick={handleOpenEmployeeRegister}>
                  新規登録
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      {/* 新規登録ダイアログ*/}
      <CreateNewUser
        open={openRegister}
        onClose={handleCloseEmployeeRegister}
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
      />

      {/* パスワード再発行ダイアログ*/}
      <PasswordReissue
        open={openResetPassword}
        onClose={handleCloseResetPassword}
      />
    </>
  );
};

export default Login;