//package com.example.attendance_back.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//	@Autowired
//	private JavaMailSender mailSender;
//
//	public void sendPasswordResetEmail(String to, String newPassword) {
//		SimpleMailMessage message = new SimpleMailMessage();
//		message.setTo(to);
//		message.setSubject("パスワードリセット");
//		message.setText(
//			    "あなたの新しいパスワードは以下の通りです\n"
//			    + newPassword + "\n\n"
//			    + "パスワードの変更後はこのパスワードを忘れないように必ず保存してください。\n"
//			    + "またはパスワードの変更より任意のパスワードへと変更してください。"
//			);
//
//		mailSender.send(message);
//	}
//
//}
