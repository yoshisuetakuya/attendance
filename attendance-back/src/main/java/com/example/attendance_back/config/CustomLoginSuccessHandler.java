package com.example.attendance_back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.dto.SecurityDto;
import com.example.attendance_back.repository.EmployeeRepository;
import com.example.attendance_back.repository.SecurityRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author 芳末拓也
 *
 *         ログイン成功時の処理を行うクラス
 */
@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

	@Autowired
	private SecurityRepository securityRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	/**
	 * 認証成功時に失敗回数をリセットしてロックを解除するメソッド
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		// ユーザーのメールアドレスを取得
		String email = authentication.getName();

		// メールアドレスを使って従業員情報を取得
		EmployeeDto employee = employeeRepository.findByEmail(email);

		// 従業員IDを使ってセキュリティ情報を取得:
		SecurityDto security = securityRepository.findByEmployeeid(employee.getEmployeeid());

		if (security != null) {
			security.setFailedCount(0);
			security.setLockTime(null);
			securityRepository.save(security);
		}
		response.setStatus(HttpServletResponse.SC_OK);
	}
}