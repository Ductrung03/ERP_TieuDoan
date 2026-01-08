--
-- PostgreSQL database dump
--

\restrict gWF4AqR8lXHFuzDX7Db3p0spkBzYAHIAvtoQuBlhnTBuA4jX51yvlqaESE3CQwY

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-01-07 17:04:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 237 (class 1259 OID 68851)
-- Name: seq_bb_vktb; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_bb_vktb
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_bb_vktb OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 264 (class 1259 OID 69161)
-- Name: bbmuontravktb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bbmuontravktb (
    mabb character varying(20) DEFAULT ('BB'::text || lpad((nextval('public.seq_bb_vktb'::regclass))::text, 6, '0'::text)) NOT NULL,
    thoigian timestamp without time zone,
    muonhaytra boolean,
    mavktb character varying(20)
);


ALTER TABLE public.bbmuontravktb OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 68845)
-- Name: seq_cagac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_cagac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_cagac OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 69069)
-- Name: cagac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cagac (
    macagac character varying(20) DEFAULT ('CG'::text || lpad((nextval('public.seq_cagac'::regclass))::text, 4, '0'::text)) NOT NULL,
    thoigianbatdau timestamp without time zone,
    thoigianketthuc timestamp without time zone
);


ALTER TABLE public.cagac OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 68838)
-- Name: seq_canbo; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_canbo
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_canbo OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 68910)
-- Name: canbo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canbo (
    macanbo character varying(20) DEFAULT ('CB'::text || lpad((nextval('public.seq_canbo'::regclass))::text, 5, '0'::text)) NOT NULL,
    hoten character varying(255) NOT NULL,
    ngaysinh date,
    diachi text,
    sdt character varying(20),
    gmail character varying(100),
    thoigianden date,
    thoigiandi date,
    madonvi character varying(20)
);


ALTER TABLE public.canbo OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 68996)
-- Name: canbo_chucvu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canbo_chucvu (
    macanbo character varying(20) NOT NULL,
    machucvu character varying(20) NOT NULL,
    tgbonhiem date,
    tgketthuc date
);


ALTER TABLE public.canbo_chucvu OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 69011)
-- Name: canbo_quanham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.canbo_quanham (
    macanbo character varying(20) NOT NULL,
    maquanham character varying(20) NOT NULL,
    tgthangquanham date,
    tgketthuc date
);


ALTER TABLE public.canbo_quanham OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 68835)
-- Name: seq_chucvu; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_chucvu
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_chucvu OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 68886)
-- Name: chucvu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chucvu (
    machucvu character varying(20) DEFAULT ('CV'::text || lpad((nextval('public.seq_chucvu'::regclass))::text, 3, '0'::text)) NOT NULL,
    tenchucvu character varying(100) NOT NULL,
    kyhieu character varying(50)
);


ALTER TABLE public.chucvu OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 68837)
-- Name: seq_donvi; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_donvi
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_donvi OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 68898)
-- Name: donvi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donvi (
    madonvi character varying(20) DEFAULT ('DV'::text || lpad((nextval('public.seq_donvi'::regclass))::text, 4, '0'::text)) NOT NULL,
    tendonvi character varying(255) NOT NULL,
    tongquanso integer DEFAULT 0,
    kyhieu character varying(50),
    madonvitren character varying(20)
);


ALTER TABLE public.donvi OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 68853)
-- Name: seq_gacvktb; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_gacvktb
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_gacvktb OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 69185)
-- Name: gacvktb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gacvktb (
    magvktb character varying(20) DEFAULT ('GVK'::text || lpad((nextval('public.seq_gacvktb'::regclass))::text, 6, '0'::text)) NOT NULL,
    mapc character varying(20),
    mabb character varying(20)
);


ALTER TABLE public.gacvktb OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 68839)
-- Name: seq_hocvien; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_hocvien
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_hocvien OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 68923)
-- Name: hocvien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hocvien (
    mahocvien character varying(20) DEFAULT ('HV'::text || lpad((nextval('public.seq_hocvien'::regclass))::text, 5, '0'::text)) NOT NULL,
    hoten character varying(255) NOT NULL,
    ngaysinh date,
    diachi text,
    sdt character varying(20),
    gmail character varying(100),
    madonvi character varying(20)
);


ALTER TABLE public.hocvien OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 69026)
-- Name: hocvien_chucvu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hocvien_chucvu (
    mahocvien character varying(20) NOT NULL,
    machucvu character varying(20) NOT NULL,
    tgbonhiem date,
    tgketthuc date
);


