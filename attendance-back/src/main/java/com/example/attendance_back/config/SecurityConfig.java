package com.example.attendance_back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 *
 * @author 芳末拓也
 *
 *         SpringSecurityの設定クラス
 */
@Configuration // このクラスが設定クラスであることを示す
@EnableWebSecurity // Webセキュリティを有効にすることを示す
public class SecurityConfig {

	@Autowired
	private CustomLoginSuccessHandler customloginSuccessHandler;

	@Autowired
	private CustomLoginFailureHandler customLoginFailureHandler;

	@Autowired
	private CustomLogoutSuccessHandler customLogoutSuccessHandler;

	/**
	 * SpringSecurityの設定
	 *
	 * @param http
	 * @return SecurityFilterChain
	 * @throws Exception
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable()) // CSRF保護を無効化
				.authorizeHttpRequests(authorizeRequests -> authorizeRequests // 認証リクエスト設定
						.requestMatchers("/createUser").permitAll() // ユーザー登録のエンドポイントのアクセスを許可
						.requestMatchers("/reissue").permitAll() // パスワード再発行のエンドポイントのアクセスを許可
						.anyRequest().authenticated()// 認証されたユーザーに限定
				).formLogin(formLogin -> formLogin // ログイン画面の設定
						.permitAll()// 誰でもログインページにアクセスできる
						.loginPage("/login").permitAll() // ログインページのURLを設定
						.loginProcessingUrl("/login") // ログインエンドポイントのURLを設定
						.successHandler(customloginSuccessHandler) // カスタム認証成功ハンドラ
						.failureHandler(customLoginFailureHandler) // カスタム認証失敗ハンドラ
						.usernameParameter("email") // ユーザー名のパラメータをemailに設定
						.passwordParameter("password") // パスワードのパラメータをpasswordに設定
				).logout(logout -> logout // ログアウト画面の設定
						.permitAll()// 誰でもログアウトできる
						.logoutSuccessHandler(customLogoutSuccessHandler) // カスタムログアウト成功ハンドラ
				);

		return http.build();
	}

	/**
	 * パスワードのエンコードを行うクラス
	 *
	 * @return BCryptPasswordEncoder
	 */
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
