package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 *
 * @author 芳末拓也
 *
 *         パスワードリセットのためのメールを送信するサービスクラス
 *
 */
@Service
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;

	/**
	 * パスワードリセットのメールを送信するメソッド
	 *
	 * @param to
	 * @param newPassword
	 */
	public void sendPasswordResetEmail(String to, String newPassword) {
		SimpleMailMessage message = new SimpleMailMessage();
		// メールの送信先
		message.setTo(to);
		// メールのタイトル
		message.setSubject("パスワードリセット");
		// メッセージ
		message.setText("あなたの新しいパスワードは以下の通りです\n" + newPassword + "\n\n" + "パスワードの変更後はこのパスワードを忘れないように必ず保存してください。\n"
				+ "またはパスワードの変更より任意のパスワードへと変更してください。");

		mailSender.send(message);
	}

}
