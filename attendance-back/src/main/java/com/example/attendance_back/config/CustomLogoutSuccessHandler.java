package com.example.attendance_back.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler{
	 @Override
	    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
	                                Authentication authentication) throws IOException, ServletException {
	        response.setStatus(HttpServletResponse.SC_OK); // 200ステータスコードを返す
	     // レスポンスボディに書き込む必要がない場合、以下のコードは不要
//	        response.getWriter().write("Logout successful!"); // 必要に応じてレスポンスボディにメッセージを設定
//	        response.getWriter().flush();
	    }

}
