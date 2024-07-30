package com.example.attendance_back.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.attendance_back.dto.EmployeeDto;

import java.util.Collection;

public class LoginUserDetails implements UserDetails {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	//作成したEmployeeDtoをフィールドに持たせる
    private final EmployeeDto employee;


    /**
	 * コンストラクタ
	 * @param employee
	 */
    public LoginUserDetails(EmployeeDto employee) {
        this.employee = employee;
    }

    /**
	 * ロールの取得（今回は使わないのでnullをリターン）
	 */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    	return null;
    }

    @Override
    public String getPassword() {
		return employee.getPassword();

    }

    @Override
    public String getUsername() {
        return employee.getEmail(); // データベースから取得したメールアドレスをユーザー名として返す
    }

    //ユーザー名の確認用
    public String getName() {
		return employee.getName();

    }

    @Override
    public boolean isAccountNonExpired() {
        return true; //  ユーザーが期限切れでなければtrueを返す
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; //  ユーザーがロックされていなければtrueを返す
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; //  パスワードが期限切れでなければtrueを返す
    }

    @Override
    public boolean isEnabled() {
        return true; //  ユーザーが有効ならtrueを返す
    }
}