ALTER TABLE public.hocvien_chucvu OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 69041)
-- Name: hocvien_quanham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hocvien_quanham (
    mahocvien character varying(20) NOT NULL,
    maquanham character varying(20) NOT NULL,
    tgthangquanham date,
    tgketthuc date
);


ALTER TABLE public.hocvien_quanham OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 68849)
-- Name: seq_ktgac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_ktgac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_ktgac OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 69120)
-- Name: kiemtragac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kiemtragac (
    maktgac character varying(20) DEFAULT ('KT'::text || lpad((nextval('public.seq_ktgac'::regclass))::text, 6, '0'::text)) NOT NULL,
    ngay date,
    trangthai character varying(100),
    nhiemvuhocvien text,
    macagac character varying(20),
    mavp character varying(20),
    macanbo character varying(20)
);


ALTER TABLE public.kiemtragac OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 68844)
-- Name: seq_lichgac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_lichgac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_lichgac OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 69056)
-- Name: lichgac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lichgac (
    malichgac character varying(20) DEFAULT ('LG'::text || lpad((nextval('public.seq_lichgac'::regclass))::text, 6, '0'::text)) NOT NULL,
    ngaygac date NOT NULL,
    ghichu text,
    matkhauhoi character varying(255),
    matkhaudap character varying(255),
    madonvi character varying(20)
);


ALTER TABLE public.lichgac OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 68843)
-- Name: seq_lsmk; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_lsmk
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_lsmk OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 68984)
-- Name: lichsumatkhau; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lichsumatkhau (
    malsmk character varying(20) DEFAULT ('MK'::text || lpad((nextval('public.seq_lsmk'::regclass))::text, 6, '0'::text)) NOT NULL,
    mataikhoan character varying(20),
    hashmatkhau character varying(255),
    thoigianthaydoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lichsumatkhau OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 68850)
-- Name: seq_nghigac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_nghigac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_nghigac OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 69143)
-- Name: lichsunghigac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lichsunghigac (
    manghigac character varying(20) DEFAULT ('NG'::text || lpad((nextval('public.seq_nghigac'::regclass))::text, 5, '0'::text)) NOT NULL,
    ngaybd date,
    ngaykt date,
    lydo text,
    mahocvien character varying(20),
    canboduyet character varying(20)
);


ALTER TABLE public.lichsunghigac OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 68833)
-- Name: seq_loaivktb; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_loaivktb
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_loaivktb OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 68867)
-- Name: loaivktb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loaivktb (
    maloaivktb character varying(20) DEFAULT ('LVK'::text || lpad((nextval('public.seq_loaivktb'::regclass))::text, 3, '0'::text)) NOT NULL,
    tenloai character varying(255) NOT NULL
);


ALTER TABLE public.loaivktb OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 68852)
-- Name: seq_luotbienche; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_luotbienche
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_luotbienche OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 69172)
-- Name: luotbienche; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.luotbienche (
    maluotbienche character varying(20) DEFAULT ('LBC'::text || lpad((nextval('public.seq_luotbienche'::regclass))::text, 5, '0'::text)) NOT NULL,
    thoigianbatdau date,
    thoigianketthuc date,
    ghichu text,
    mavktb character varying(20)
);


ALTER TABLE public.luotbienche OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 68841)
-- Name: seq_nhatky; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_nhatky
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_nhatky OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 68958)
-- Name: nhatkytruycap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nhatkytruycap (
    manhatky character varying(20) DEFAULT ('NK'::text || lpad((nextval('public.seq_nhatky'::regclass))::text, 8, '0'::text)) NOT NULL,
    mataikhoan character varying(20),
    thoigian timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hanhdong text
);


ALTER TABLE public.nhatkytruycap OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 68847)
-- Name: seq_nhiemvu; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_nhiemvu
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_nhiemvu OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 69083)
-- Name: nhiemvu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nhiemvu (
    manhiemvu character varying(20) DEFAULT ('NV'::text || lpad((nextval('public.seq_nhiemvu'::regclass))::text, 4, '0'::text)) NOT NULL,
    tennhiemvu character varying(255),
    mavonggac character varying(20)
);


ALTER TABLE public.nhiemvu OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 68848)
-- Name: seq_pcgac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_pcgac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_pcgac OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 69094)
-- Name: pcgac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pcgac (
    mapc character varying(20) DEFAULT ('PC'::text || lpad((nextval('public.seq_pcgac'::regclass))::text, 6, '0'::text)) NOT NULL,
    mahocvien character varying(20),
    macagac character varying(20),
    mavonggac character varying(20),
    malichgac character varying(20)
);


