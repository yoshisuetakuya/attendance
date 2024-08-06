package com.example.attendance_back.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.attendance_back.dto.EmployeeDto;

import java.util.Collection;

/**
 *
 * @author 芳末拓也
 *
 *         ユーザーの認証情報を提供するサービスクラス
 *
 *         EmployeeDtoオブジェクトを使用してユーザー情報を管理する
 *
 */
public class LoginUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;

	private final EmployeeDto employee;

	/**
	 * EmployeeDtoオブジェクトを初期化するコンストラクタ
	 *
	 * @param employee
	 */
	public LoginUserDetails(EmployeeDto employee) {
		this.employee = employee;
	}

	/**
	 * ユーザーに割り当てられた権限を返すメソッド
	 *
	 * @return ユーザーの権限
	 */
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// 権限の設定が必要な場合はここで返す
		// 今回は未設定のためnullを返している
		return null;
	}

	/**
	 * ユーザーのパスワードを返すメソッド
	 *
	 * @return パスワード
	 */
	@Override
	public String getPassword() {
		// EmployeeDtoから取得した暗号化済みパスワードを返す
		return employee.getPassword();

	}

	/**
	 * ユーザーのメールアドレスを返すメソッド
	 *
	 * @return メールアドレス
	 */
	@Override
	public String getUsername() {
		// EmployeeDtoから取得したメールアドレスをユーザー名として返す
		return employee.getEmail();
	}

	/**
	 * ユーザーの名前を返すメソッド
	 *
	 * @return 名前
	 */
	public String getName() {
		// EmployeeDtoから取得した名前を返す
		return employee.getName();

	}

	/**
	 * ユーザーアカウントが期限切れでないかどうかを返すメソッド
	 *
	 * @return true（期限切れでない場合）
	 */
	@Override
	public boolean isAccountNonExpired() {
		// アカウントが期限切れでないことを示す
		return true;
	}

	/**
	 * ユーザーアカウントがロックされていないかどうかを返すメソッド
	 *
	 * @return true（ロックされていない場合）
	 */
	@Override
	public boolean isAccountNonLocked() {
		// アカウントがロックされていないことを示す
		return true;
	}

	/**
	 * ユーザーの資格情報が期限切れでないかどうかを返すメソッド
	 *
	 * @return true（期限切れでない場合）
	 */
	@Override
	public boolean isCredentialsNonExpired() {
		// 資格情報（パスワード）が期限切れでないことを示す
		return true;
	}

	/**
	 * ユーザーアカウントが有効かどうかを返すメソッド
	 *
	 * @return true（有効な場合）
	 */
	@Override
	public boolean isEnabled() {
		// アカウントが有効であることを示す
		return true;
	}
}
