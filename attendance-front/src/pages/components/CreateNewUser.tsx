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

interface CreateNewUserProps {
  open: boolean;
  onClose: () => void;
  showPassword: boolean;
  handleClickShowPassword: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const CreateNewUser = ({
  open,
  onClose,
  showPassword,
  handleClickShowPassword,
}: CreateNewUserProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // ユーザー登録のための POST リクエスト
      const response = await fetch("http://localhost:8080/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      if (response.status === 200) {
        alert("登録に成功しました");
        onClose();
      } else if (response.status === 409) {
        alert("このメールアドレスはすでに登録されています");
      } else {
        alert("ユーザー登録に失敗しました");
      }
    } catch {
      alert("ユーザー登録中にエラーが発生しました");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新規登録</DialogTitle>
      <DialogContent>
        <DialogContentText>
          名前、メールアドレス、パスワードを入力してください。
        </DialogContentText>

        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{
            required: "名前は必須です",
            maxLength: {
              value: 50,
              message: "名前は50文字以内で入力してください",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="名前"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "メールアドレスは必須です",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "無効なメールアドレス形式です",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="メールアドレス"
              variant="outlined"
              margin="normal"
              fullWidth
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
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
        <Button onClick={handleSubmit(onSubmit)}>登録</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewUser;
