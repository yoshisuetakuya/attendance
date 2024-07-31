package com.example.attendance_back.config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomLoginFailureHandler implements AuthenticationFailureHandler{
	 @Override
	    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401ステータスコードを返す
	 }

}
