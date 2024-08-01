package com.example.attendance_back.config;

import java.io.IOException;
import java.sql.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.dto.SecurityDto;
import com.example.attendance_back.repository.EmployeeRepository;
import com.example.attendance_back.repository.SecurityRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomLoginFailureHandler implements AuthenticationFailureHandler {

	// ログイン失敗の最大回数を定義
	private final int MAX_COUNTS = 5;
	@Autowired
	private SecurityRepository securityRepository;
	@Autowired
	private EmployeeRepository employeeRepository;

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		// リクエストからメールアドレスを取得
		String email = request.getParameter("email");

		// 従業員情報をデータベースから取得
		EmployeeDto employee = employeeRepository.findByEmail(email);

		if (employee != null) {

			// 従業員IDを使ってセキュリティ情報をデータベースから取得
			SecurityDto security = securityRepository.findByEmployeeid(employee.getEmployeeid());

			if (security == null) {
				// セキュリティ情報が存在しない時は新しいセキュリティ情報を作成
				security = new SecurityDto();
				security.setEmployeeid(employee.getEmployeeid());
				security.setFailedCount(0);
			}

			// 失敗回数をカウントアップ
			int failedCounts = security.getFailedCount() + 1;
			security.setFailedCount(failedCounts);

			// 失敗回数が最大回数を超えた時はロック時間を現在の時間に設定
			if (failedCounts > MAX_COUNTS) {
				security.setLockTime(new Date(System.currentTimeMillis()));
			}
			// 更新したセキュリティ情報をデータベースに保存
			securityRepository.save(security);
		}

		// 認証失敗は401を返す
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	}

}
