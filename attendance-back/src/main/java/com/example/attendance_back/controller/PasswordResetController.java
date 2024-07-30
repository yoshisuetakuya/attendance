package com.example.attendance_back.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.PasswordResetService;

@RestController
public class PasswordResetController {


    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/reissue")
    public String requestPasswordReset(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        boolean isResetRequested = passwordResetService.resetPassword(email);
        if (isResetRequested) {
            return "パスワードをリセットしてメールを送信しました";
        } else {
            return "入力されたメールアドレスが見つかりませんでした";
        }
    }


}
