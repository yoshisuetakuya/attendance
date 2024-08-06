package com.example.attendance_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.attendance_back.repository.SystemRepository;

/**
 *
 * @author 芳末拓也
 *
 *         システム情報を提供するサービスクラス
 */
@Service
public class SystemService {
	@Autowired
	private SystemRepository systemRepository;

	/**
	 * 編集可能期間の情報を取得するメソッド
	 *
	 * @return 編集可能期間
	 */
	public String getEdithingPeriod() {
		return systemRepository.getEdithingPeriod();
	}

}