ALTER TABLE public.pcgac OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 68842)
-- Name: seq_phien; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_phien
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_phien OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 68972)
-- Name: phiendangnhap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phiendangnhap (
    maphien character varying(20) DEFAULT ('SS'::text || lpad((nextval('public.seq_phien'::regclass))::text, 8, '0'::text)) NOT NULL,
    mataikhoan character varying(20),
    thoigiandn timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    thoigiandx timestamp without time zone
);


ALTER TABLE public.phiendangnhap OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 68836)
-- Name: seq_quanham; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_quanham
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_quanham OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 68892)
-- Name: quanham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quanham (
    maquanham character varying(20) DEFAULT ('QH'::text || lpad((nextval('public.seq_quanham'::regclass))::text, 3, '0'::text)) NOT NULL,
    tenquanham character varying(100) NOT NULL,
    kyhieu character varying(50)
);


ALTER TABLE public.quanham OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 68840)
-- Name: seq_taikhoan; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_taikhoan
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_taikhoan OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 68832)
-- Name: seq_vaitro; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_vaitro
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_vaitro OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 68781)
-- Name: seq_vipham; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_vipham
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_vipham OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 68834)
-- Name: seq_vktb; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_vktb
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_vktb OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 68846)
-- Name: seq_vonggac; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_vonggac
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_vonggac OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 68936)
-- Name: taikhoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taikhoan (
    mataikhoan character varying(20) DEFAULT ('TK'::text || lpad((nextval('public.seq_taikhoan'::regclass))::text, 5, '0'::text)) NOT NULL,
    tendn character varying(100) NOT NULL,
    matkhau character varying(255) NOT NULL,
    salt character varying(255),
    sdt character varying(20),
    landangnhapcuoi timestamp without time zone,
    trangthai character varying(50) DEFAULT 'Active'::character varying,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    maquyen character varying(20),
    madonvi character varying(20)
);


ALTER TABLE public.taikhoan OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 68861)
-- Name: vaitro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaitro (
    maquyen character varying(20) DEFAULT ('VT'::text || lpad((nextval('public.seq_vaitro'::regclass))::text, 2, '0'::text)) NOT NULL,
    tenquyen character varying(100) NOT NULL
);


ALTER TABLE public.vaitro OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 68854)
-- Name: vipham; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vipham (
    mavipham character varying(20) DEFAULT ('VP'::text || lpad((nextval('public.seq_vipham'::regclass))::text, 4, '0'::text)) NOT NULL,
    tenvipham character varying(255) NOT NULL,
    diemtru integer DEFAULT 0
);


ALTER TABLE public.vipham OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 68873)
-- Name: vktb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vktb (
    mavktb character varying(20) DEFAULT ('VK'::text || lpad((nextval('public.seq_vktb'::regclass))::text, 5, '0'::text)) NOT NULL,
    tenvktb character varying(255) NOT NULL,
    donvitinh character varying(50),
    tinhtrang character varying(255),
    ghichu text,
    maloaivktb character varying(20)
);


ALTER TABLE public.vktb OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 69075)
-- Name: vonggac; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vonggac (
    mavonggac character varying(20) DEFAULT ('VG'::text || lpad((nextval('public.seq_vonggac'::regclass))::text, 3, '0'::text)) NOT NULL,
    tenvonggac character varying(255),
    giobatdau timestamp without time zone,
    gioketthuc timestamp without time zone,
    mota text
);


ALTER TABLE public.vonggac OWNER TO postgres;

--
-- TOC entry 5178 (class 0 OID 69161)
-- Dependencies: 264
-- Data for Name: bbmuontravktb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bbmuontravktb (mabb, thoigian, muonhaytra, mavktb) FROM stdin;
\.


--
-- TOC entry 5172 (class 0 OID 69069)
-- Dependencies: 258
-- Data for Name: cagac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cagac (macagac, thoigianbatdau, thoigianketthuc) FROM stdin;
\.


--
-- TOC entry 5161 (class 0 OID 68910)
-- Dependencies: 247
-- Data for Name: canbo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.canbo (macanbo, hoten, ngaysinh, diachi, sdt, gmail, thoigianden, thoigiandi, madonvi) FROM stdin;
\.


--
-- TOC entry 5167 (class 0 OID 68996)
-- Dependencies: 253
-- Data for Name: canbo_chucvu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.canbo_chucvu (macanbo, machucvu, tgbonhiem, tgketthuc) FROM stdin;
\.


--
-- TOC entry 5168 (class 0 OID 69011)
-- Dependencies: 254
-- Data for Name: canbo_quanham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.canbo_quanham (macanbo, maquanham, tgthangquanham, tgketthuc) FROM stdin;
\.


