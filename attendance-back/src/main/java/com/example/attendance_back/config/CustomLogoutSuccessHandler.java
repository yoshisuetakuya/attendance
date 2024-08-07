package com.example.attendance_back.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author 芳末拓也
 *
 *         ログアウト成功時の処理を行うクラス
 */
@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {
	/**
	 * ログアウト成功時に実行するメソッド
	 */
	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		response.setStatus(HttpServletResponse.SC_OK); // 200ステータスコードを返す
	}

}
