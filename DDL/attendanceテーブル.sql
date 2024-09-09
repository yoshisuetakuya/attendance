create table public.attendance (
  attendanceid serial not null
  , employeeid integer not null
  , year integer not null
  , month integer not null
  , day integer not null
  , starttime time without time zone not null
  , endtime time without time zone not null
  , breaktime time without time zone not null
  , workinghours time without time zone not null
  , earlyhours time without time zone not null
  , overtimehours time without time zone not null
  , nightandholidayworks time without time zone not null
  , summary character varying(100)
  , memo character varying(200)
  , primary key (attendanceid)
);
