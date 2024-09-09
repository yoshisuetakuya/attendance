import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { PasswordReissueProps, ReissueFormValues } from "@/types";

const PasswordReissue = ({ open, onClose }: PasswordReissueProps) => {
    const { control, handleSubmit, formState: { errors } } = useForm<ReissueFormValues>({ defaultValues: { email: "" } });

    const onSubmit = async (data: ReissueFormValues) => {
        try {
            const response = await fetch("http://localhost:8080/reissue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                }),
            });
            if (response.status === 200) {
                alert("パスワードを再発行しました");
                onClose();
            } else if (response.status === 404) {
                alert("メールアドレスが見つかりませんでした");
            } else {
                alert("パスワードの再発行処理に失敗しました");
            }
        } catch {
            alert("パスワードの再発行処理中にエラーが発生しました");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>パスワード再発行</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    登録しているメールアドレスを入力してください。
                </DialogContentText>

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
                            error={!!errors.email}
                            helperText={errors.email?.message}
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

export default PasswordReissue;
