package com.example.attendance_back.service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.attendance_back.dto.EmployeeDto;
import com.example.attendance_back.dto.SecurityDto;
import com.example.attendance_back.repository.EmployeeRepository;
import com.example.attendance_back.repository.SecurityRepository;

/**
 *
 * @author 芳末拓也
 *
 *         ユーザーのログイン処理を行うサービスクラス
 */
@Service
public class LoginService implements UserDetailsService {

	@Autowired
	private EmployeeRepository EmployeeRepository;

	@Autowired
	private SecurityRepository securityRepository;

	/**
	 * 指定されたメールアドレスに基づいてユーザー情報を探しログイン失敗時の処理を記載したメソッド
	 *
	 * @param email
	 * @return LoginUserDetails
	 */
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// メールアドレスから従業員情報を取得
		EmployeeDto employee = EmployeeRepository.findByEmail(email);
		if (employee == null) {
			throw new UsernameNotFoundException("ユーザーが見つかりませんでした");
		}

		// 従業員IDを使ってセキュリティ情報を取得
		SecurityDto security = securityRepository.findByEmployeeid(employee.getEmployeeid());

		// セキュリティ情報が存在してロック時間が設定されている場合
		if (security != null && security.getLockTime() != null) {
			// 現在の時間とロック時間の差を計算する
			long lockTime = TimeUnit.MILLISECONDS.toMinutes(new Date().getTime() - security.getLockTime().getTime());
			if (lockTime < 15) {
				throw new UsernameNotFoundException("アカウントがロックされました");
			}
		}
		// ログイン成功時にはLoginUserDetailsを返す
		return new LoginUserDetails(employee);
	}

}
