package com.example.attendance_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance_back.service.SystemService;

/**
 *
 * @author 芳末拓也
 *
 *         現在の編集可能期間を取得するコントローラクラス
 *
 */
@RestController
public class SystemController {
	@Autowired
	private SystemService systemService;

	/**
	 * 現在の編集可能期間を取得するメソッド
	 *
	 * @return 編集可能期間
	 */
	@GetMapping("/getEdithingPeriod")
	public String getYearMonth() {
		return systemService.getEdithingPeriod();
	}

}
