--
-- PostgreSQL database dump
--

\restrict HphJBEqjR3SVaN5FFtIicWYQtq6uQz6NaS7DG15MfUj5Qto4WhLCg8aP0wfoeH0

-- Dumped from database version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(100),
    avatar_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authors_id_seq OWNER TO postgres;

--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.badges_id_seq OWNER TO postgres;

--
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    date_published character varying(50) NOT NULL,
    read_time character varying(50) NOT NULL,
    cover_image character varying(255) NOT NULL,
    lead_paragraph text NOT NULL,
    body_content jsonb NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    author_id integer,
    slug character varying(255)
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blog_posts_id_seq OWNER TO postgres;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    subject character varying(100) NOT NULL,
    message text NOT NULL,
    status character varying(30) DEFAULT 'unread'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_messages_id_seq OWNER TO postgres;

--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: home_slider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.home_slider (
    id integer NOT NULL,
    product_id character varying(50),
    model_code character varying(50) NOT NULL,
    slide_title character varying(100) NOT NULL,
    slide_desc character varying(150) NOT NULL,
    image_url character varying(255) NOT NULL,
    sort_order integer DEFAULT 0,
    active boolean DEFAULT true
);


ALTER TABLE public.home_slider OWNER TO postgres;

--
-- Name: home_slider_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.home_slider_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.home_slider_id_seq OWNER TO postgres;

--
-- Name: home_slider_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.home_slider_id_seq OWNED BY public.home_slider.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    profession character varying(150) NOT NULL,
    employment_type character varying(50) NOT NULL,
    linkedin_url character varying(255),
    cv_file_path text NOT NULL,
    status character varying(50) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_applications_id_seq OWNER TO postgres;