--
-- TOC entry 5158 (class 0 OID 68886)
-- Dependencies: 244
-- Data for Name: chucvu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chucvu (machucvu, tenchucvu, kyhieu) FROM stdin;
\.


--
-- TOC entry 5160 (class 0 OID 68898)
-- Dependencies: 246
-- Data for Name: donvi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donvi (madonvi, tendonvi, tongquanso, kyhieu, madonvitren) FROM stdin;
DV0001	Đại đội 157	0	\N	\N
DV0002	Tiểu đoàn 1	0	\N	\N
DV0003	Đại đội 157	0	\N	\N
DV0004	Tiểu đoàn 1	0	\N	\N
\.


--
-- TOC entry 5180 (class 0 OID 69185)
-- Dependencies: 266
-- Data for Name: gacvktb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gacvktb (magvktb, mapc, mabb) FROM stdin;
\.


--
-- TOC entry 5162 (class 0 OID 68923)
-- Dependencies: 248
-- Data for Name: hocvien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hocvien (mahocvien, hoten, ngaysinh, diachi, sdt, gmail, madonvi) FROM stdin;
HV00001	Nguyễn Tuấn	2003-10-02	\N	012356789		DV0001
\.


--
-- TOC entry 5169 (class 0 OID 69026)
-- Dependencies: 255
-- Data for Name: hocvien_chucvu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hocvien_chucvu (mahocvien, machucvu, tgbonhiem, tgketthuc) FROM stdin;
\.


--
-- TOC entry 5170 (class 0 OID 69041)
-- Dependencies: 256
-- Data for Name: hocvien_quanham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hocvien_quanham (mahocvien, maquanham, tgthangquanham, tgketthuc) FROM stdin;
\.


--
-- TOC entry 5176 (class 0 OID 69120)
-- Dependencies: 262
-- Data for Name: kiemtragac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kiemtragac (maktgac, ngay, trangthai, nhiemvuhocvien, macagac, mavp, macanbo) FROM stdin;
\.


--
-- TOC entry 5171 (class 0 OID 69056)
-- Dependencies: 257
-- Data for Name: lichgac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lichgac (malichgac, ngaygac, ghichu, matkhauhoi, matkhaudap, madonvi) FROM stdin;
\.


--
-- TOC entry 5166 (class 0 OID 68984)
-- Dependencies: 252
-- Data for Name: lichsumatkhau; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lichsumatkhau (malsmk, mataikhoan, hashmatkhau, thoigianthaydoi) FROM stdin;
\.


--
-- TOC entry 5177 (class 0 OID 69143)
-- Dependencies: 263
-- Data for Name: lichsunghigac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lichsunghigac (manghigac, ngaybd, ngaykt, lydo, mahocvien, canboduyet) FROM stdin;
\.


--
-- TOC entry 5156 (class 0 OID 68867)
-- Dependencies: 242
-- Data for Name: loaivktb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loaivktb (maloaivktb, tenloai) FROM stdin;
\.


--
-- TOC entry 5179 (class 0 OID 69172)
-- Dependencies: 265
-- Data for Name: luotbienche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.luotbienche (maluotbienche, thoigianbatdau, thoigianketthuc, ghichu, mavktb) FROM stdin;
\.


--
-- TOC entry 5164 (class 0 OID 68958)
-- Dependencies: 250
-- Data for Name: nhatkytruycap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nhatkytruycap (manhatky, mataikhoan, thoigian, hanhdong) FROM stdin;
\.


--
-- TOC entry 5174 (class 0 OID 69083)
-- Dependencies: 260
-- Data for Name: nhiemvu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nhiemvu (manhiemvu, tennhiemvu, mavonggac) FROM stdin;
\.


--
-- TOC entry 5175 (class 0 OID 69094)
-- Dependencies: 261
-- Data for Name: pcgac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pcgac (mapc, mahocvien, macagac, mavonggac, malichgac) FROM stdin;
\.


--
-- TOC entry 5165 (class 0 OID 68972)
-- Dependencies: 251
-- Data for Name: phiendangnhap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phiendangnhap (maphien, mataikhoan, thoigiandn, thoigiandx) FROM stdin;
\.


--
-- TOC entry 5159 (class 0 OID 68892)
-- Dependencies: 245
-- Data for Name: quanham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quanham (maquanham, tenquanham, kyhieu) FROM stdin;
\.


--
-- TOC entry 5163 (class 0 OID 68936)
-- Dependencies: 249
-- Data for Name: taikhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taikhoan (mataikhoan, tendn, matkhau, salt, sdt, landangnhapcuoi, trangthai, ngaytao, maquyen, madonvi) FROM stdin;
\.


