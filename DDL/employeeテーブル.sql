create table public.employee (
  employeeid serial not null
  , name character varying(50) not null
  , email character varying(100) not null
  , password character varying(200) not null
  , primary key (employeeid)
);
