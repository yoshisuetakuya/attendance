import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import router from "next/router";
import { PasswordUpdateProps, UpdateFormValues } from "@/types";


const PasswordUpdate = ({
  open,
  onClose,
  showPassword,
  handleClickShowPassword,
}: PasswordUpdateProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    }
  });

  const onSubmit = async (data: UpdateFormValues) => {
    try {
      // ユーザー登録のための POST リクエスト
      const response = await fetch("http://localhost:8080/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      if (response.status === 200) {
        alert("パスワードの変更に成功しました");
        onClose();
        router.push('/Login')
      } else if (response.status === 404) {
        alert("現在のパスワードが見つかりませんでした");

      } else {
        alert("パスワードの変更に失敗しました");
      }
    } catch {
      alert("パスワードの変更中にエラーが発生しました");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>パスワードの変更</DialogTitle>
      <DialogContent>
        <DialogContentText>
          現在のパスワードと新しいパスワードを入力してください
        </DialogContentText>

        <Controller
          name="currentPassword"
          control={control}
          defaultValue=""
          rules={{
            required: "パスワードは必須です",
            pattern: {
              value: /^[a-zA-Z0-9_-]{8,}$/,
              message: "8文字以上の英数字で入力してください",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="現在のパスワード"
              variant="outlined"
              margin="normal"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          defaultValue=""
          rules={{
            required: "パスワードは必須です",
            pattern: {
              value: /^[a-zA-Z0-9_-]{8,}$/,
              message: "8文字以上の英数字で入力してください",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="新しいパスワード"
              variant="outlined"
              margin="normal"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit(onSubmit)}>送信</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordUpdate;