--
-- TOC entry 5155 (class 0 OID 68861)
-- Dependencies: 241
-- Data for Name: vaitro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaitro (maquyen, tenquyen) FROM stdin;
\.


--
-- TOC entry 5154 (class 0 OID 68854)
-- Dependencies: 240
-- Data for Name: vipham; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vipham (mavipham, tenvipham, diemtru) FROM stdin;
\.


--
-- TOC entry 5157 (class 0 OID 68873)
-- Dependencies: 243
-- Data for Name: vktb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vktb (mavktb, tenvktb, donvitinh, tinhtrang, ghichu, maloaivktb) FROM stdin;
\.


--
-- TOC entry 5173 (class 0 OID 69075)
-- Dependencies: 259
-- Data for Name: vonggac; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vonggac (mavonggac, tenvonggac, giobatdau, gioketthuc, mota) FROM stdin;
\.


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 237
-- Name: seq_bb_vktb; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_bb_vktb', 1, false);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 231
-- Name: seq_cagac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_cagac', 1, false);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 224
-- Name: seq_canbo; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_canbo', 1, false);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 221
-- Name: seq_chucvu; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_chucvu', 1, false);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 223
-- Name: seq_donvi; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_donvi', 4, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 239
-- Name: seq_gacvktb; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_gacvktb', 1, false);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 225
-- Name: seq_hocvien; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_hocvien', 1, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 235
-- Name: seq_ktgac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_ktgac', 1, false);


--
-- TOC entry 5194 (class 0 OID 0)
-- Dependencies: 230
-- Name: seq_lichgac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_lichgac', 1, false);


--
-- TOC entry 5195 (class 0 OID 0)
-- Dependencies: 219
-- Name: seq_loaivktb; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_loaivktb', 1, false);


--
-- TOC entry 5196 (class 0 OID 0)
-- Dependencies: 229
-- Name: seq_lsmk; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_lsmk', 1, false);


--
-- TOC entry 5197 (class 0 OID 0)
-- Dependencies: 238
-- Name: seq_luotbienche; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_luotbienche', 1, false);


--
-- TOC entry 5198 (class 0 OID 0)
-- Dependencies: 236
-- Name: seq_nghigac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_nghigac', 1, false);


--
-- TOC entry 5199 (class 0 OID 0)
-- Dependencies: 227
-- Name: seq_nhatky; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_nhatky', 1, false);


--
-- TOC entry 5200 (class 0 OID 0)
-- Dependencies: 233
-- Name: seq_nhiemvu; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_nhiemvu', 1, false);


--
-- TOC entry 5201 (class 0 OID 0)
-- Dependencies: 234
-- Name: seq_pcgac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_pcgac', 1, false);


--
-- TOC entry 5202 (class 0 OID 0)
-- Dependencies: 228
-- Name: seq_phien; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_phien', 1, false);


--
-- TOC entry 5203 (class 0 OID 0)
-- Dependencies: 222
-- Name: seq_quanham; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_quanham', 1, false);


--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 226
-- Name: seq_taikhoan; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_taikhoan', 1, false);


--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 218
-- Name: seq_vaitro; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_vaitro', 1, false);


--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 217
-- Name: seq_vipham; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_vipham', 1, false);


--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 220
-- Name: seq_vktb; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_vktb', 1, false);


--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 232
-- Name: seq_vonggac; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_vonggac', 1, false);


--
-- TOC entry 4949 (class 2606 OID 69166)
-- Name: bbmuontravktb bbmuontravktb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bbmuontravktb
    ADD CONSTRAINT bbmuontravktb_pkey PRIMARY KEY (mabb);


--
-- TOC entry 4937 (class 2606 OID 69074)
-- Name: cagac cagac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cagac
    ADD CONSTRAINT cagac_pkey PRIMARY KEY (macagac);


--
-- TOC entry 4927 (class 2606 OID 69000)
-- Name: canbo_chucvu canbo_chucvu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_chucvu
    ADD CONSTRAINT canbo_chucvu_pkey PRIMARY KEY (macanbo, machucvu);


--
-- TOC entry 4913 (class 2606 OID 68917)
-- Name: canbo canbo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo
    ADD CONSTRAINT canbo_pkey PRIMARY KEY (macanbo);


--
-- TOC entry 4929 (class 2606 OID 69015)
-- Name: canbo_quanham canbo_quanham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_quanham
    ADD CONSTRAINT canbo_quanham_pkey PRIMARY KEY (macanbo, maquanham);


--
-- TOC entry 4907 (class 2606 OID 68891)
-- Name: chucvu chucvu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chucvu
    ADD CONSTRAINT chucvu_pkey PRIMARY KEY (machucvu);


