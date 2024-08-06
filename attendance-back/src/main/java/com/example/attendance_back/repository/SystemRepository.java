package com.example.attendance_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.attendance_back.dto.SystemDto;

/**
 *
 * @author 芳末拓也
 *
 *         systemテーブルを操作するリポジトリクラス
 */
public interface SystemRepository extends JpaRepository<SystemDto, Integer> {
	/**
	 * 現在の編集期間を取得するメソッド
	 *
	 * systemテーブルに最新月の年月を追加してそのレコードのsystemidで書き換えると今月の編集期間情報を取得できる
	 *
	 * @return 現在の編集期間を取得
	 */
	@Query("SELECT TO_CHAR(s.editingperiod, 'YYYYMM') FROM SystemDto s WHERE s.systemid = 4")
	String getEdithingPeriod();

}
