import * as React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import router from "next/router";
import Header from "./components/Heder";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // application/x-www-form-urlencodedで送信するためURLSearchParams()を使用する
    const data = new URLSearchParams();
    data.append('email', email);
    data.append('password', password);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
      });

      if (!response.ok) {
        throw new Error('ネットワークエラー');
      }

      // レスポンスが空でも成功を扱う
    if (response.status === 200) {
      router.push('/ManthlyList');
    } else {
      alert('ログインに失敗しました');
    }
    } catch (error) {
      console.error('エラー:', error);
    }
  };


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="メールアドレス"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            // id="email"
            // name="email"
            // autoComplete="email"
            // autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="パスワード"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            // type="password"
            // name="password"
            // id="password"
            // autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // inputProps={{
            //   pattern: "(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d]{8,}",
            //   title: "パスワードは8文字以上で半角英数字を含めてください"
            // }}
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
              <Link href="#" variant="body2">
                パスワード再発行
              </Link>
            </Grid>

            <Grid item>
              <Link href="#" variant="body2">
                新規登録
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default Login;