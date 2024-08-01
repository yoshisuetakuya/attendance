package com.example.attendance_back.dto;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "security")
public class SecurityDto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "securityid")
	private Integer securityid;

	@Column(name = "employeeid")
	private Integer employeeid;

	@Column(name = "failedcount")
	private Integer failedCount;

	@Column(name = "locktime")
	private Date lockTime;

}
