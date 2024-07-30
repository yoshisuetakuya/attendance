package com.example.attendance_back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // このクラスが設定クラスであることを示す
@EnableWebSecurity // Webセキュリティを有効にすることを示す
public class SecurityConfig {

	@Autowired
	private CustomLoginSuccessHandler customloginSuccessHandler;
	@Autowired
	private CustomLoginFailureHandler customLoginFailureHandler;
	@Autowired
	private CustomLogoutSuccessHandler customLogoutSuccessHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable()) // CSRF保護を無効化
				.authorizeHttpRequests(authorizeRequests -> authorizeRequests // 認証リクエストの設定
						.requestMatchers("/createUser").permitAll() // ユーザー登録のエンドポイントのためアクセスを許可
						.requestMatchers("/reissue").permitAll() // パスワード再発行のエンドポイントのためアクセスを許可
						.anyRequest().authenticated()// 認証されたユーザーに限定 それ以外の全てのリクエストは認証が必要です
				).formLogin(formLogin -> formLogin // ログイン画面の設定
						.permitAll()// 誰でもログインページにアクセスできる
//				.loginPage("/login").permitAll() //　ログインページのURLを設定
//						.loginProcessingUrl("/login") // ログイン処理のURLを設定
						.successHandler(customloginSuccessHandler) // カスタム認証成功設定
						.failureHandler(customLoginFailureHandler) // カスタム認証失敗ハンドラ
						.usernameParameter("email") // ユーザー名のパラメータをemailに変更
						.passwordParameter("password") // パスワードのパラメータをpasswordに設定
				).logout(logout -> logout // ログアウト画面の設定
						.permitAll()// 誰でもログアウトできる
						.logoutSuccessHandler(customLogoutSuccessHandler) // カスタムログアウト成功ハンドラ
				);


		return http.build();
	}

	// パスワードのアルゴリズムをBCryptに設定
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