--
-- TOC entry 4911 (class 2606 OID 68904)
-- Name: donvi donvi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donvi
    ADD CONSTRAINT donvi_pkey PRIMARY KEY (madonvi);


--
-- TOC entry 4953 (class 2606 OID 69190)
-- Name: gacvktb gacvktb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gacvktb
    ADD CONSTRAINT gacvktb_pkey PRIMARY KEY (magvktb);


--
-- TOC entry 4931 (class 2606 OID 69030)
-- Name: hocvien_chucvu hocvien_chucvu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_chucvu
    ADD CONSTRAINT hocvien_chucvu_pkey PRIMARY KEY (mahocvien, machucvu);


--
-- TOC entry 4915 (class 2606 OID 68930)
-- Name: hocvien hocvien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien
    ADD CONSTRAINT hocvien_pkey PRIMARY KEY (mahocvien);


--
-- TOC entry 4933 (class 2606 OID 69045)
-- Name: hocvien_quanham hocvien_quanham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_quanham
    ADD CONSTRAINT hocvien_quanham_pkey PRIMARY KEY (mahocvien, maquanham);


--
-- TOC entry 4945 (class 2606 OID 69127)
-- Name: kiemtragac kiemtragac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiemtragac
    ADD CONSTRAINT kiemtragac_pkey PRIMARY KEY (maktgac);


--
-- TOC entry 4935 (class 2606 OID 69063)
-- Name: lichgac lichgac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichgac
    ADD CONSTRAINT lichgac_pkey PRIMARY KEY (malichgac);


--
-- TOC entry 4925 (class 2606 OID 68990)
-- Name: lichsumatkhau lichsumatkhau_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichsumatkhau
    ADD CONSTRAINT lichsumatkhau_pkey PRIMARY KEY (malsmk);


--
-- TOC entry 4947 (class 2606 OID 69150)
-- Name: lichsunghigac lichsunghigac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichsunghigac
    ADD CONSTRAINT lichsunghigac_pkey PRIMARY KEY (manghigac);


--
-- TOC entry 4903 (class 2606 OID 68872)
-- Name: loaivktb loaivktb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loaivktb
    ADD CONSTRAINT loaivktb_pkey PRIMARY KEY (maloaivktb);


--
-- TOC entry 4951 (class 2606 OID 69179)
-- Name: luotbienche luotbienche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.luotbienche
    ADD CONSTRAINT luotbienche_pkey PRIMARY KEY (maluotbienche);


--
-- TOC entry 4921 (class 2606 OID 68966)
-- Name: nhatkytruycap nhatkytruycap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhatkytruycap
    ADD CONSTRAINT nhatkytruycap_pkey PRIMARY KEY (manhatky);


--
-- TOC entry 4941 (class 2606 OID 69088)
-- Name: nhiemvu nhiemvu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhiemvu
    ADD CONSTRAINT nhiemvu_pkey PRIMARY KEY (manhiemvu);


--
-- TOC entry 4943 (class 2606 OID 69099)
-- Name: pcgac pcgac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcgac
    ADD CONSTRAINT pcgac_pkey PRIMARY KEY (mapc);


--
-- TOC entry 4923 (class 2606 OID 68978)
-- Name: phiendangnhap phiendangnhap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phiendangnhap
    ADD CONSTRAINT phiendangnhap_pkey PRIMARY KEY (maphien);


--
-- TOC entry 4909 (class 2606 OID 68897)
-- Name: quanham quanham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quanham
    ADD CONSTRAINT quanham_pkey PRIMARY KEY (maquanham);


--
-- TOC entry 4917 (class 2606 OID 68945)
-- Name: taikhoan taikhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_pkey PRIMARY KEY (mataikhoan);


--
-- TOC entry 4919 (class 2606 OID 68947)
-- Name: taikhoan taikhoan_tendn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_tendn_key UNIQUE (tendn);


--
-- TOC entry 4901 (class 2606 OID 68866)
-- Name: vaitro vaitro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro
    ADD CONSTRAINT vaitro_pkey PRIMARY KEY (maquyen);


--
-- TOC entry 4899 (class 2606 OID 68860)
-- Name: vipham vipham_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vipham
    ADD CONSTRAINT vipham_pkey PRIMARY KEY (mavipham);


--
-- TOC entry 4905 (class 2606 OID 68880)
-- Name: vktb vktb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vktb
    ADD CONSTRAINT vktb_pkey PRIMARY KEY (mavktb);


--
-- TOC entry 4939 (class 2606 OID 69082)
-- Name: vonggac vonggac_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vonggac
    ADD CONSTRAINT vonggac_pkey PRIMARY KEY (mavonggac);


