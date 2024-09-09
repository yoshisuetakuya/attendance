create table public.security (
  securityid serial not null
  , employeeid integer not null
  , failedcount integer default 0
  , locktime timestamp(6) without time zone
  , primary key (securityid)
);