--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: job_positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_positions (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    department character varying(100) NOT NULL,
    location character varying(100) NOT NULL,
    job_type character varying(50) NOT NULL,
    description text NOT NULL,
    requirements text[] NOT NULL,
    linkedin_url character varying(255) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.job_positions OWNER TO postgres;

--
-- Name: job_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_positions_id_seq OWNER TO postgres;

--
-- Name: job_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_positions_id_seq OWNED BY public.job_positions.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    role character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    tagline character varying(255) NOT NULL,
    description text NOT NULL,
    images text[] NOT NULL,
    specs jsonb NOT NULL,
    channels jsonb NOT NULL,
    badge character varying(50),
    sort_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    pinout_images text[] DEFAULT '{}'::text[],
    downloads jsonb DEFAULT '[]'::jsonb,
    is_campaign_active boolean DEFAULT false,
    campaign_discount_rate character varying(50),
    details jsonb,
    campaign_title character varying(150),
    campaign_description text,
    campaign_button_text character varying(50),
    campaign_button_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: redirects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.redirects (
    id integer NOT NULL,
    old_url character varying(255) NOT NULL,
    new_url character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.redirects OWNER TO postgres;

--
-- Name: redirects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.redirects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.redirects_id_seq OWNER TO postgres;

--
-- Name: redirects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.redirects_id_seq OWNED BY public.redirects.id;


--
-- Name: sales_channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channels (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    url character varying(255),
    image_url character varying(255) NOT NULL,
    sort_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sales_channels OWNER TO postgres;

--
-- Name: sales_channels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sales_channels_id_seq OWNER TO postgres;

--
-- Name: sales_channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_channels_id_seq OWNED BY public.sales_channels.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer DEFAULT 1 NOT NULL,
    site_title character varying(150) NOT NULL,
    site_description text NOT NULL,
    site_keywords text,
    logo_url character varying(255) DEFAULT '/img/logo.png'::character varying,
    favicon_url character varying(255) DEFAULT '/favicon.ico'::character varying,
    contact_email character varying(150) NOT NULL,
    contact_phone character varying(50) NOT NULL,
    contact_address text NOT NULL,
    map_latitude double precision NOT NULL,
    map_longitude double precision NOT NULL,
    social_linkedin character varying(255),
    social_youtube character varying(255),
    social_x character varying(255),
    social_github character varying(255),
    updated_at timestamp without time zone DEFAULT now(),
    offices_json jsonb DEFAULT '[]'::jsonb,
    social_instagram character varying(255),
    social_nsosyal character varying(255),
    social_links_json jsonb DEFAULT '[]'::jsonb,
    catalog_url character varying(255),
    favicon_dark_url text DEFAULT ''::text,
    CONSTRAINT check_single_row CHECK ((id = 1))
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'editor'::character varying,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: badges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: home_slider id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_slider ALTER COLUMN id SET DEFAULT nextval('public.home_slider_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: job_positions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions ALTER COLUMN id SET DEFAULT nextval('public.job_positions_id_seq'::regclass);


--
-- Name: redirects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirects ALTER COLUMN id SET DEFAULT nextval('public.redirects_id_seq'::regclass);


--
-- Name: sales_channels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channels ALTER COLUMN id SET DEFAULT nextval('public.sales_channels_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors (id, name, role, avatar_url, created_at) FROM stdin;
7	Orbit Teknoloji	Editör	/uploads/author_avatar_1786610527054850781_RBİT (2).png	2026-07-10 15:49:13.667299
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (id, name, created_at) FROM stdin;
1	YENİ	2026-08-12 13:34:13.327924+00
2	POPÜLER	2026-08-12 13:34:13.327924+00
3	test	2026-08-12 13:54:34.733692+00
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, title, category, date_published, read_time, cover_image, lead_paragraph, body_content, active, created_at, author_id, slug) FROM stdin;
26	FPV Dron Toplama Rehberi	Teknoloji	2026-07-21	30 dk okuma	/uploads/blog_cover_1784648489053842064_Drone-Toplama-Rehberi.jpg	Bu rehberde, ORBITF435 uçuş kontrol kartı ve ORBIT BLS 50A 4in1 ESC ile FPV drone’unuzu nasıl kuracağınızı adım adım anlatıyoruz. Daha önce hiç drone toplamamış olsanız bile, bu dokümanı takip ederek kendi dronunuzu uçuşa hazır hale getirebilirsiniz.\r\n	"<div><div><section><div><div><div><section><div><div><div><div><div><h3>FPV Dron Toplama Rehberi</h3></div></div></div></div></div></section><section><div><div><div><div><div><p>Bu rehberde, ORBITF435 uçuş kontrol kartı ve ORBIT BLS 50A 4in1 ESC ile FPV drone’unuzu nasıl kuracağınızı adım adım anlatıyoruz. Daha önce hiç drone toplamamış olsanız bile, bu dokümanı takip ederek kendi dronunuzu uçuşa hazır hale getirebilirsiniz.</p><p><br></p><p><strong>A. Parça Listesi</strong></p><p>Burada donanım kurulumu ile ilgili kısaca bilgiler verilecektir. Sonrasında kullanmak istediğiniz uçuş kontrol yazılımı ile ilgili başlığa geçerek yazılım konfigürasyon kısmını tamamlayabilirsin.</p><p>Öncelikle bir FPV drone toparlayabilmek için aşağıdaki parçalara ihtiyacınız olacaktır. Bu parçalar ile hızlı bir şekilde FPV dronunuzu oluşturabilirsiniz:</p><p>\\n</p></div></div></div></div></div></section></div></div></div></section></div></div><div><div><section><div><div><div><section><div><div><div><div><div><p><br></p><p>\\n</p></div></div></div></div></div></section></div></div></div></section></div></div><div><div><section><div><div><div><section><div><div><div><div><div><table style=\\"width: 426px; height: 210px;\\"><tbody><tr><td><p><strong>Frame (Çerçeve)</strong></p></td><td><p>Source One V5 Frame</p></td></tr><tr><td><p><strong>Uçuş Kartı</strong></p></td><td><p>ORBITF435</p></td></tr><tr><td><p><strong>ESC</strong></p></td><td><p>ORBIT BLS 50A 4in1</p></td></tr><tr><td><p><strong>Motorlar</strong></p></td><td><p>4x iFlight Xing2 2207 1855KV</p></td></tr><tr><td><p><strong>Pervaneler</strong></p></td><td><p>4x HQ 5×4.3×3 V2S</p></td></tr><tr><td><p><strong>Alıcı</strong></p></td><td><p>ORBIT 2.4Ghz Nano RX</p></td></tr><tr><td><p><strong>FPV Kamera</strong></p></td><td><p>Caddx Ratel 2</p></td></tr><tr><td><p><strong>VTX</strong></p></td><td><p>ORBIT VTX300</p></td></tr></tbody></table><p><img src=\\"/uploads/blog_editor_1784648549907786997_image.png\\" width=\\"790\\" style=\\"width: 100%; height: auto; display: block; margin: 16px auto;\\" height=\\"450\\"></p><p><strong>Temel Araçlar ve Malzemeler</strong></p><p>Yukarıda bahsettiğimiz bileşenlerin yanı sıra, alet ve malzemelere de ihtiyacınız olacak. Bunlardan bazılarına zaten sahip olabilirsiniz, ancak yoksa elektronik malzeme satan dükkanlardan, nalburlardan veya internetten kolayca bulabilirsiniz:</p><ul><li>Havya, lehim ve flux</li><li>Altıgen tornavida seti (olması gereken boyutlar 1,5 mm, 2,0 mm ve 2,5 mm’dir)</li><li>Hassas (küçük uçlu) tornavida seti</li><li>Vida sabitleme sıvısı (önerilir – motor vidalarını sabitlemek için)</li><li>Kabloları soymak ve kesmek için kablo sıyırıcı veya keski</li><li>3M çift taraflı köpük bant (isteğe bağlı – bileşenleri çerçeveye sabitlemek için)</li><li>Dijital multimetre&nbsp;veya/veya VIFLY ShortSaver V2 (ilk kez pili takmadan önce güvenlik kontrolleri için)</li><li>2 mm plastik kelepçe 15 cm veya daha uzun (kabloları ve bileşenleri çerçeveye sabitlemek için)</li><li>Kumaş bant veya elektrik bandı (15 mm genişlik idealdir, motor kablolarını sarmak için mükemmeldir, ancak elektrik bandıda kullanabilirsiniz)</li><li>28AWG silikon elektrik teli (FC’ye bileşenleri lehimlemek için)</li><li>Pil pedi (isteğe bağlı)</li><li>Pervane somunu çevirmek için anahtar (isteğe bağlı)</li></ul><p><strong>Frame (Çerçeve)</strong></p><p><img src=\\"/uploads/blog_editor_1784648679812889991_image.png\\" width=\\"905\\" style=\\"width: 100%; height: auto; display: block; margin: 16px auto;\\" height=\\"418\\"></p><p>Bir frame (çerçeve), tüm bileşenleri bir arada tutan sağlam bir yapıdır.</p><p>Bu eğitim için uygun fiyatı ve açık kaynaklı yapısı nedeniyle mükemmel bir tercih olan<span>&nbsp;</span><strong>TBS Source One V5</strong><span>&nbsp;</span>kasasını tercih edebiliriz. Tasarım, ilgili topluluğun sürekli güncellemeleri sayesinde zamanla gelişti; böylece güncel donanımlarla uyumluluk sağlandı, performans ve kullanılabilirlik optimize edildi.&nbsp;</p><p>Source One’ın bir diğer büyük avantajı ise<span>&nbsp;</span><strong>Thingiverse</strong><span>&nbsp;</span>üzerinde bulunan çok sayıda ücretsiz 3D baskı tasarımıdır. Bu tasarımlar sayesinde FPV drone yapınızı daha da geliştirebilir ve özelleştirebilirsiniz.</p><p><strong>Uçuş Kontrol Kartı ve ESC&nbsp;</strong></p><p></p><p>\\n          </p><div class=\\"editor-grid-container\\" style=\\"display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;\\">\\n            <div class=\\"editor-grid-col\\" style=\\"flex: 1 1 calc(50% - 16px); min-width: 250px;\\"><p><img src=\\"/uploads/blog_editor_1784648701176717328_image.png\\" width=\\"280\\" height=\\"147\\"></p></div>\\n            <div class=\\"editor-grid-col\\" style=\\"flex: 1 1 calc(50% - 16px); min-width: 250px;\\"><p><br></p></div>\\n          </div><p><br></p>\\n        <p></p>\\n        </div></div></div></div></div></section></div></div></div></section></div></div><div><div><section><div><div><div><section><div><div><div><div><div><p></p><p>Uçuş kontrolörü ve ESC satın alırken hem uçuş kontrolörü kartını hem de 4’ü 1 arada ESC kartını içeren bir “Stack” halinde almaya çalışın. Birlikte satın almak, kutudan çıkar çıkmaz tak ve çalıştır özelliğiyle kablolama ve lehimlemeyi kolaylaştırır. Ayrıca, bunları ayrı ayrı satın almaktansa birlikte satın almak genellikle daha ucuzdur.</p><p>Bu eğitim için<span>&nbsp;</span><strong>ORBITF435</strong><span>&nbsp;</span>ürününü tercih edebilirsiniz. Yerli tasarım olan bu uçuş kontrol kartı,<span>&nbsp;</span><strong>Betaflight</strong><span>&nbsp;</span>ve<span>&nbsp;</span><strong>iNav<span>&nbsp;</span></strong>yazılımlarıyla uyumludur. Gücünü hızlı<span>&nbsp;</span><strong>AT32F435 işlemcisinden</strong><span>&nbsp;</span>alır ve<span>&nbsp;</span><strong>ICM42688 IMU sensörü</strong><span>&nbsp;</span>ile daha hassas, daha stabil bir uçuş performansı sunar. Ayrıca Betaflight bağlantı standartlarına tam uyumludur ve<span>&nbsp;</span><strong>DJI Air Unit&nbsp;</strong>gibi HD video vericiler&nbsp;için tak-çalıştır soket içerir.</p><p><strong>Motorlar</strong></p><p>Bu eğitim için 2207 boytlu bir motor tercih edebilirsiniz. Benzer boyutlardaki popüler motorlar genellikle benzer performansa sahip olsa da, temel fark genellikle üretim kalitelerinde yatar. 5 inçlik bir FPV drone için 2306, 2207 ve 2208 gibi motor boyutlarının hepsi uygun seçeneklerdir.</p><p><img src=\\"/uploads/blog_editor_1784648739719652609_image.png\\" width=\\"334\\" height=\\"326\\"></p><p>Dikkate alınması gereken bir diğer önemli faktör, akü voltajına göre belirlenen motor KV’sidir. Motor KV seçerken, 1600–2100KV değerleri 6S piller, 2300–2800KV değerleri ise 4S piller için uygundur. Daha yüksek KV seçenekleri genellikle daha agresif ve güç tüketimi yüksek olurken, daha düşük KV seçenekleri daha verimli ve dengeli çalışır. Bu yapıda, 6S LiPo akü kullanmayı planladığımız için 1855 KV motorlar kullanıyoruz.</p><p><strong><br></strong></p><p><strong>FPV (VTX)</strong></p><p><strong><img src=\\"/uploads/blog_editor_1784648754008200994_image.png\\" width=\\"483\\" height=\\"362\\"></strong></p><p>Bu rehberde analog FPV sisteminin kurulumunu ve ayarlarını ele alacağız. Analog yapı için, Source One kasasına kolayca monte edilebilen uygun fiyatlı ve yüksek performanslı bir VTX olan ORBIT VTX300’ü kullanacağız.</p><p><strong><br></strong></p><p><strong>Radyo Alıcısı (ELRS)</strong></p><p><strong><img src=\\"/uploads/blog_editor_1784648777590627430_image.png\\" width=\\"470\\" height=\\"353\\"></strong></p><p>Radyo vericisi seçiminiz, kullanabileceğiniz alıcı (RX) türünü belirler. Şuanda radyo bağlantısı için en çok tercih edilen ExpressLRS’dir. ExpressLRS uygun fiyatlı, yüksek performanslı ve inanılmaz derecede güvenilirdir.</p><p>Birçok üretici ExpressLRS için alıcı ve verici modülleri üretiyor. Bunlardan herhangi birini seçebilirsiniz ve ExpressLRS oldukları sürece birlikte çalışırlar. Bu eğitim için, tamamen yerli olan ORBIT 2.4Ghz Nano RX kullanabilirsiniz. Mükemmel performans sunuyor ve tamamen yerli olduğu için stok erişimi de kolaydır.&nbsp;</p><p><strong>B. Diğer Ekipmanlar</strong></p><p>Bir quadcopter’ı FPV modunda uçurmak için aşağıdaki aksesuarlara ihtiyacınız olacak.</p><ul><li><strong>Radyo Vericisi (Kumanda):</strong><span>&nbsp;</span>Drone’unuzu kontrol etmek için bir radyo vericisi yani bir kumanda olmazsa olmazdır. Kumanda olarak popüler olarak kullanılan Radiomaster Boxer veya Radiomaster Pocket öneririz. Bu kumandalar ExpressLRS destekelemektedirler.</li><li><strong>FPV Gözlükleri:&nbsp;</strong>Şu anda en iyi analog gözlük Skyzone SKY04X olmalı. Daha kısıtlı bir bütçeniz varsa, Skyzone Cobra SD, uygun fiyatlı bir “kutu gözlük” seçeneğini değerlendirebilirsiniz.</li><li><strong>LiPo Piller:</strong><span>&nbsp;</span>Bu sistem için 6S 1000mAh-1300mAh LiPo piller ideal olacaktır. Uygunsuz kullanım tehlikeli olabileceğinden LiPo piller hakkında bilgi edindiğinizden emin olun.</li><li><strong>Pil Şarj Cihazı:</strong><span>&nbsp;</span>Son olarak, bir pil şarj cihazına ihtiyacınız olacak. LiPo pillerde önemli olan hücrelerin dengeli bir şekilde şarj edilmesidir. Bu nedenle mutlaka bir pil şarj cihazına ihtiyacınız olacaktır.</li></ul><p><strong><strong>1- Frame Montajı<br></strong></strong></p><p>Karbon fiber parçalardaki, özellikle kolların ve plakaların dış tarafındaki keskin kenarları zımparalayın. Keskin kenarlar, bir kazada kablolarınızı ve batarya kayışınızı kesebilir. Zımparalanmış kenarlar, kazalarda karbon fiber levhanın hasar görme olasılığını düşürmede yardımcı olacaktır.</p><p>Kesme, delme ve zımparalama işlemlerinden kalan karbon tozunu temizlemek için tüm karbon fiber parçaları sabunlu suyla yıkayın (karbon fiberin iletken olduğunu unutmayın). Ardından parçaları bir kâğıt havluyla iyice kurulayın.</p><p>Çerçeveyi monte etmek için öncelikle kolları ve kol kilidini ön alt plakanın üstüne yerleştirerek başlayın.</p><p><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-7.png\\"></p><p>Ardından, somunları (push nut) arka alt plakayı kolların üzerine yerleştirin ve alttan vidalarla sabitleyin. Son olarak sekiz alüminyum standoff’u takın, ancak boylarının farklı olduğuna dikkat edin, ön taraftaki dört standoff daha uzundur.</p><p><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-8.png\\"></p><p><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-9.png\\"><br><br></p><p><strong><strong>2- Motor Montajı<br></strong></strong></p><p>Şimdi, dört motoru kollara monte etme zamanı. Motor vidalarında sabitleyici sıvı kullanılması önerilir, çünkü motorlardan gelen titreşimler vidaların zamanla gevşemesine neden olabilir. Neyse ki, Xing2 motorlarıyla birlikte gelen vidalarda zaten sabitleyici sıvı uygulanmış olduğundan, ek bir uygulamaya gerek yoktur.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-10.png\\"></p><p>Kollar 6 mm kalınlığında olduğundan, 8 mm’lik vidalar mükemmel uzunluktadır. Rondela kullanmaya gerek yoktur.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-11.png\\"></p><p>Eğer sıradan vidalar kullanıyorsanız, mutlaka vida sabitleyici (Loctite) kullanın. Mavi sıvı tipini tercih edin, çünkü kırmızı sıvı tipi kalıcı kullanım için tasarlanmıştır ve vidaları daha sonra sökmeyi oldukça zorlaştırabilir.</p><p>Son olarak, motor vidalarının çok uzun olmadığından ve motor sargısına temas etmediğinden emin olun.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-12.png\\"><br><br></p><p><strong><strong>3- Kabloların Bağlantı Şeması<br></strong></strong></p><p>Devam etmeden önce, tüm bileşenlerin nasıl bağlanacağını ana hatlarıyla açıklayan bir kâğıda bir bağlantı şeması çizmek iyi bir fikirdir. Önerdiğim bileşenleri kullanıyorsanız, takip edebileceğiniz bağlantı şemaları şunlardır.</p><p>Analog FPV için:<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-13.png\\"></p><p>Herhangi bir kabloyu lehimlemeden önce, tüm bileşenleri gövdeye “deneme amaçlı” yerleştirebilirsiniz. Bu işlem, kablo uzunluklarını ölçmenizi, bileşenlerin konumunu belirlemenizi ve olası boşluk/yerleşim sorunlarını fark etmenizi sağlar.</p><p><strong><strong>4- ESC Montajı<br></strong></strong></p><p>Öncelikle, gövdedeki dört kısa vidayı ORBITF435 stack ile birlikte gelen uzun M3x25 mm vidalarla değiştirin. FC, ESC ve VTX montajında naylon standoff kullanmaktan kaçının; darbelerde kolayca kırılırlar. Bunun yerine metal vidalar kullanın.</p><p>Stack montajında metal vidalar (alt kısımda metal somun ile birlikte) kullanın. Bu, titreşim ve sallantıyı azaltır, dronun daha iyi uçmasını ve daha kolay ayarlanmasını sağlar.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-14.png\\"></p><p>Dört uzun vidaya 4’ü 1 arada ESC ve FC kartlarını yerleştirin. ESC kartının güç pad’lerinin arkaya, motor lehim pad’lerinin ise yukarıya bakmasına dikkat edin. Gövdenin ön tarafı, kamera montaj plakaları için açılmış boşluklardan anlaşılabilir.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-15.png\\"></p><p>ESC’nin alt kısmını kontrol ederek şasiye temas etmediğinden emin olun. Ayrıca, ESC ile FC arasında herhangi bir temas olup olmadığını kontrol edin. (Görsel Lehimlendikten sonra çekilmiştir. Lehim işleminden sonra da bakılması gerekir. Ancak lehimlemeden önce de bakmanız da fayda var.)<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-16.png\\"></p><p>Gerekli motor kablo uzunluklarını belirleyin, biraz boşluk bırakın ve uygun şekilde kesin. Motor kablolarını kollara bez bant veya elektrik bandıyla sabitleyin.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-17.png\\"><br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-18.png\\"></p><p>Daha sonra tellerin uç kısımlarını yaklaşık 2mm kadar sıyırıp uçlarını kalaylayın (lehimleyin). 4’ü 1 arada ESC’deki tüm lehim pedlerini kalaylayın. Lehimin yanlışlıkla bileşenlerin üzerine düşüp elektriksel kısa devreye neden olmasını önlemek için, lehimleme yapmadığınız alanları elektrik bandı, kâğıt bant veya maskeleme bandı gibi bantlarla kapatın.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-19.png\\"></p><p>Motor kablolarını ESC’ye lehimleyin. Kabloların sırası veya motor yönü konusunda şimdilik endişelenmeyin; bunu daha sonra yazılım üzerinden değiştirebilirsiniz. Eğer beceriniz varsa, motor kablolarını yan taraftan lehimlemeyi deneyebilirsiniz, böylece drone’u kavramak daha kolay ve düzenli olabilir.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-22.png\\"></p><p>XT60 güç kablosunu, doğru polariteye (artı ve eksi) dikkat ederek ESC üzerindeki güç pad’lerine lehimleyin. Bu adım biraz zorlayıcı olabilir çünkü büyük bakır pad’lerdeki lehimi eritmek için fazla ısı gerekir. Sabırlı olun ve havya sıcaklığını biraz yüksek tutun.<img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-23.png\\"><br>Ardından ORBITF435 Stack ile birlikte gelen 1000uF kondansatörü lehimleyin. Pense yardımıyla bacakları büküp kısaltın, ardından lehimleyin.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-24.png\\"></p><p>Kondansatörün altına küçük bir parça çift taraflı bant yapıştırın. Kondansatörü, polariteye dikkat ederek (+ ve – uçlarına dikkat ederek), daha önce ESC güç pedlerine bağlı olan kablolara lehimleyin. Sarı işaretli taraf, kondansatörün negatif tarafıdır.</p><p>Bir kapasitör, ESC ve motorların ürettiği voltaj dalgalanmalarını ve elektriksel gürültüyü azaltmak için kullanılır. Ayrıca, yamulmuş pervaneler daha fazla gürültü oluşturduğu için bu konuda da fayda sağlar.</p><p><strong>Lehimleme İpuçları:<br></strong></p><ul><li>Büyük pad’lerde bol miktarda lehim ve flux (lehim pastası) kullanın. Lehim bağlantılarının parlak ve dolu olmasına dikkat edin. Tel damarlarını görebiliyorsanız, yeterince lehim uygulamamışsınız demektir.</li><li>Havya ucunu ek yerinden çekerken, lehim, havya ucunuza yapışıyorsa daha fazla flux sürün. Flux aynı zamanda oksitlenmeyi de engeller.</li><li>Büyük pad’lerde yüksek sıcaklık kullanmaktan çekinmeyin, ancak hızlı olun ve pad’i uzun süre ısıtmayın. Motor kabloları ve XT60 için 450°C (840°F), sinyal kabloları için 380°C kullanın.</li></ul><p><strong>&nbsp;</strong><strong>ESC ve Motorların Kısa Devre Testi;</strong></p><p>İlk kez bir LiPo pil bağlamadan önce, elektriksel kısa devre olmadığından emin olun. Multimetreyi kısa devre testi moduna alarak XT60’ın (+) ve (–) uçlarını (ya da doğrudan lehim pad’lerini) test edin. Eğer kısa devre varsa, multimetre sürekli öter. Bu durumda pili &nbsp;bağlamayın, çünkü bileşenlerinize zarar verebilir. Bunun yerine kısa devreye neden olan sorunu bulup düzeltin.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-25.png\\"></p><p><em>İpucu: Kısa devre testi sırasında, kapasitörlerin şarj olmasından dolayı kısa bir “bip” sesi duyulup ardından sessizlik olması normaldir. Bip sesi bir-iki saniye içinde kesiliyorsa sorun yoktur.</em></p><p><strong><strong>5- FC Montajı</strong></strong></p><p>Verilen 8 pinli şerit kabloyu kullanarak FC’yi ESC’ye bağlayın. Uçuş kontrol cihazını 4’ü 1 arada ESC’nin üzerine takarken, FC üzerindeki okun ileriyi gösterdiğinden emin olun. FC üzerinde yer alan pedlerden hangilerini kullanmanız gerekiyorsa onları az bir miktar lehimleyin.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-26.png\\"></p><p><strong>5.1. Motorların BetaFlight ile test edilmesi<br></strong></p><p>Pervaneleri henüz takmayın. Motorları test etmek için bataryayı bağlayın ve USB kablosunu uçuş kontrolörüne takın. Betaflight Configurator içindeki Motors sekmesine girin, motorları tek tek çalıştırın (slider’ı yaklaşık %10’a getirin) ve doğru yönde dönüp dönmediklerini kontrol edin. (Burada ekranın sağ altında, güvenlik için kapalı halde olan seçeneği açmanız gerekmekte)<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-27.png\\"><br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-28.png\\"></p><p>Yanlış yönde dönen bir motoru ters çevirmek için Betaflight Configurator’daki (Motors sekmesi) yönergelerini kullanın. Ayrıca, dönen motor numarasının şemayla eşleştiğinden emin olun; örneğin, motor #1 arka sağ, motor #2 ön sağ vb.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-29.png\\"></p><p>Motor sırası yanlışsa, motorlar sekmesindeki “Motorları Yeniden Sırala” aracını kullanarak ve talimatları izleyerek düzeltmeniz gerekir.</p><p><strong><em>Sorun giderme ipuçları:</em></strong></p><p>–&nbsp;&nbsp;&nbsp;&nbsp; Motorlar dönmüyorsa, pilin bağlı olduğundan emin olun. Pili taktığınız anda ESC bip sesi çıkarmalıdır. ESC’nin FC’ye bağlı olduğundan ve pin bağlantılarının doğru olduğundan emin olun.<br>–&nbsp;&nbsp;&nbsp;&nbsp; Bir motor hariç tüm motorlar dönüyorsa, o ESC, motor veya FC’den gelen ESC sinyali arızalı olabilir. Sorunu gidermek için çalıştığından emin olduğunuz başka bir motorla değiştirerek sorunun ESC’de mi yoksa motorda mı olduğunu belirleyin</p><p><strong>5.2. Motor Yönü Değiştirme</strong></p><p>Bir FPV drone’da motor dönüş yönünü değiştirmenin 3 yolu vardır:</p><p>–&nbsp;&nbsp;&nbsp;&nbsp; Motor kablolarını değiştirip yeniden lehimleme ile<br>–&nbsp;&nbsp;&nbsp;&nbsp; BLHeliSuite uygulaması üzerinden veya ESC Configurator ile<br>–&nbsp;&nbsp;&nbsp;&nbsp; Betaflight Configurator üzerinden değiştirebilirsiniz.</p><p><strong>Yöntem 1: Betaflight Configurator ile Motor Yönü Değiştirme</strong></p><p>Betaflight 4.3’ten bu yana, Betaflight Configurator’da (motorlar sekmesinde) bir motorun dönüşünü tersine çevirebilirsiniz; bunun için artık BLHeliSuite kullanmanıza gerek yok!<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-30.png\\"></p><p><strong>Yöntem 2: Motor Kablolarını Değiştirme</strong></p><p>Motor ve ESC arasındaki 3 kablodan herhangi 2’sini değiştirerek motorun dönüş yönünü tersine çevirebilirsiniz. Hangi iki kabloyu kullandığınızın bir önemi yok, sonuç aynı olacaktır.</p><p><strong>Yöntem 3: ESC Configurator</strong></p><p>Lehim yapmayı sevmiyorsanız, motor yönünü ESC konfigüratörü ile de kolayca değiştirebilirsiniz: BLHeli32 ESC için<span>&nbsp;</span><strong>BLHeliSuite32</strong><span>&nbsp;</span>veya BLHeli_S ESC için<span>&nbsp;</span><strong>ESC-Configurator</strong>. BLHeli_32 ESC kullanıyorsanız programın adı<span>&nbsp;</span><strong>BLHeliSuite_32</strong>’dir.</p><ol><li><ol><li>Konfigüratörü açın ve USB kablosu ile dronunuzu bilgisayara bağlayın.</li><li>Quad’ınızı beslemek için bataryayı takın ve ardından<span>&nbsp;</span><strong>“Connect”</strong><span>&nbsp;</span>düğmesine tıklayın.</li><li><strong>“Read Setup”</strong><span>&nbsp;</span>düğmesine tıklayın – hata alırsanız bu, ESC’nizin BLHeli_32 veya BLHeli_S olmaması anlamına gelebilir; diğer konfigüratörü deneyin.</li><li>Her şey yolundaysa, bulunan ESC’lerin bir özetini göreceksiniz.</li><li>Sağ alt köşeden değiştirmek istediğiniz ESC’yi seçin</li><li>Motor Yönü (Motor Direction)<span>&nbsp;</span><strong>“Normal”</strong><span>&nbsp;</span>ise,<span>&nbsp;</span><strong>“Reverse”</strong><span>&nbsp;</span>olarak değiştirerek motor yönünü ters çevirebilirsiniz. Zaten<span>&nbsp;</span><strong>“Reverse”</strong><span>&nbsp;</span>ise, tekrar<span>&nbsp;</span><strong>“Normal”</strong><span>&nbsp;</span>yapmanız yeterlidir. Ayrıca motoru her iki yönde döndürebilecek<span>&nbsp;</span><strong>“3D”</strong>modunu da seçebilirsiniz; bu, 3D acro uçuş için gereklidir. Ancak ne yaptığınızı bilmiyorsanız<span>&nbsp;</span><strong>“3D”</strong><span>&nbsp;</span>modunu kullanmayın.</li></ol></li></ol><p><strong><strong>6- ELRS Montajı<br></strong></strong></p><p>RX antenini en yakın kolun altına kumaş bant ya da plastik kelepçe ile sabitleyin ve anten telinin sıkışmasını önlemek için bantla sarın. Eğer RX üzerinde kablo yoksa RX’i FC’ye lehimlemek için 28AWG veya 30AWG kabloya ihtiyacınız olacaktır. RX’i, çift taraflı köpük bant veya plastik kelepçe kullanarak FC’nin önüne monte edin. Çerçevede yeterli alan olan herhangi bir yere monte edebilirsiniz. Biz makarona sarıp gövdenin alt kısmına bağlamayı tercih ettik.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-31.png\\"></p><p>FC’nin üst kısmında herhangi bir kablo olmaması en iyisidir, jiroskopun üstünden veya yanından kablo geçirmekten kaçının, bu uçuş sırasında titreşime neden olabilir.</p><p>Alıcıyı (receiver) radyoya (TX modülü) ExpressLRS kurulum rehberine göre bağlayın (bind edin). Betaflight Configurator’da şu ayarları yapın:</p><p>–&nbsp;&nbsp;&nbsp;&nbsp; Ports sekmesine gidin ve alıcıya bağlı UART için “Serial RX” seçeneğini etkinleştirin (ORBITF435 için UART5).<br>–&nbsp;&nbsp;&nbsp;&nbsp; Receiver sekmesinde, Receiver Mode olarak “Serial (via UART)” seçin ve Serial Receiver Provider kısmında “CRSF”’yi seçin.<br>–&nbsp;&nbsp;&nbsp;&nbsp; Bu işlemin ardından, alıcının düzgün çalıştığını Receiver sekmesinde kontrol edin. Çubuklar (kanallar), radyodaki stick’leri hareket ettirdiğinizde hareket etmelidir. Yanlış kanallar tepki veriyorsa, Channel Map’i “default (AETR)” veya “TAER” gibi farklı bir seçenekle değiştirin.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-32.png\\"></p><p>Radyoda en az iki anahtar (switch) ayarlayın: biri arm – disarm için (motorları başlatma ve durdurma), diğeri beeper (buzzer) için. İsterseniz üçüncü bir anahtar da uçuş modu için ayarlayabilirsiniz (ör. angle modu).</p><p>Bu anahtarların çalıştığını Receiver sekmesinde kontrol edin; AUX1 ve AUX2, anahtarları çevirdiğinizde tepki vermelidir.</p><p><strong><strong><strong>7- FPV (VTX) Montajı</strong></strong></strong></p><p>VTX’i monte ederken, standoff kullanmak yerine çift taraflı bant ve zip tie (kablo bağı) kullanmayı düşünebilirsiniz. Görünümünü önemsemiyorsanız, bu yöntem hem kolay, güvenli hem de ağırlık açısından avantajlıdır.</p><p>VTX’in altına çift taraflı sünger bant uygulayın; bant, monte edildiğinde çerçeve ile temas etmeyi önlemek için bakır alanları kaplamalıdır. Kullandığımız VTX modelinde ekstra soğutma paneli de kullandık. Soğutma kısmında herhangi bir komponent olmaması ve sadece pinlerin olmasından ötürü o kısmı makaronla kapatmaya gerek duymadık. Sizin kullandığınız VTX modeline göre, teması engellemek için, makaron veya kılıf kullanabilirsiniz.</p><p><strong><strong><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-33.png\\"><br></strong></strong></p><p>Çerçevenin alt kısmından bakıldığında ise bu şekilde görünüyor.<strong><strong><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-34.png\\"></strong></strong></p><p>–&nbsp;&nbsp;&nbsp; VTX kablosunu FC’ye lehimleyin ve sallanmadığından emin olun.<br>–&nbsp;&nbsp;&nbsp; VTX antenini ara parçaya bağlayın.<br>–&nbsp;&nbsp;&nbsp; Betaflight’ta VTX’i kurmak için Portlar sekmesine gidin ve IRC pad’inizi bağladığınız UART için Peripherals altında IRC Tramp’ı seçin.<br>–&nbsp;&nbsp;&nbsp; Aşağıdaki VTX Tablosu kod parçasını ORBIT VTX300’ün CLI’sine kopyalayın. Bu, OSD menüsünde VTX ayarlarını değiştirmenizi sağlayacaktır.</p><p># vtxtable<br>vtxtable bands 6<br>vtxtable channels 8<br>vtxtable band 1 BOSCAM_A A FACTORY 5865 5845 5825 5805 5785 5765 5745 5725<br>vtxtable band 2 BOSCAM_B B FACTORY 5733 5752 5771 5790 5809 5828 5847 5866<br>vtxtable band 3 BOSCAM_E E FACTORY 5705 5685 5665 0 5885 5905 0 0<br>vtxtable band 4 FATSHARK F FACTORY 5740 5760 5780 5800 5820 5840 5860 5880<br>vtxtable band 5 RACEBAND R FACTORY 5658 5695 5732 5769 5806 5843 5880 5917<br>vtxtable band 6 LOWRACE L FACTORY 5333 5373 5413 5453 5493 5533 5573 5613<br>vtxtable powerlevels 5<br>vtxtable powervalues 1 2 14 20 26<br>vtxtable powerlabels 0 RCE 25 100 400<br>save</p><p><strong>&nbsp;</strong></p><p><strong><strong>8- Kamera Montajı<br></strong></strong></p><p>Kamerayı çerçevenin içine yerleştirin ve kamera kablolarını istediğiniz uzunlukta kesin. Kabloları bükerek sıkı tutun.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-35.png\\"></p><p>Kamera kablolarını FC’ye lehimleyin: Kırmızı 5V’a, siyah GND’ye ve sarı CAM’e gider. Her ihtimale karşı kullandığınız modelin Datasheetine bakmanız iyi olur. V değerleri farklı olabilir. (örn; 10V)<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-36.png\\"><br><br></p><p><strong><strong><strong>9- Son Kontroller</strong></strong></strong></p><p>FC’yi naylon somunlarla (fotoğrafta beyaz olanlarla) sabitleyin; fazla sıkmamak için elle vidalayın. Somunlar yalnızca kauçuk conta ile temas etmelidir. Sıkıştırılmış contalar titreşim sönümlemeyi azaltır ve yumuşak montajın amacını bozar.<strong><strong><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-37.png\\"></strong></strong></p><p>Üst plakayı takın ve batarya kayışını içinden geçirin. Source One V5, iyi bir kauçuk batarya pedi ile birlikte gelir. Ped yetersiz gelirse veya daha iyisi ile değiştirebilirsiniz.<img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-38.png\\"><br><br></p><p><strong><strong>10- Dronun Son Hali<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-39.png\\"><br></strong></strong></p><p>Tamamlanmış dronun ağırlıkları şu şekildedir:</p><p>–&nbsp;&nbsp;&nbsp;&nbsp; Dron: 357 g<br>–&nbsp;&nbsp;&nbsp;&nbsp; Dron + 6S 1100 mAh LiPo: 632 g</p><p><strong>Bu, 5 inç bir drone için oldukça hafif bir ağırlık olup mükemmel uçuş performansı sağlar.</strong><span>&nbsp;</span>Genel bir kural olarak, pil ve frame dahil toplam ağırlığın 750 g’ı geçmemesine dikkat edin; aksi takdirde drone tank gibi uçar ve freestyle uçuş için hoş bir his vermez.<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-40.png\\"></p><p>Pervaneleri takarken, farklı dönüş yönlerine dikkat edin: CW (saat yönünde) ve CCW (saat yönünün tersinde). Pervanelerin doğru motorlara takıldığından emin olun; aksi takdirde dronunuz kalkmayabilir veya kalkmaya çalışırken devrilebilir.</p><p>Pervaneleri motor üzerinde güvenli şekilde tutmak için M5 fiber somunlar kullanın. Başta sıkmak zor olabilir, ancak zamanla kolaylaşacaktır. Pervane göbeğinin çatlamasını önlemek için fazla sıkmayın. Sadece, motor belini tutarken pervaneyi elinizle çevirmeye çalıştığınızda hareket etmeyecek kadar sıkın.</p><p>Pili (ve GoPro’yu) monte ederken, ağırlık merkezinin drone’un merkezine mümkün olduğunca yakın olduğundan emin olun. Pilin doğru yerleştirilip yerleştirilmediğini kontrol etmek için, üst plakanın ortasını iki parmağınızla kavrayın ve drone’un düz durup durmadığına bakın. Ağırlık merkezini dört motorun ortasında tutmak çok önemlidir. Quad ön tarafta daha ağırsa, ön motorlar düz pozisyonunu korumak için ön motorları daha fazla çalıştıracak ve bu da uçuş performansını olumsuz etkileyecektir.</p><p>Ve test uçuşuna hazırız!<br><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-41.png\\"></p><p><strong>11- 3D Parçalar</strong></p><p>Daha temiz, daha şık ve daha dayanıklı bir yapı için 3D yazıcıyla üretilmiş parçaları kullanmayı düşünün. Thingiverse.com’da “Source One V5” araması yaparak çeşitli tasarımlar bulabilirsiniz. Diğer çerçevelerin parçaları da Source One’da işe yarayabilir.<img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2025/12/FPV-Drone-Toplama-42.png\\"></p><p>Tavsiye edebileceğimiz 3D tasarımlarından birkaçı:</p><ul><li>V4 için tasarlanmış, ancak bazı parçalar V5’e uyumludur:&nbsp;<a href=\\"https://www.thingiverse.com/thing:4844808\\">https://www.thingiverse.com/thing:4844808</a></li><li>Kol koruyucusu ve tampon:<span>&nbsp;</span><a href=\\"https://www.thingiverse.com/thing:4706164\\">https://www.thingiverse.com/thing:4706164</a></li></ul><p>GoPro 5-7 Montajı:<span>&nbsp;</span><a href=\\"https://www.thingiverse.com/thing:5416938\\">https://www.thingiverse.com/thing:5416938</a></p><p>Önerdiğim en hızlı ve görsel olarak hemen fark edilen modifikasyonlardan biri, 3D baskı kol koruyucularının eklenmesidir. Bu koruyucular sadece dekoratif değil; karbon fiber kolların bütünlüğünü korumada kritik bir rol oynar. Onlar olmadan, kollar çarpma anında uçlarından kolayca çatlayabilir. 3D baskı kol koruyucularının güzelliği, darbeleri emip dağıtarak hasar riskini önemli ölçüde azaltabilmeleridir.</p><p>Ayrıca motorları da çarpmalar sırasında korurlar. Bu koruyucular, motor milinin bükülmesini önleyebilir ve motor bellerini çizilmelere ve ezilmelere karşı koruyarak performansın korur.</p><p>Kol koruyucuları kullanmak için daha uzun motor vidalarına ihtiyacınız olabilir, örneğin M3x10 mm.</p><p>Analog kurulumda, 3D baskı anten montajı kullanmak, harici MMCX–SMA uzatma kablosunu kullanmanıza ve VTX antenini daha iyi sinyal kalitesi için dairesel polarize bir antenle değiştirmenize olanak tanır.</p><p>3D yazdırılmış parçalar aynı zamanda kamera ve kondansatörün montajında ​​da kullanılabilir.</p><p>Alternatif kaynak:<span>&nbsp;</span><a href=\\"https://oscarliang.com/how-to-build-fpv-drone-analog/\\">https://oscarliang.com/how-to-build-fpv-drone-analog/</a></p></div></div></div></div></div></section></div></div></div></section></div></div><div><br></div>"	t	2026-07-21 15:41:29.230772	7	fpv-dron-toplama-rehberi
21	ELRS Alıcı Kurulum ve Bağlama Rehberi - Orbit Teknoloji	Teknoloji	2026-07-10	12 dk okuma	/uploads/blog_cover_1783687993935513000_lavender-wallpaper-3840x2160-blooming-field-fluffy-white-clouds-527.jpg	test article	"<h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><span style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); letter-spacing: -0.025em; font-family: inherit;\\">2.4GHz Nano ELRS Alıcı (PA/LNA) — Kurulum ve Bağlama Rehberi</span></h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 32px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 20px; color: rgba(255, 255, 255, 0.9); line-height: 1.6; font-weight: 400; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">ExpressLRS (ELRS), FPV ve RC dünyasında hız, menzil ve güvenilirliğiyle öne çıkan açık kaynaklı bir uzaktan kumanda protokolüdür. Orbit Teknoloji’nin 2.4GHz Nano ELRS alıcısı, PA/LNA devresi sayesinde hem alım duyarlılığını hem de iletim gücünü artırarak uzun menzilli uçuşlara uygun, kompakt bir çözüm sunar. Bu yazıda alıcıyı ilk kez kurmak isteyenler için bağlama yöntemlerini ve Web UI yapılandırmasını adım adım açıklıyoruz.</p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Başlamadan Önce: Uyumluluk Kontrolü</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Alıcı ve vericinin birbirine bağlanabilmesi için her iki cihazın da aynı büyük versiyon numarasına sahip ELRS firmware’i çalıştırması gerekir. Versiyon numarasının yalnızca ilk basamağının eşleşmesi yeterlidir; örneğin 3.1.2 ile 3.0.1 birlikte çalışır, ancak 3.x ile 2.x çalışmaz. Firmware versiyonlarınız uyuşmuyorsa aşağıdaki bağlama yöntemlerinin hiçbiri işe yaramaz, bu nedenle işe bu kontrolle başlamak önemlidir.</p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Bağlama Yöntemleri</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">ELRS’te iki temel bağlama yöntemi vardır.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Binding Phrase (Bağlama İbaresi):</strong>&nbsp;Firmware yüklenmeden önce hem TX modülüne hem de alıcıya aynı özel metnin girilmesiyle cihazlar otomatik olarak eşleşir. ELRS 3.0 itibarıyla bu ibare, yeniden flash yapmaya gerek kalmadan Web UI üzerinden de güncellenebilmektedir. Yeni bir firmware yükleyecekseniz bu yöntemi tercih etmenizi öneririz. İbareyi seçerken en az 8 alfanümerik karakterden oluşan, pilot takma adınız gibi size özgü bir ifade kullanın. Binding phrase bir şifre değil, diğer pilotlarla sinyal çakışmasını önlemeye yarayan bir tanımlayıcıdır.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Geleneksel Bağlama:</strong>&nbsp;Binding phrase kullanmak istemiyorsanız ya da zaten yüklü olan firmware’i değiştirmeden bağlamak istiyorsanız geleneksel yöntemi kullanabilirsiniz. Bu yöntemde alıcı manuel olarak bağlama moduna alınır ve TX’ten Lua Script (Kumanda yazılımı) aracılığıyla bağlama sinyali gönderilir.</p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Geleneksel Bağlama — Adım Adım</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">ELRS 3.4.0 itibarıyla alıcıyı bağlama moduna geçirmenin birkaç farklı yolu mevcuttur.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">3x Güç Döngüsü yöntemiyle</strong>&nbsp;şu adımları izleyin: Önce TX modülünüzü (kumanda) kapatın. Ardından alıcıya güç verin, 2 saniye içinde kesin ve bunu 3 kez tekrarlayın. Alıcının LED’i hızlı çift yanıp sönmeye başlarsa bağlama moduna girmiş demektir. Bağlama moduna giren alıcının LED’i çift blink yapıp kısa duraklar ve bunu tekrar eder. Son adımda ELRS uyumlu kumandanızda SYS tuşuna basın, kumandanızda SYS tuşuna basarak araçlar menüsünü açın ve listeden ExpressLRS uygulamasını seçin ve [BIND] butonuna basın; kumanda bağlama sinyali gönderir ve LED sabit yanarsa bağlama tamamlanmış demektir.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Buton yöntemi:</strong>&nbsp;Alıcı üzerinde boot butonuna alıcıya güç verildikten sonra 1,5 saniye basılı tutun. Alıcı bağlama moduna girer; ardından kumanda arayüzünden aynı şekilde bağlama işlemini tamamlayın.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Betaflight yöntemi:</strong>&nbsp;Uçuş kontrol kartı Betaflight 4.5.0 veya daha yeni bir versiyon çalıştırıyorsa Betaflight Configurator 10.10’un Receiver sekmesindeki “Bind Receiver” butonunu ya da CLI’da&nbsp;<code style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-family: &quot;JetBrains Mono&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em;\\">bind_rx</code>&nbsp;komutunu kullanarak alıcıyı bağlama moduna alabilirsiniz.<br><br><img src=\\"/uploads/blog_editor_1783687843721002800_image.png\\" width=\\"512\\" style=\\"width: 100%; height: auto; display: block; margin: 16px auto;\\" height=\\"327\\"><br></p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">LED Durumları</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Alıcının durumunu LED’den takip edebilirsiniz. Yavaş yanıp sönme (yaklaşık 500ms aralıklarla) TX’i beklediğini, yani bağlantı olmadığını gösterir. Çift hızlı blink ardından kısa duraklama, bağlama modunda olduğunu ifade eder. Hızlı yanıp sönme ise WiFi modunun aktif olduğu anlamına gelir. Sabit yanan LED ise TX ile bağlantının kurulduğunu gösterir.<br><br><img src=\\"/uploads/blog_editor_1783687891380546500_image.png\\" width=\\"299\\" style=\\"width: 100%; height: auto; display: block; margin: 16px auto;\\" height=\\"70\\"><br></p><table style=\\"box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.08) !important; margin: 40px 0px !important; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); text-indent: 0px; border-collapse: separate !important; width: 800px; border-spacing: 0px !important; background-color: rgba(255, 255, 255, 0.02) !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 40px -10px !important; color: rgba(255, 255, 255, 0.6); font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-size: 18px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><thead style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><th style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em;\\">LED Göstergesi</h3></th><th style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em;\\">Durum Açıklaması</h3></th></tr></thead><tbody style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 15px !important; color: rgb(255, 255, 255) !important; line-height: 1.6 !important; transition: background-color 0.2s !important; text-transform: uppercase; background-color: rgba(255, 255, 255, 0.05) !important; font-weight: 600 !important; letter-spacing: 0.03em !important;\\">Yeşil heartbeat LED</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 15px !important; color: rgb(255, 255, 255) !important; line-height: 1.6 !important; transition: background-color 0.2s !important; text-transform: uppercase; background-color: rgba(255, 255, 255, 0.05) !important; font-weight: 600 !important; letter-spacing: 0.03em !important;\\">Web firmware güncelleme modu aktif – http://10.0.0.1/</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Turuncu çift blink + duraklama</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Bind (eşleştirme) modu aktif</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Turuncu üçlü blink + duraklama</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Verici ile bağlantı mevcut, ancak model-match konfigürasyonu uyumsuz</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">RGB gökkuşağı fade efekti</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Sistem başlatma (boot) aşamasında</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Kırmızı 100 ms açık / kapalı</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">RF çipi algılanmadı veya haberleşme hatası</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px 1px medium !important; border-style: none solid solid none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) rgba(255, 255, 255, 0.05) currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">500 ms açık / kapalı blink</td><td style=\\"box-sizing: border-box; border-width: medium medium 1px !important; border-style: none none solid !important; border-color: currentcolor currentcolor rgba(255, 255, 255, 0.05) !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Vericiden bağlantı bekleniyor</td></tr><tr style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5);\\"><td style=\\"box-sizing: border-box; border-width: medium 1px medium medium !important; border-style: none solid none none !important; border-color: currentcolor rgba(255, 255, 255, 0.05) currentcolor currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Sabit RGB renk</td><td style=\\"box-sizing: border-box; border-width: medium !important; border-style: none !important; border-color: currentcolor !important; border-image: none !important; margin: 0px; padding: 20px 24px !important; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 16px !important; color: rgba(255, 255, 255, 0.8) !important; line-height: 1.6 !important; transition: background-color 0.2s !important;\\">Vericiye bağlı, LED rengi aktif paket hızını (packet rate) temsil eder</td></tr></tbody></table><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Bağlama tamamlandıktan sonra kumanda ekranının sağ üst köşesinde “C” harfi görünüyorsa TX ve alıcı birbirleriyle iletişim kuruyor demektir.<br><br><img src=\\"/uploads/blog_editor_1783687945361172600_image.png\\" width=\\"985\\" style=\\"width: 985px; height: 657px; display: block; margin: 16px auto;\\" height=\\"657\\"><br></p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Model Uyuşmazlığı (Model Mismatch)</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 32px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 20px; color: rgba(255, 255, 255, 0.9); line-height: 1.6; font-weight: 400; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">“C” harfi görünüp kayboluyor ve yerine “Model Mismatch” yazısı geliyorsa panik yapmayın. ELRS, alıcıdaki model ID’sinin kumandanızdaki model yapılandırmasıyla eşleşmediğini tespit etmiştir. ExpressLRS arayüzünde Model Match seçeneğini bir kez kapatıp tekrar açmak, mevcut model ID’sini alıcıya atar ve sorunu çözer. Bu işlemi TX ve alıcı ikisi de açık ve bağlantı kurmuşken yapmanız gerekir.</p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Web UI’a Erişim</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Web UI; firmware güncelleme, binding phrase değiştirme ve çeşitli yapılandırma işlemleri için kullanılır. Alıcıyı WiFi moduna geçirmenin en kolay yolu şudur: Kumandanızı kapalı bırakın ve alıcıya güç verin. Alıcı yaklaşık 60 saniye içinde otomatik olarak WiFi moduna geçer ve LED hızlı yanıp sönmeye başlar. Alternatif olarak alıcı bağlıyken&nbsp;ExpressLRS arayüzünde&nbsp;WiFi Connectivity → Enable RX WiFi seçeneğiyle anında WiFi moduna geçirebilirsiniz.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">WiFi moduna giren alıcı “ExpressLRS RX” adlı bir erişim noktası oluşturur. Telefon veya bilgisayarınızdan bu ağa bağlanın; şifre&nbsp;<code style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-family: &quot;JetBrains Mono&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em;\\">expresslrs</code>&nbsp;olarak gelir. Bağlandıktan sonra tarayıcınızda&nbsp;<code style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-family: &quot;JetBrains Mono&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em;\\">http://10.0.0.1/</code>&nbsp;adresine gidin. Alıcıyı daha önce ev ağınıza tanıttıysanız&nbsp;<code style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-family: &quot;JetBrains Mono&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em;\\">http://elrs_rx.local</code>&nbsp;adresi de çalışacaktır.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">10.0.0.1 adresi bazı modem ve router’larla çakışabilir. Bu durumda ethernet bağlantısını kesin veya akıllı telefonunuzdan deneyin. Sayfa hâlâ açılmıyorsa komut satırında&nbsp;<code style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-family: &quot;JetBrains Mono&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 1em;\\">arp -a</code>&nbsp;komutu ile ağdaki cihaz listesini görüntüleyip alıcının IP adresini bulabilirsiniz.</p><h3 style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 24px 0px 16px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 22px; font-weight: 700; color: rgb(255, 255, 255); letter-spacing: -0.025em; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\">Web UI Sekmeleri</h3><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Information:</strong>&nbsp;Donanım adı, firmware versiyonu, binding UID ve değiştirilmiş ayarlar gibi temel cihaz bilgilerini gösterir.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Binding:</strong>&nbsp;Binding phrase veya UID’yi güncellemek için kullanılır. Aynı ibareyi kullanan cihazlar otomatik olarak eşleşir.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Options:</strong>&nbsp;UART baud hızı, sinyal inversiyonu ve WiFi zaman aşımı gibi çalışma zamanı ayarlarını barındırır. Alıcıyı normal koşullarda bir uçuş kontrol kartına bağlıyorsanız baud hızını varsayılan 420000 olarak bırakın.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">WiFi:</strong>&nbsp;Ev ağınızın SSID ve şifresini buraya girdiğinizde alıcı WiFi moduna geçtiğinde kendi erişim noktası oluşturmak yerine doğrudan bu ağa bağlanır.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Update:</strong>&nbsp;ELRS Configurator veya Web Flasher tarafından hazırlanan firmware dosyasını buradan yükleyebilirsiniz.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Serial:</strong>&nbsp;UART protokolü ve baud hızını değiştirmek için kullanılır.</p><p style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px 0px 24px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-size: 18px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; font-family: &quot;Plus Jakarta Sans&quot;, &quot;Plus Jakarta Sans Fallback&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(0, 0, 0); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\\"><strong style=\\"box-sizing: border-box; border: 0px solid lab(90.952 0 -0.0000119209); margin: 0px; padding: 0px; outline-color: oklab(0.707999 -0.00000712276 0.0000166297 / 0.5); font-weight: bolder;\\">Hardware Layout:</strong>&nbsp;Bu sekme yalnızca ileri düzey kullanıcılar içindir. Donanım pin atamaları ve güç yapılandırması gibi kritik ayarları içerir. Ne yaptığınızdan emin değilseniz buradaki hiçbir ayara dokunmayın.</p>"	t	2026-07-10 15:53:14.921153	7	elrs-alici-kurulum-ve-baglama-rehberi-orbit-teknoloji
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at) FROM stdin;
1	Haberleşme	2026-06-30 15:45:16.212103
2	Güç	2026-06-30 15:45:16.212103
9	Uçuş Kartları	2026-07-21 14:15:10.865177
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, subject, message, status, created_at) FROM stdin;
20	Alice Bob	alicebob@gmail.com	Genel Bilgi	test message. test message. test message. test message. test message.	read	2026-07-11 10:03:25.932548
\.


--
-- Data for Name: home_slider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.home_slider (id, product_id, model_code, slide_title, slide_desc, image_url, sort_order, active) FROM stdin;
6	orbith743v2-ucus-kontrol-karti	h743	ORBIT H743	Uçuş Kontrol Kartı	/uploads/slider_1785997588560787732_ORBITH743V2-zip.png	0	t
7	orbit-bls-50a-4in1-esc	BLS	BLS 50A 4in1	Güçlü 4in1 ESC Kartı	/uploads/slider_1786974614234200783_blsRender5.png	0	t
9	pluto-55a-esc	pluto	Pluto 55A ESC	Güç Yönetimi	/uploads/slider_1786974771003620419_PlutoLarRender4.png	0	t
8	orbit-m10s-5883-gps-modulu	GPS	ORBIT M10S-5883 	GPS Modülü	/uploads/slider_1786974788705733962_GPSLerRender1.png	0	t
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, name, profession, employment_type, linkedin_url, cv_file_path, status, created_at) FROM stdin;
\.


--
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_positions (id, title, department, location, job_type, description, requirements, linkedin_url, active, created_at) FROM stdin;
9	Genel Başvuru	Software Department	İstanbul, Ankara, Remote	Tam Zamanlı		{}	https://www.linkedin.com/company/orbitteknoloji/jobs/?viewAsMember=true	t	2026-06-25 15:08:48.653582
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, role, category, tagline, description, images, specs, channels, badge, sort_order, active, created_at, pinout_images, downloads, is_campaign_active, campaign_discount_rate, details, campaign_title, campaign_description, campaign_button_text, campaign_button_url) FROM stdin;
orbit-orb-t-2-4g-nano-elrs-al-c--pa-lna	ORBIT 2.4GHz Nano ELRS Alıcı PA/lNA	Kumanda Alıcısı (RX Receiver)	Haberleşme	2.4GHz Nano ELRS Alıcı	Orbit 2.4GHz Nano ELRS, ESP32-C3 işlemcisi ve dahili TCXO & PA/LNA çipleriyle ultra düşük gecikmeli, kesintisiz uzun menzil kontrolü sunar. Yalnızca 1.2 g ağırlığı ve 12x19 mm boyutlarıyla mikro dronlar ve kompakt robotik projeler için ideal, esnek anten altyapılı bir ExpressLRS alıcısıdır.	{/uploads/orbit-orb-t-2-4g-nano-elrs-al-c--pa-lna_gal_1783687505253151700_ELRS-1.png,/uploads/orbit-orb-t-2-4g-nano-elrs-al-c--pa-lna_gal_1784642690265345549_ELRS-3_Clear.png,/uploads/orbit-orb-t-2-4g-nano-elrs-al-c--pa-lna_gal_1784642693384939201_ELRS-4_Clear.png,/uploads/orbit-orb-t-2-4g-nano-elrs-al-c--pa-lna_gal_1784642135553398190_ELRS-2.jpg}	[{"label": "İşlemci (MCU)", "value": "ESP32-C3"}, {"label": "RF Protokolü", "value": "ExpressLRS (ELRS)"}, {"label": "Frekans Bandı", "value": "2.4 GHz"}, {"label": "Kristal Osilatör", "value": "TCXO"}, {"label": "Güç Amplifikatörü (PA)", "value": "Dahili"}, {"label": "Düşük Gürültülü Amplifikatör (LNA)", "value": "Dahili"}, {"label": "Durum LED'i", "value": "Dahili RGB LED"}, {"label": "Çalışma Gerilimi", "value": "5V"}, {"label": "Anten Konnektörü", "value": "U.FL (IPEX)"}, {"label": "Anten Tipi", "value": "Omni-directional"}, {"label": "Anten Uzunluğu", "value": "95 mm"}, {"label": "Boyutlar", "value": "12 × 19 mm"}, {"label": "Ağırlık", "value": "1.2 g"}, {"label": "Kullanım Alanı", "value": "RC Kumanda Alıcısı / Drone / Uçak / Araç"}, {"label": "Firmware", "value": "ORBIT 2.4Ghz Nano RX"}]	[{"url": "https://www.hepsiburada.com/orbit-2-4g-nano-elrs-alici-pa-lna-pm-HBC0000DO5Y4U?magaza=Orbit%20Teknoloji", "name": "Hepsiburada"}, {"url": "https://www.trendyol.com/shop/orbit-2-4g-nano-elrs-alici-pa-lna-p-1140136365", "name": "Trendyol"}, {"url": "https://www.n11.com/urun/orbit-24g-nano-elrs-alici-palna-122416815?magaza=orbit-teknoloji", "name": "N11"}, {"url": "https://www.pttavm.com/orbit-2-4g-nano-elrs-alici-pa-lna-p-1454242388", "name": "PttAVM"}, {"url": "https://www.robolinkmarket.com/orbit-24g-nano-elrs-alici-pa-lna", "name": "Robolinkmarket"}]	YENİ	0	t	2026-07-10 15:03:23.359675	{}	[{"desc": "", "size": "", "type": "", "title": ""}]	f	15	"<h4><strong>Orbıt 2.4g Nano Elrs Alıcı Pa/lna</strong></h4><p><strong><br>Açıklama</strong><br>Orbit 2.4GHz Nano ELRS Kumanda Alıcısı, ExpressLRS altyapısı üzerine geliştirilmiş, ultra kompakt boyutlarına rağmen yüksek performans sunan bir haberleşme modülüdür. ESP32-C3 MCU ile donatılan alıcı, dahili TCXO kristal osilatör sayesinde frekans kararlılığı yüksek, düşük gecikmeli ve güvenilir bir bağlantı sağlar.<br>Dahili PA &amp; LNA amplifikatörleri, uzun menzil ve güçlü sinyal performansı sunarak FPV ve otonom sistemlerde stabil kontrol imkânı verir. Entegre RGB LED, bağlantı ve çalışma durumunu görsel olarak takip etmeyi kolaylaştırır. 2.4 GHz frekans bandında çalışan alıcı, 5V besleme ile uçuş kontrol kartları ve farklı sistemlere kolayca entegre edilebilir. U.FL anten konnektörü, farklı anten seçenekleriyle esnek kullanım sunar. 12 × 19 mm boyutları ve yalnızca 1.2 g ağırlığı sayesinde mikro dronlar ve alan kısıtı bulunan kompakt robotik projeler için ideal bir ELRS alıcı çözümüdür.<br><br><strong>Özellikler</strong><br>• ExpressLRS (ELRS) uyumlu<br>• ESP32-C3 MCU<br>• Dahili TCXO kristal osilatör<br>• Dahili PA &amp; LNA amplifikatör<br>• Dahili RGB durum LED’i<br>• Frekans bandı: 2.4 GHz<br>• Çalışma gerilimi: 5V<br>• Anten konnektörü: U.FL<br>• Boyut: 12 × 19 mm<br>• Ağırlık: 1.2 g<br><br><strong>Paket İçeriği</strong><br>• 1 x Orbit 2.4GHz Nano ELRS Kumanda Alıcısı<br>• 1 x U.FL 95 mm T Anten (omni‑directional)<br>• 1 x Isı Shrink tüp (daralan makaron)<br>• 1 × 4'lü 10cm silikon kablo<br>• 1 × Pin header<br><br><strong>Kullanım Alanları</strong><br>• FPV dronlar<br>• İnsansız Hava Araçları (İHA)<br>• Otonom robotik sistemler</p><p><br></p><section><div><div><div><div><div><h3>LED Durum Göstergeleri</h3></div></div></div></div><div><div></div></div></div></section><section><div><div><div><div><div><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2026/02/RGB_Led_All.png\\"></div></div></div></div></div></section><div><div><table><thead><tr><th><h3>LED Göstergesi</h3></th><th><h3>Durum Açıklaması</h3></th></tr></thead><tbody><tr><td>Yeşil heartbeat LED</td><td>Web firmware güncelleme modu aktif</td></tr><tr><td>Turuncu çift blink + duraklama</td><td>Bind (eşleştirme) modu aktif</td></tr><tr><td>Turuncu üçlü blink + duraklama</td><td>Verici ile bağlantı mevcut, ancak model-match konfigürasyonu uyumsuz</td></tr><tr><td>RGB gökkuşağı fade efekti</td><td>Sistem başlatma (boot) aşamasında</td></tr><tr><td>Kırmızı 100 ms açık / kapalı</td><td>RF çipi algılanmadı veya haberleşme hatası</td></tr><tr><td>500 ms açık / kapalı blink</td><td>Vericiden bağlantı bekleniyor</td></tr><tr><td>Sabit RGB renk</td><td>Vericiye bağlı, LED rengi aktif paket hızını (packet rate) temsil eder</td></tr></tbody></table></div></div>"	\N	\N	\N	\N
orbit-bls-50a-4in1-esc	ORBIT BLS 50A 4in1 ESC	ESC	Güç	Hız Kontrol Kartı	4in1 ESC, DSHOT 600 ve BDSHOT destekli 2–6S LiPo / 50A yapısıyla hassas ve güçlü motor kontrolü sağlar. Dahili akım sensörü, voltaj korumaları ve standart 30.5×30.5 mm montaj ölçüleriyle FPV ve İHA projeleri için ideal, 12.5 g ağırlığında kompakt bir çözümdür.	{/uploads/orbit-bls-50a-4in1-esc_gal_1786600312830780642_blsRender2.png,/uploads/orbit-bls-50a-4in1-esc_gal_1784644410382687330_BLS-1.png,/uploads/orbit-bls-50a-4in1-esc_gal_1784644410721032192_BLS-2.png,/uploads/orbit-bls-50a-4in1-esc_gal_1784644411075168879_BLS-3.jpg}	[{"label": "Ürün Tipi", "value": "4in1 ESC (Elektronik Hız Kontrolörü)"}, {"label": "Desteklenen Motor Sayısı", "value": "4 Motor"}, {"label": "Sürekli / Anlık Akım", "value": "50A (Maksimum)"}, {"label": "Giriş Gerilimi (Besleme)", "value": "2S – 6S LiPo"}, {"label": "Firmware", "value": "BLHeli-S / Bluejay"}, {"label": "Sinyal Protokolleri", "value": "BDSHOT , DSHOT-(150/300/600)"}, {"label": "Telemetri / Sensörler", "value": "Dahili Akım Sensörü"}, {"label": "Devre Korumaları", "value": "TVS Diyot Koruma"}, {"label": "Montaj Ölçüleri", "value": "30.5 × 30.5 mm (M4 Vidalar için)"}, {"label": "Boyutlar", "value": "42 × 47 mm"}, {"label": "Ağırlık", "value": "12.5 g"}]	[{"url": "https://www.robolinkmarket.com/orbit-bls-50a-esc", "name": "Robolinkmarket"}]		0	t	2026-07-21 14:33:31.116412	{/uploads/orbit-bls-50a-4in1-esc_pinout_1784644850515469204_ORBITF435-Wiring-Diagram.png|ORBITF435-Wiring-Diagram.png}	[{"url": "/uploads/orbit-bls-50a-4in1-esc_dl_1784644850514783977_ORBITF435-Wiring-Diagram.pdf", "desc": "", "size": "", "type": "PDF", "title": "Bağlantı Şeması", "file_name": "ORBITF435-Wiring-Diagram.pdf"}]	f		"<div><div><div><div><section><div><div><div><div><div><p><strong>4in1 ESC</strong>, dört motoru tek kart üzerinden kontrol edebilen, kompakt ve yüksek performanslı bir elektronik hız kontrol çözümüdür.<span>&nbsp;</span><strong>BLHeli-S</strong><span>&nbsp;</span>ve<span>&nbsp;</span><strong>Bluejay</strong><span>&nbsp;</span>yazılımlarıyla uyumlu yapısı sayesinde<span>&nbsp;</span><strong>BDSHOT</strong><span>&nbsp;</span>ve<span>&nbsp;</span><strong>DSHOT 600</strong><span>&nbsp;</span>protokollerini destekleyerek düşük gecikmeli ve hassas motor kontrolü sağlar.</p><p><strong>2–6S LiPo</strong><span>&nbsp;</span>pil desteği ve<span>&nbsp;</span><strong>50A maksimum akım kapasitesi</strong>, yüksek güç gerektiren drone ve İHA uygulamaları için güvenilir bir çalışma sunar. Dahili<span>&nbsp;</span><strong>akım sensörü</strong>, güç tüketiminin anlık izlenmesine imkân tanırken;<span>&nbsp;</span><strong>ters voltaj koruması</strong><span>&nbsp;</span>ve<span>&nbsp;</span><strong>TVS diyot</strong><span>&nbsp;</span>ile elektriksel darbelere karşı güvenli bir yapı sağlar.&nbsp;<strong>30.5 × 30.5 mm M4 montaj standardı</strong><span>, yaygın uçuş kontrol kartlarıyla tam uyumluluk sunar.<span>&nbsp;</span></span><strong>42 × 47 mm</strong><span><span>&nbsp;</span>boyutları ve yalnızca<span>&nbsp;</span></span><strong>12.5 g</strong><span><span>&nbsp;</span>ağırlığı sayesinde performans ve ağırlık dengesini ideal seviyede tutar.</span></p></div></div></div></div></div></section><h3>Özellikler:</h3><ul><li>4 motor kontrolü (4in1 yapı)</li><li>BLHeli-S uyumlu</li><li>BlueJay uyumlu</li><li>Firmware: C-H-50</li><li>BDSHOT &amp; DSHOT600 desteği</li><li>2-6S Lipo giriş voltajı</li><li>Maksimum sürekli akım: 50A</li><li>Akım sensörü entegre</li><li>Ters voltaj koruması</li><li>TVS diyot desteği</li><li>Montaj: M4 &amp; 30.5 x 30.5 mm ölçüler</li><li>Boyut: 42 x 47mm</li><li>Ağırlık: 12.5g</li></ul><h3>Kullanım Alanları:</h3><ul><li>FPV yarış dronları</li><li>Genel amaçlı dron projeleri</li><li>İHA uygulamaları</li></ul><h3>Paket İçeriği:</h3><ul><li>1 x Orbit BLS 50A 4in1 ESC</li><li>1 x 5 cm JST-SH 8 pin konnektör kablo</li><li>1 x XT60H soket</li><li>1 x 35V 1000µF kapasitör</li><li>2 x 10 cm silikon kablo (12 AWG, siyah ve kırmızı)</li></ul></div></div></div></div><br>"				
orbitf435-u-u--kontrol-kart-	ORBITF435 Ucuş Kontrol Kartı	Uçuş Kontrol Kartı	Uçuş Kartları	Uçuş Kontrol Kartı	ORBITF435, 288 MHz AT32F435 işlemcisiyle STM32F405'e göre 1.7 kat daha hızlı hesaplama gücü sunan yüksek performanslı bir uçuş kontrol kartıdır. Hassas ICM42688P IMU ve DPS368 barometresiyle donatılan kart; MicroSD/16 MB veri kaydı, Betaflight ve iNav desteğiyle FPV yarışlarından otonom İHA'lara kadar tam kontrol sağlar.	{/uploads/orbitf435-u-u--kontrol-kart-_gal_1784549416501548962_3D_PCB1_V2_2_2026-07-02_back.png,/uploads/orbitf435-u-u--kontrol-kart-_gal_1784644004286995375_OrbitF435-2_clear.png,/uploads/orbitf435-u-u--kontrol-kart-_gal_1784644004630210929_OrbitF435-3.jpg}	[{"label": "İşlemci", "value": "AT32F435 (288 MHz)"}, {"label": "Motor Desteği", "value": "8 Motor"}, {"label": "Barometre", "value": "DPS368"}, {"label": "IMU Sensörü", "value": "ICM42688P"}, {"label": "Hafıza", "value": "16 MB dahili + MicroSD kart desteği"}, {"label": "Firmware", "value": "Betaflight & iNav uyumlu"}, {"label": "Giriş Voltajı", "value": "2-6S Lipo"}, {"label": "Koruma", "value": "TVS diyot & ters voltaj koruması"}, {"label": "BEC", "value": "5V/2.5A, 10V/3A"}, {"label": "Montaj", "value": "M4 & 30.5 x 30.5 mm"}, {"label": "Boyut", "value": "38.5 x 41 mm"}, {"label": "Ağırlık", "value": "8.5 gr"}]	[{"url": "https://www.robolinkmarket.com/orbitf435-ucus-kontrol-karti", "name": "RoboLink"}]	POPÜLER	0	t	2026-07-11 08:02:45.371122	{/uploads/orbitf435-u-u--kontrol-kart-_pinout_1784643730530421254_ORBITF435-Wiring-Diagram.png|ORBITF435-Wiring-Diagram.png,/uploads/orbitf435-u-u--kontrol-kart-_pinout_1784643731971435170_ORBITF435-Layout.png|ORBITF435-Layout.png}	[{"url": "/uploads/orbitf435-u-u--kontrol-kart-_dl_1784643730529350601_ORBITF435-Wiring-Diagram.pdf", "desc": "OrbitF435 Uçuş Kontrol Kartı Bağlantı Şeması", "size": "", "type": "PDF", "title": "Bağlantı Şeması", "file_name": "ORBITF435-Wiring-Diagram.pdf"}, {"url": "/uploads/orbitf435-u-u--kontrol-kart-_dl_1784643730529991958_ORBITF435-Layout.pdf", "desc": "OrbitF435 Uçuş Kontrol Kartı Layout", "size": "", "type": "PDF", "title": "Layout", "file_name": "ORBITF435-Layout.pdf"}]	t	8	"<div><div><div><div><section><div><div><div><div><div><p>Tamamen yerli tasarım olan bu uçuş kartı, Betaflight ve iNav ile uyumlu çalışacak şekilde tasarlanmıştır. Gücünü hızlı AT32F435 işlemcisinden alan kart, ICM42688 IMU sensörü sayesinde daha hassas ve stabil bir uçuş performansı sunar. Betaflight bağlantı standartlarına tam uyumlu olup, DJI Air Unit için tak-çalıştır bağlantı soketine sahiptir.</p></div></div></div></div></div></section><h3>Kontrol kartımızda bulunan özellikler</h3></div></div><div><div><ul><li>AT32F435 mikrodenetleyici</li><li>8 motor destekli</li><li>Barometre sensörü</li><li>16 MB dahili hafıza</li><li>Micro SD kart desteği</li><li><a href=\\"https://betaflight.com/docs/wiki/boards/current/ORBITF435\\" rel=\\"noopener\\">Betaflight uyumlu</a></li><li>iNav uyumlu</li><li>DJI Air Unit ile uyumlu</li><li>2-6S LiPo pil desteği</li><li>TVS diyot</li><li>Ters voltaj koruması</li><li>5V 2.5A &amp; 10V 3A BEC</li><li>USB Type-C soket</li><li>Montaj: M4 &amp; 30.5 x 30.5 mm</li><li>Boyut: 38.5 x 41 mm</li><li>Ağırlık: 8.5 gr</li></ul><p><img src=\\"https://orbitteknoloji.com.tr/wp-content/uploads/2024/05/PCB-bilgilendirme-site.jpg\\"></p><div><div><h3>⚠️ AT32 (Artery) MCU – Driver Gereksinimi Hakkında Önemli Bilgilendirme</h3></div></div><div><div><p>Uçuş kontrol kartımızda<span>&nbsp;</span><strong><span><span>Artery Technology</span></span><span>&nbsp;</span>AT32 serisi MCU</strong><span>&nbsp;</span>kullanılmaktadır. Bazı bilgisayarlarda, ilk bağlantı sırasında gerekli<span>&nbsp;</span><strong>DFU (Device Firmware Update) sürücüsü</strong><span>&nbsp;</span>yüklü değilse firmware yükleme işlemi gerçekleştirilemeyebilir. Bu durum, sisteminizde<span>&nbsp;</span><strong>AT32 DFU driver’ının yüklü olmadığını</strong><span>&nbsp;</span>gösterir.</p></div></div><div><div><h3>Çözüm Adımları</h3><ol><li><p>AT32 için resmi<span>&nbsp;</span><strong>ISP Programmer (In-System Programming)</strong><span>&nbsp;</span>aracını indirin:<br>🔗<span>&nbsp;</span><a href=\\"https://www.arterychip.com/file/download/1764\\">https://www.arterychip.com/file/download/1764</a></p></li><li><p>İndirdiğiniz dosyayı zip’ten çıkarın.</p></li><li><p>Klasör içerisinde bulunan:<br><strong>Artery_DFU_DriverInstall</strong><span>&nbsp;</span>dizinine girin.</p></li><li><p>Driver kurulum dosyasını çalıştırarak yüklemeyi tamamlayın.</p></li><li><p>Kurulum sonrası:</p><ul><li><p>USB kablosunu çıkarıp tekrar takın</p></li><li><p>Gerekirse bilgisayarı yeniden başlatın</p></li></ul></li></ol></div></div></div></div></div></div><div><div><div><div><div></div></div></div></div></div><br>"	\N	\N	\N	\N
orbith743v2-ucus-kontrol-karti	ORBITH743v2 Uçuş Kontrol Kartı	Uçuş Kontrol Kartı	Uçuş Kartları	ORBITH743v2 ArduPilot & INAV Uyumlu Profesyonel Uçuş Kartı	ORBITH743v2 Uçuş Kontrol Kartı, 480 MHz STM32H743 işlemcisi ve yedekli Çift IMU yapısıyla otonom görevler için maksimum stabilite sunar. ArduPilot/INAV desteği, CAN Bus, 8x UART ve dahili 5.3V Raspberry Pi güç çıkışıyla FPV dronlar ve profesyonel İHA’lar için geliştirilmiş üst seviye bir uçuş beynidir.	{"/uploads/orbith743v2-ucus-kontrol-karti_gal_1785504159184016018_FT35V2 Transparan sıkıştırılmış.png",/uploads/orbith743v2-ucus-kontrol-karti_gal_1784647288539281036_ORBITH743v2Top4.png,/uploads/orbith743v2-ucus-kontrol-karti_gal_1784647291281969287_ORBITH743v2Bottom4.png}	[{"label": "İşlemci", "value": "STM32H743 (480 MHz)"}, {"label": "Sensörler (IMU)", "value": "Çift ICM-42688-P + ICM-40609D"}, {"label": "Barometre", "value": "SPA06"}, {"label": "Hafıza", "value": "Dahili 16 MB DataFlash"}, {"label": "PWM Çıkışları", "value": "13× (8x Motor, 4x Servo, 1x LED)"}, {"label": "UART Portları", "value": "8× UART"}, {"label": "Arayüzler", "value": "CAN Bus, 1× PinIO"}, {"label": "OSD & Video", "value": "AT7456 / Dijital & Analog VTX"}, {"label": "Giriş Voltajı", "value": "2S – 6S LiPo"}, {"label": "BEC Çıkışları", "value": "5V/3A, 10V/3A, 5.3V/3A (SBC/Pi için)"}, {"label": "Koruma", "value": "TVS Aşırı Gerilim & Ters Polarite"}, {"label": "Yazılım Desteği", "value": "ArduPilot, INAV"}, {"label": "Montaj Ölçüsü", "value": "30.5 × 30.5 mm (M4)"}, {"label": "Boyut & Ağırlık", "value": "38 × 40 mm / 8.5 g"}]	[{"url": "https://www.google.com", "name": "Hepsiburada"}, {"url": "https://www.google.com", "name": "Trendyol"}, {"url": "https://www.google.com", "name": "N11"}, {"url": "https://www.google.com", "name": "RoboLink"}, {"url": "https://www.google.com", "name": "Ptt AVM"}]	YENİ	0	t	2026-07-21 15:09:22.542615	{/uploads/orbith743v2-ucus-kontrol-karti_pinout_1784647294026304357_ORBITH743v2-LayoutDiagram-scaled.png|ORBITH743v2-LayoutDi...caled.png,/uploads/orbith743v2-ucus-kontrol-karti_pinout_1784647296107713222_ORBITH743v2-WiringDiagram-scaled.png|ORBITH743v2-WiringDi...caled.png}	[{"url": "/uploads/orbith743v2-ucus-kontrol-karti_dl_1784647288538355638_ORBITH743v2-WiringDiagram-scaled.pdf", "desc": "ORBITH743v2 Uçuş Kontrol Kartı Bağlantı Şeması", "size": "", "type": "PDF", "title": "Bağlantı Şeması", "file_name": "ORBITH743v2-WiringDiagram-scaled.pdf"}, {"url": "/uploads/orbith743v2-ucus-kontrol-karti_dl_1784647288538923890_ORBITH743v2-LayoutDiagram-scaled.pdf", "desc": "ORBITH743v2 Uçuş Kontrol Kartı Layout", "size": "", "type": "PDF", "title": "Layout", "file_name": "ORBITH743v2-LayoutDiagram-scaled.pdf"}]	t	%20	"<h2> ORBITH743v2 Otonom Uçuş Kontrol Kartı</h2><p><strong>Maksimum Hesaplama Gücü, Çift IMU Güvencesi ve Esnek Otonom Kontrol!</strong></p><p>ORBITH743; <strong>480 MHz</strong> hızında çalışan yeni nesil <strong>STM32H743</strong> mikrodenetleyicisi ile en karmaşık otonom görevleri, uçuş algoritmalarını ve yüksek frekanslı kontrol döngülerini zahmetsizce yürütmek üzere tasarlandı.</p><h3>Neden ORBITH743v2?</h3><ul><li><p><strong>Çift IMU ile Yedekli Güvenlik:</strong> Kart üzerinde yer alan <strong>ICM-42688-P</strong> ve <strong>ICM-40609D</strong> sensörleri, titreşimli ortamlarda bile yüksek hassasiyetli jiroskop ve ivmeölçer verisi sağlar. Sensör yedekliliği sayesinde uçuş güvenliği en üst seviyeye çıkar.</p></li><li><p><strong>ArduPilot ve INAV ile Tam Otonom:</strong> ArduPilot ve INAV ekosistemleriyle tam uyumlu yapısı; otonom görev planlama, waypoint navigasyonu, hold-position ve hassas <strong>SPA06 barometresi</strong> ile irtifa sabitleme özelliklerini kusursuz şekilde sunar.</p></li><li><p><strong>Sınırsız Genişlenebilirlik (13x PWM &amp; CAN Bus):</strong> 8 motor, 4 servo ve 1 LED çıkışının yanı sıra <strong>CAN Bus</strong> arayüzü ve <strong>8 adet UART</strong> portu ile GPS, telemetri, komut kumandaları ve harici sensörleri aynı anda sorunsuz bağlayabilirsiniz.</p></li><li><p><strong>Tek Kart Bilgisayarlar (SBC) İçin Dahili Güç (5.3V / 3A):</strong> Companion Computer (Raspberry Pi vb.) entegrasyonu gerektiren yapay zeka ve görüntü işleme projeleriniz için ekstra güç modülüne ihtiyaç duymadan <strong>5.3V özel güç çıkışı</strong> sağlar.</p></li><li><p><strong>Güçlü BEC ve Çift VTX Desteği:</strong> 2–6S LiPo giriş aralığı, dahili <strong>AT7456 OSD</strong> çipi ve bağımsız <strong>5V/3A</strong> ile <strong>10V/3A BEC</strong> çıkışları sayesinde hem dijital (HD) hem de analog FPV sistemlerini doğrudan besleyebilirsiniz.</p></li><li><p><strong>Endüstriyel Devre Koruması:</strong> Dahili <strong>TVS diyot</strong> aşırı gerilim koruması ve <strong>ters polarite koruması</strong> sayesinde zorlu saha koşullarında kartınızı elektriksel risklere karşı korur.</p></li></ul><h3>Uygulama Alanları</h3><p>Yalnızca <strong>8.5 g</strong> ağırlığı ve standart <strong>30.5 × 30.5 mm</strong> montaj ölçüsüyle; otonom FPV dronlar, sabit kanat İHA’lar, multirotorlar ve karmaşık robotik projeler için eksiksiz ve güvenilir bir uçuş kartı çözümdür.</p>"	N11'de İndirim!	N11 üzerinden yapılan ORBITH743v2 Uçuş Kontrol Kartı siparişlerinde ORB20 kodunu kullan %20 indirim yakala.	N11'e Git	https://www.google.com
orbit-m10s-5883-gps-modulu	ORBIT M10S-5883 GPS Modülü	GPS	Haberleşme	ORBIT M10S-5883 GPS Modülü	ORBIT M10S-5883 GPS Modülü, yüksek hassasiyetli konumlama ve güvenilir yön bilgisi sunan kompakt bir GNSS çözümüdür. Dahili u-blox MAX-M10S, GPS, GLONASS, Galileo ve BeiDou sistemlerini destekleyerek hızlı ve kararlı konum verisi sağlar. Entegre QMC5883P dijital pusula, doğru heading bilgisi sunar.	{"/uploads/orbit-m10s-5883-gps-modulu_gal_1786613456792311002_GPS (kb) - Copy-for-products.png",/uploads/orbit-m10s-5883-gps-modulu_gal_1784648280381134023_M10SGPS-1.png,/uploads/orbit-m10s-5883-gps-modulu_gal_1784648283060360120_M10SGPS-2.png,/uploads/orbit-m10s-5883-gps-modulu_gal_1784648285844240890_M10SGPS-4.jpg}	[{"label": "GNSS Modülü", "value": "u-blox MAX-M10S (GPS, GLONASS, Galileo, BeiDou)"}, {"label": "Pusula (Compass)", "value": "Dahili QMC5883P Manyetik Pusula"}, {"label": "Giriş Voltajı", "value": "5V"}, {"label": "Yazılım Uyumluğu", "value": "ArduPilot, Betaflight, INAV (Tak-Çalıştır)"}, {"label": "Soket Bağlantıları", "value": "1× JST-SH 1.0mm 6P / 1× JST-GH 1.25mm 6P"}, {"label": "Ek Bağlantı", "value": "Doğrudan Lehimleme Padleri"}, {"label": "Göstergeler", "value": "Power (Güç) & Fix (Kilitlenme) LED'leri"}, {"label": "Hızlı Başlatma", "value": "Dahili Li-ion Batarya (Hot-Start)"}, {"label": "Boyutlar", "value": "23 × 23 mm"}, {"label": "Ağırlık", "value": "9g"}]	null	YENİ	0	t	2026-07-21 15:38:06.611253	{}	[{"desc": "", "size": "", "type": "", "title": "", "file_name": ""}]	f		"<div><message-content><div><h2>Orbit MAX-M10S GNSS &amp; Pusula Modülü</h2><p><strong>Hızlı Kilitlenme, Yüksek Konum Hassasiyeti ve Tak-Çalıştır Kolaylığı!</strong></p><p>Orbit MAX-M10S; yeni nesil <strong>u-blox MAX-M10S</strong> GNSS çipi ile donatılmış, ultra kompakt boyutlarda yüksek hassasiyetli bir konumlandırma ve yönelim çözümüdür. GPS, GLONASS, Galileo ve BeiDou uydu sistemlerini aynı anda takip edebilen gelişmiş mimarisi sayesinde, zorlu coğrafi koşullarda ve şehir içi ortamlarda bile çok hızlı uydu kilitlenmesi (Fix) sağlar.</p><h3>Öne Çıkan Özellikler</h3><ul><li><p><strong>Çoklu Uydu Desteği (Multi-GNSS):</strong> Dört ana uydu ağını (GPS, GLONASS, Galileo, BeiDou) eşzamanlı kullanarak yüksek konum doğruluğu ve kesintisiz sinyal takibi sunar.</p></li><li><p><strong>Dahili QMC5883P Pusula:</strong> Kart üzerinde entegre bulunan manyetik pusula (compass) sayesinde, otonom yönelim ve rotada kalma görevlerini ekstra bir modüle ihtiyaç duymadan gerçekleştirir.</p></li><li><p><strong>Hızlı Yeniden Başlatma (Hot-Start):</strong> Dahili Li-ion bataryası, son bilinen uydu konum verilerini hafızada tutarak güç kesintilerinden sonra saniyeler içinde tekrar uydu kilitlenmesi sağlar.</p></li><li><p><strong>Esnek ve Tak-Çalıştır Bağlantı:</strong> Hem <strong>JST-SH 1.0mm</strong> hem de <strong>JST-GH 1.25mm</strong> soket seçeneklerinin yanı sıra lehimleme padleri sunar. Ekstra yazılım yükleme gerektirmeden tak-çalıştır şeklinde kullanılır.</p></li><li><p><strong>Visual Status LED'leri:</strong> Kart üzerindeki <strong>Power</strong> (Güç) ve <strong>Fix</strong> (Uydu Kilitlenme) LED'leri sayesinde modülün çalışma durumunu saha koşullarında görsel olarak anında takip edebilirsiniz.</p></li></ul><h3>Uygulama Alanları</h3><p>Yalnızca <strong>23 × 23 mm</strong> boyutları ve <strong>9 g</strong> hafifliği ile; FPV yarış dronları, otonom İHA'lar, sabit kanat platformlar ve mikro robotik projeler için ArduPilot, Betaflight ve INAV ekosistemleriyle tam uyumlu ideal bir GPS/Pusula çözümüdür.</p></div></message-content></div>"				
pluto-55a-esc	Pluto 55A ESC	ESC	Güç	Yeni Versiyon Pluto ESC - 55A	Pluto 55A ESC, 2–7S LiPo desteği ve dahili 470µF Low ESR kapasitörüyle yüksek performanslı ve stabil bir motor kontrolü sunar. Alüminyum pasif soğutması, BLHeli-S/Bluejay yazılımları ve BDShot/DSHOT600 desteğiyle; FPV dronlar, İHA’lar ve su altı robotik (ROV) projeleri için geliştirilmiş yerli üretim çözümdür.	{"/uploads/pluto-55a-esc_gal_1786613432815487059_PLUTOESC - Copy-for-products.png",/uploads/pluto-55a-esc_gal_1784645779490496794_Pluto55A-1.png,/uploads/pluto-55a-esc_gal_1784645563031916324_Pluto55A-2.png,/uploads/pluto-55a-esc_gal_1784645564737657061_Pluto55A-3.png}	[{"label": "Model", "value": "Pluto 55A ESC"}, {"label": "Sürekli Akım", "value": "55A (3S Batarya için)"}, {"label": "Anlık Tepe Akımı (Burst)", "value": "90A (Maks. 25 saniye)"}, {"label": "Giriş Gerilimi (Besleme)", "value": "2S – 7S LiPo"}, {"label": "Firmware", "value": "BLHeli-S / Bluejay (Hedef: C-H-40)"}, {"label": "Sinyal Protokolleri", "value": "DSHOT600/300/150,  BDShot, PWM"}, {"label": "Filtreleme & Güç Güvenliği", "value": "TVS Diyot, Dahili 470 µF Low ESR Kapasitör"}, {"label": "Soğutma Yapısı", "value": "Pasif Alüminyum Soğutucu Blok"}, {"label": "Dahili Kablolar", "value": "10 cm, 14 AWG Güç Kabloları (Montajlı)"}, {"label": "Boyutlar (Kablo ve Kapasitör Hariç)", "value": "35 × 23 mm"}, {"label": "Ağırlık", "value": "20.5 g (Kablolar dahil)"}]	[{"url": "https://www.robolinkmarket.com/pluto-50a-esc-blheli", "name": "Robolinkmarket"}, {"url": "https://www.n11.com/urun/pluto-55a-esc-yeni-versiyon-blheli-s-bluejay-dshot-destekli-2s-7s-lipo-uyumlu-yerli-uretim-130549475", "name": "N11"}, {"url": "https://www.hepsiburada.com/pluto-55a-esc-yeni-versiyon-blheli-s-bluejay-dshot-destekli-2s-7s-lipo-uyumlu-yerli-uretim-pm-HBC0000FZKBYT", "name": "Hepsiburada"}, {"url": "https://www.trendyol.com/pd/shop/pluto-55a-esc-yeni-versiyon-blheli-s-bluejay-dshot-destekli-2s-7s-lipo-uyumlu-yerli-uretim-p-1164481049", "name": "Trendyol"}, {"url": "https://www.pttavm.com/pluto-55a-esc-yeni-versiyon-blheli-s-bluejay-dshot-destekli-2s-7s-lipo-uyumlu-yerli-uretim-p-1511236775", "name": "PttAVM"}]	POPÜLER	0	t	2026-07-21 14:52:48.000007	{}	[{"desc": "", "size": "", "type": "", "title": "", "file_name": ""}]	f		"<div><div><h3>ESC kartımızın özellikleri</h3></div></div><div><div><p>✅ BlHeli-S uyumlu<br>✅ Bluejay uyumlu<br>✅ BDSHOT ve DSHOT-600 desteği<br>✅ Firmware: C-H-40<br>✅ 2-7S Lipo pil destekli<br>✅ Sürekli max akım: 55A (3S batarya için)<br>✅ Anlık tepe akım: 90A (25sn)<br>✅ Pasif alüminyum soğutma<br>✅ Dahili 470uF Low ESR Kapasitör<br>✅ Dahili 10 cm, 14 awg güç kabloları<br>✅ Ebat: 35 x 23 mm<br>✅ Agırlık: 20.5 gr (kablolar dahil)<br>✅ Yerli Üretim<br>✅ Dronlar, İHA’lar ve su altı robotları için kullanılabilir.</p></div></div>"				
\.