--
-- TOC entry 4982 (class 2606 OID 69167)
-- Name: bbmuontravktb bbmuontravktb_mavktb_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bbmuontravktb
    ADD CONSTRAINT bbmuontravktb_mavktb_fkey FOREIGN KEY (mavktb) REFERENCES public.vktb(mavktb);


--
-- TOC entry 4963 (class 2606 OID 69001)
-- Name: canbo_chucvu canbo_chucvu_macanbo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_chucvu
    ADD CONSTRAINT canbo_chucvu_macanbo_fkey FOREIGN KEY (macanbo) REFERENCES public.canbo(macanbo);


--
-- TOC entry 4964 (class 2606 OID 69006)
-- Name: canbo_chucvu canbo_chucvu_machucvu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_chucvu
    ADD CONSTRAINT canbo_chucvu_machucvu_fkey FOREIGN KEY (machucvu) REFERENCES public.chucvu(machucvu);


--
-- TOC entry 4956 (class 2606 OID 68918)
-- Name: canbo canbo_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo
    ADD CONSTRAINT canbo_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi);


--
-- TOC entry 4965 (class 2606 OID 69016)
-- Name: canbo_quanham canbo_quanham_macanbo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_quanham
    ADD CONSTRAINT canbo_quanham_macanbo_fkey FOREIGN KEY (macanbo) REFERENCES public.canbo(macanbo);


--
-- TOC entry 4966 (class 2606 OID 69021)
-- Name: canbo_quanham canbo_quanham_maquanham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.canbo_quanham
    ADD CONSTRAINT canbo_quanham_maquanham_fkey FOREIGN KEY (maquanham) REFERENCES public.quanham(maquanham);


--
-- TOC entry 4955 (class 2606 OID 68905)
-- Name: donvi donvi_madonvitren_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donvi
    ADD CONSTRAINT donvi_madonvitren_fkey FOREIGN KEY (madonvitren) REFERENCES public.donvi(madonvi);


--
-- TOC entry 4984 (class 2606 OID 69196)
-- Name: gacvktb gacvktb_mabb_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gacvktb
    ADD CONSTRAINT gacvktb_mabb_fkey FOREIGN KEY (mabb) REFERENCES public.bbmuontravktb(mabb);


--
-- TOC entry 4985 (class 2606 OID 69191)
-- Name: gacvktb gacvktb_mapc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gacvktb
    ADD CONSTRAINT gacvktb_mapc_fkey FOREIGN KEY (mapc) REFERENCES public.pcgac(mapc);


--
-- TOC entry 4967 (class 2606 OID 69036)
-- Name: hocvien_chucvu hocvien_chucvu_machucvu_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_chucvu
    ADD CONSTRAINT hocvien_chucvu_machucvu_fkey FOREIGN KEY (machucvu) REFERENCES public.chucvu(machucvu);


--
-- TOC entry 4968 (class 2606 OID 69031)
-- Name: hocvien_chucvu hocvien_chucvu_mahocvien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_chucvu
    ADD CONSTRAINT hocvien_chucvu_mahocvien_fkey FOREIGN KEY (mahocvien) REFERENCES public.hocvien(mahocvien);


--
-- TOC entry 4957 (class 2606 OID 68931)
-- Name: hocvien hocvien_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien
    ADD CONSTRAINT hocvien_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi);


--
-- TOC entry 4969 (class 2606 OID 69046)
-- Name: hocvien_quanham hocvien_quanham_mahocvien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_quanham
    ADD CONSTRAINT hocvien_quanham_mahocvien_fkey FOREIGN KEY (mahocvien) REFERENCES public.hocvien(mahocvien);


--
-- TOC entry 4970 (class 2606 OID 69051)
-- Name: hocvien_quanham hocvien_quanham_maquanham_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hocvien_quanham
    ADD CONSTRAINT hocvien_quanham_maquanham_fkey FOREIGN KEY (maquanham) REFERENCES public.quanham(maquanham);


--
-- TOC entry 4977 (class 2606 OID 69128)
-- Name: kiemtragac kiemtragac_macagac_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiemtragac
    ADD CONSTRAINT kiemtragac_macagac_fkey FOREIGN KEY (macagac) REFERENCES public.cagac(macagac);


--
-- TOC entry 4978 (class 2606 OID 69138)
-- Name: kiemtragac kiemtragac_macanbo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiemtragac
    ADD CONSTRAINT kiemtragac_macanbo_fkey FOREIGN KEY (macanbo) REFERENCES public.canbo(macanbo);


