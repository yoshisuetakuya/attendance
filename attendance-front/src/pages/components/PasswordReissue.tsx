import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface PasswordReissueProps {
    open: boolean;
    onClose: () => void;
}

interface FormValues {
    email: string;
}

const PasswordReissue = ({ open, onClose }: PasswordReissueProps) => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log(data.email);
        onClose();
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