--
-- Data for Name: redirects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.redirects (id, old_url, new_url, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: sales_channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channels (id, name, url, image_url, sort_order, active, created_at) FROM stdin;
1	Trendyol	https://www.trendyol.com/magaza/orbit-teknoloji-m-1095784?sst=0&channelId=1	/uploads/sc_1783752430083323434_sc_1782717362785846800_trendyol.png	0	t	2026-06-29 10:16:02.788762
4	RoboLink	https://www.robolinkmarket.com/orbit-teknoloji	/uploads/sc_1783752533847621584_sc_1782717441783576900_robolink.png	3	t	2026-06-29 10:17:21.785334
3	N11	https://www.n11.com/magaza/orbit-teknoloji	/uploads/sc_1783752474912355269_sc_1782717422002481500_n11.png	2	t	2026-06-29 10:17:02.003908
5	Ptt Avm	https://www.pttavm.com/magaza/orbitteknoloji	/uploads/sc_1783752551493184504_sc_1782717459002036600_pttavm.png	4	t	2026-06-29 10:17:39.004463
2	Hepsiburada	https://www.hepsiburada.com/magaza/orbit-teknoloji	/uploads/sc_1783752446257382908_sc_1782717398862924300_hepsiburada.png	1	t	2026-06-29 10:16:38.864308
6	Yasa Elektronik	https://yasaelektronik.com/orbit-teknoloji	/uploads/sc_1786182588163177330_white_yasa.png	10	t	2026-08-08 09:41:28.207015
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, site_title, site_description, site_keywords, logo_url, favicon_url, contact_email, contact_phone, contact_address, map_latitude, map_longitude, social_linkedin, social_youtube, social_x, social_github, updated_at, offices_json, social_instagram, social_nsosyal, social_links_json, catalog_url, favicon_dark_url) FROM stdin;
1	Orbit Teknoloji — Yerli İHA Elektroniği ve Yazılım Teknolojileri	Yerli Ar-Ge'den doğan İHA elektroniği. ESC'den GPS'e, tamamen yerli mühendisliğinin ürünü.	iha, esc, gps, flight control, uçuş kontrol, elrs, lrs, orbit, drone, software	/uploads/blog_editor_1786956225993409753_Orbit-logo-white-orange 01 Artboard 1.png	/uploads/blog_editor_1785503737923820955_ChatGPT Image Jul 31, 2026, 10_53_32 AM.png	info@orbitteknoloji.com.tr	+905526501110	İvedikköy, Anadolu Blv Corner 2 Plaza No:151/6, 06378 Yenimahalle/Ankara	41.0263	28.8916	https://linkedin.com/company/orbitteknoloji	https://youtube.com/c/orbitteknoloji	https://x.com/orbitteknoloji	https://github.com/orbitteknoloji	2026-08-17 08:43:46.186956	[{"city": "Ankara", "name": "Merkez Ofis", "address": "İvedikköy, Anadolu Blv Corner 2 Plaza No:151/6, 06378 Yenimahalle/Ankara", "latitude": 40.00073629790036, "longitude": 32.772095613173626}]	\N	\N	[{"url": "https://www.instagram.com/orbitteknoloji/", "name": "İnstagram"}, {"url": "https://nsosyal.com/orbit_teknoloji", "name": "N Sosyal"}]		/uploads/blog_editor_1785503752383958616_Orbit-logo-white 01 Artboard 1 (2).png
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, last_login, created_at) FROM stdin;
7	test@test.com	$2a$10$dpY3u8J/9O4UTg7zLLy7tOKk.3xl1fvKi9bBin82Jnm0BEbzWjIZK	admin	2026-06-25 16:21:55.019898	2026-06-25 16:21:36.466426
3	admin@orbitteknoloji.com	$2a$10$/OkuE4v90lHs5BL0Sb81tuM.mlW0YG5/aJzoRBP6vMqc/V9mri6lm	admin	2026-08-19 05:46:53.838139	2026-05-25 16:22:04.247738
\.


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authors_id_seq', 7, true);


--
-- Name: badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.badges_id_seq', 3, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 26, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 9, true);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 21, true);


--
-- Name: home_slider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.home_slider_id_seq', 9, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 17, true);


--
-- Name: job_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_positions_id_seq', 11, true);


--
-- Name: redirects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.redirects_id_seq', 3, true);


--
-- Name: sales_channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_channels_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: home_slider home_slider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_slider
    ADD CONSTRAINT home_slider_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_positions job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: redirects redirects_old_url_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_old_url_key UNIQUE (old_url);


--
-- Name: redirects redirects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);


--
-- Name: sales_channels sales_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channels
    ADD CONSTRAINT sales_channels_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: blog_posts unique_blog_slug; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT unique_blog_slug UNIQUE (slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: home_slider home_slider_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_slider
    ADD CONSTRAINT home_slider_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TABLE badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.badges TO PUBLIC;


--
-- Name: SEQUENCE badges_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.badges_id_seq TO PUBLIC;


--
-- Name: TABLE redirects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.redirects TO PUBLIC;


--
-- Name: SEQUENCE redirects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.redirects_id_seq TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict HphJBEqjR3SVaN5FFtIicWYQtq6uQz6NaS7DG15MfUj5Qto4WhLCg8aP0wfoeH0

