// ログイン画面のフォームのデータ型を定義
export interface FormValues {
  email: string;
  password: string;
}
// 新規登録画面の型定義
export interface NewFormValues {
  name: string;
  email: string;
  password: string;
}
// 新規登録画面コンポーネントに渡すプロップス
export interface CreateNewUserProps {
  open: boolean;
  onClose: () => void;
  showPassword: boolean;
  handleClickShowPassword: () => void;
}
// パスワード再発行画面コンポーネントに渡すプロップス
export interface PasswordReissueProps {
  open: boolean;
  onClose: () => void;
}
// パスワード再発行画面の型定義
export interface ReissueFormValues {
  email: string;
}
// パスワード更新画面コンポーネントに渡すプロップス
export interface PasswordUpdateProps {
  open: boolean;
  onClose: () => void;
}
//　パスワード更新画面の型定義
export interface UpdateFormValues {
  currentPassword: string;
  newPassword: string;
}
// 取得した編集期間のデータ型
export type SystemData = string[];
// 出勤簿の各日のデータ構造を定義
export interface AttendanceData {
  attendanceid: number | null; // 勤怠情報ID（初期はnullになっており後でデータベースに保存される際に割り当てられる）
  day: number; // 日付
  weekday: string; // 曜日
  starttime: Date | null; // 始業時間
  endtime: Date | null; // 終業時間
  breaktime: Date | null; // 休憩時間
  workinghours: Date | null; // 所定内労働時間
  earlyhours: Date | null; // 早出時間
  overtimehours: Date | null; // 残業時間
  nightandholidayworks: Date | null; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}
// 取得した勤怠情報の型定義
export interface GetAttendanceData {
  attendanceid: number | null; // 勤怠情報ID（初期はnullになっており後でデータベースに保存される際に割り当てられる）
  day: number; // 日付
  starttime: string; // 始業時間
  endtime: string; // 終業時間
  breaktime: string; // 休憩時間
  workinghours: string; // 所定内労働時間
  earlyhours: string; // 早出時間
  overtimehours: string; // 残業時間
  nightandholidayworks: string; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}
// 登録する勤怠情報の型定義
export interface PostAttendanceData {
  year: string; // 年
  month: string; // 月
  day: string; // 日
  starttime: string | null; // 始業時間
  endtime: string | null; // 終業時間
  breaktime: string | null; // 休憩時間
  workinghours: string | null; // 所定内労働時間
  earlyhours: string | null; // 早出時間
  overtimehours: string | null; // 残業時間
  nightandholidayworks: string | null; // 深夜および休日出勤時間
  summary: string; // 摘要
  memo: string; // 備考
}
// セットする勤務時間の型定義
export interface Initialtime {
  selectedStartTime: Date | null;
  selectedEndTime: Date | null;
  selectedBreakTime: Date | null;
}
// 勤怠詳細情報に渡すプロップス
export interface AttendanceDetailsProps {
  year: string;
  month: string;
  attendanceData: AttendanceData[];
}
// 勤怠管理テーブルの行コンポーネントの型を定義
export interface AttendanceRowProps {
  data: {
    day: number;
    weekday: string;
    starttime: Date | null;
    endtime: Date | null;
    breaktime: Date | null;
    workinghours: Date | null;
    earlyhours: Date | null;
    overtimehours: Date | null;
    nightandholidayworks: Date | null;
    summary: string;
    memo: string;
  };
  handleStartTimeChange: (day: number, time: Date | null) => void;
  handleEndTimeChange: (day: number, time: Date | null) => void;
  handleBreakTimeChange: (day: number, time: Date | null) => void;
  handleWorkingHoursChange: (day: number, time: Date | null) => void;
  handleEarlyHoursChange: (day: number, time: Date | null) => void;
  handleOvertimeHoursChange: (day: number, time: Date | null) => void;
  handleNightAndHolidayWorksChange: (day: number, time: Date | null) => void;
  handleSummaryChange: (day: number, event: SelectChangeEvent<string>) => void;
  handleMemoChange: (day: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
// 勤怠テーブル合計行コンポーネントに渡すプロップス
export interface TableTotalPrpps {
  attendanceData: AttendanceData[];
  style?: React.CSSProperties;
}