--
-- TOC entry 4979 (class 2606 OID 69133)
-- Name: kiemtragac kiemtragac_mavp_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kiemtragac
    ADD CONSTRAINT kiemtragac_mavp_fkey FOREIGN KEY (mavp) REFERENCES public.vipham(mavipham);


--
-- TOC entry 4971 (class 2606 OID 69064)
-- Name: lichgac lichgac_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichgac
    ADD CONSTRAINT lichgac_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi);


--
-- TOC entry 4962 (class 2606 OID 68991)
-- Name: lichsumatkhau lichsumatkhau_mataikhoan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichsumatkhau
    ADD CONSTRAINT lichsumatkhau_mataikhoan_fkey FOREIGN KEY (mataikhoan) REFERENCES public.taikhoan(mataikhoan);


--
-- TOC entry 4980 (class 2606 OID 69156)
-- Name: lichsunghigac lichsunghigac_canboduyet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichsunghigac
    ADD CONSTRAINT lichsunghigac_canboduyet_fkey FOREIGN KEY (canboduyet) REFERENCES public.canbo(macanbo);


--
-- TOC entry 4981 (class 2606 OID 69151)
-- Name: lichsunghigac lichsunghigac_mahocvien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lichsunghigac
    ADD CONSTRAINT lichsunghigac_mahocvien_fkey FOREIGN KEY (mahocvien) REFERENCES public.hocvien(mahocvien);


--
-- TOC entry 4983 (class 2606 OID 69180)
-- Name: luotbienche luotbienche_mavktb_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.luotbienche
    ADD CONSTRAINT luotbienche_mavktb_fkey FOREIGN KEY (mavktb) REFERENCES public.vktb(mavktb);


--
-- TOC entry 4960 (class 2606 OID 68967)
-- Name: nhatkytruycap nhatkytruycap_mataikhoan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhatkytruycap
    ADD CONSTRAINT nhatkytruycap_mataikhoan_fkey FOREIGN KEY (mataikhoan) REFERENCES public.taikhoan(mataikhoan);


--
-- TOC entry 4972 (class 2606 OID 69089)
-- Name: nhiemvu nhiemvu_mavonggac_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nhiemvu
    ADD CONSTRAINT nhiemvu_mavonggac_fkey FOREIGN KEY (mavonggac) REFERENCES public.vonggac(mavonggac);


--
-- TOC entry 4973 (class 2606 OID 69105)
-- Name: pcgac pcgac_macagac_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcgac
    ADD CONSTRAINT pcgac_macagac_fkey FOREIGN KEY (macagac) REFERENCES public.cagac(macagac);


--
-- TOC entry 4974 (class 2606 OID 69100)
-- Name: pcgac pcgac_mahocvien_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcgac
    ADD CONSTRAINT pcgac_mahocvien_fkey FOREIGN KEY (mahocvien) REFERENCES public.hocvien(mahocvien);


--
-- TOC entry 4975 (class 2606 OID 69115)
-- Name: pcgac pcgac_malichgac_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcgac
    ADD CONSTRAINT pcgac_malichgac_fkey FOREIGN KEY (malichgac) REFERENCES public.lichgac(malichgac);


--
-- TOC entry 4976 (class 2606 OID 69110)
-- Name: pcgac pcgac_mavonggac_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pcgac
    ADD CONSTRAINT pcgac_mavonggac_fkey FOREIGN KEY (mavonggac) REFERENCES public.vonggac(mavonggac);


--
-- TOC entry 4961 (class 2606 OID 68979)
-- Name: phiendangnhap phiendangnhap_mataikhoan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phiendangnhap
    ADD CONSTRAINT phiendangnhap_mataikhoan_fkey FOREIGN KEY (mataikhoan) REFERENCES public.taikhoan(mataikhoan);


--
-- TOC entry 4958 (class 2606 OID 68953)
-- Name: taikhoan taikhoan_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi);


--
-- TOC entry 4959 (class 2606 OID 68948)
-- Name: taikhoan taikhoan_maquyen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_maquyen_fkey FOREIGN KEY (maquyen) REFERENCES public.vaitro(maquyen);


--
-- TOC entry 4954 (class 2606 OID 68881)
-- Name: vktb vktb_maloaivktb_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vktb
    ADD CONSTRAINT vktb_maloaivktb_fkey FOREIGN KEY (maloaivktb) REFERENCES public.loaivktb(maloaivktb);


-- Completed on 2026-01-07 17:04:44

--
-- PostgreSQL database dump complete
--

\unrestrict gWF4AqR8lXHFuzDX7Db3p0spkBzYAHIAvtoQuBlhnTBuA4jX51yvlqaESE3CQwY

