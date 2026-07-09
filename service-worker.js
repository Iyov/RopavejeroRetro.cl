// ========== SERVICE WORKER - ROPAVEJERO RETRO ==========
// Versión del caché - Incrementar cuando actualices recursos
const CACHE_VERSION = 'ropavejero-v2026-07-09_0146';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const DATA_CACHE_NAME = `${CACHE_VERSION}-data`;

// Recursos para cachear inmediatamente
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/productos',
    '/productos.html',
    '/css/index.min.css',
    '/css/font-awesome_6.5.1_all.min.css',
    '/js/index.min.js',
    '/js/instagram_posts.min.js',
    '/js/app.min.js',
    '/img/hero-400.webp',
    '/img/hero-800.webp',
    '/img/hero-1200.webp',
    '/img/hero-1920.webp',
    '/img/hero-800.jpg',
    '/img/hero-1200.jpg',
    '/img/hero-1920.jpg',
    '/img/RopavejeroLogo_256.png',
    '/img/RopavejeroLogo_150.png',
    '/img/RopavejeroLogo_100.png',
    '/img/RopavejeroLogo_50.png',
    '/img/favicon.png',
    '/manifest.json'
];

// Recursos de Instagram (imágenes de posts WebP responsive y fallbacks)
const INSTAGRAM_IMAGES = [
    '/img/IG_18346096714175747.jpeg',
    '/img/IG_18346096714175747-400.webp',
    '/img/IG_18346096714175747-800.webp',
    '/img/IG_18346096714175747-1200.webp',
    '/img/IG_17893974075544347.jpeg',
    '/img/IG_17893974075544347-400.webp',
    '/img/IG_17893974075544347-800.webp',
    '/img/IG_17893974075544347-1200.webp',
    '/img/IG_18467792680129493.jpeg',
    '/img/IG_18467792680129493-400.webp',
    '/img/IG_18467792680129493-800.webp',
    '/img/IG_18467792680129493-1200.webp',
    '/img/IG_18604960858021189.jpeg',
    '/img/IG_18604960858021189-400.webp',
    '/img/IG_18604960858021189-800.webp',
    '/img/IG_18604960858021189-1200.webp',
    '/img/IG_18078697145277808.jpeg',
    '/img/IG_18078697145277808-400.webp',
    '/img/IG_18078697145277808-800.webp',
    '/img/IG_18078697145277808-1200.webp',
    '/img/IG_17943938514249914.jpeg',
    '/img/IG_17943938514249914-400.webp',
    '/img/IG_17943938514249914-800.webp',
    '/img/IG_17943938514249914-1200.webp',
    '/img/IG_18097437857245247.jpeg',
    '/img/IG_18097437857245247-400.webp',
    '/img/IG_18097437857245247-800.webp',
    '/img/IG_18097437857245247-1200.webp',
    '/img/IG_17895201561518421.jpeg',
    '/img/IG_17895201561518421-400.webp',
    '/img/IG_17895201561518421-800.webp',
    '/img/IG_17895201561518421-1200.webp',
    '/img/IG_18134732296514374.jpeg',
    '/img/IG_18134732296514374-400.webp',
    '/img/IG_18134732296514374-800.webp',
    '/img/IG_18134732296514374-1200.webp',
    '/img/IG_18012318548714493.jpeg',
    '/img/IG_18012318548714493-400.webp',
    '/img/IG_18012318548714493-800.webp',
    '/img/IG_18012318548714493-1200.webp',
    '/img/IG_18091015343339846.jpeg',
    '/img/IG_18091015343339846-400.webp',
    '/img/IG_18091015343339846-800.webp',
    '/img/IG_18091015343339846-1200.webp',
    '/img/IG_17955187178982678.jpeg',
    '/img/IG_17955187178982678-400.webp',
    '/img/IG_17955187178982678-800.webp',
    '/img/IG_17955187178982678-1200.webp',
    '/img/IG_18134367052519782.jpeg',
    '/img/IG_18134367052519782-400.webp',
    '/img/IG_18134367052519782-800.webp',
    '/img/IG_18134367052519782-1200.webp',
    '/img/IG_17984907332841169.jpeg',
    '/img/IG_17984907332841169-400.webp',
    '/img/IG_17984907332841169-800.webp',
    '/img/IG_17984907332841169-1200.webp',
    '/img/IG_18101392343177645.jpeg',
    '/img/IG_18101392343177645-400.webp',
    '/img/IG_18101392343177645-800.webp',
    '/img/IG_18101392343177645-1200.webp',
    '/img/IG_17920755663166115.jpeg',
    '/img/IG_17920755663166115-400.webp',
    '/img/IG_17920755663166115-800.webp',
    '/img/IG_17920755663166115-1200.webp',
    '/img/IG_18106786930986685.jpeg',
    '/img/IG_18106786930986685-400.webp',
    '/img/IG_18106786930986685-800.webp',
    '/img/IG_18106786930986685-1200.webp',
    '/img/IG_18039500906643180.jpeg',
    '/img/IG_18039500906643180-400.webp',
    '/img/IG_18039500906643180-800.webp',
    '/img/IG_18039500906643180-1200.webp',
    '/img/IG_18121957894671289.jpeg',
    '/img/IG_18121957894671289-400.webp',
    '/img/IG_18121957894671289-800.webp',
    '/img/IG_18121957894671289-1200.webp',
    '/img/IG_17957763413962983.jpeg',
    '/img/IG_17957763413962983-400.webp',
    '/img/IG_17957763413962983-800.webp',
    '/img/IG_17957763413962983-1200.webp',
    '/img/IG_18101717978327095.jpeg',
    '/img/IG_18101717978327095-400.webp',
    '/img/IG_18101717978327095-800.webp',
    '/img/IG_18101717978327095-1200.webp',
    '/img/IG_17859660888648083.jpeg',
    '/img/IG_17859660888648083-400.webp',
    '/img/IG_17859660888648083-800.webp',
    '/img/IG_17859660888648083-1200.webp',
    '/img/IG_18077064845659618.jpeg',
    '/img/IG_18077064845659618-400.webp',
    '/img/IG_18077064845659618-800.webp',
    '/img/IG_18077064845659618-1200.webp',
    '/img/IG_17940876870238887.jpeg',
    '/img/IG_17940876870238887-400.webp',
    '/img/IG_17940876870238887-800.webp',
    '/img/IG_17940876870238887-1200.webp',
    '/img/IG_17965887636095967.jpeg',
    '/img/IG_17965887636095967-400.webp',
    '/img/IG_17965887636095967-800.webp',
    '/img/IG_17965887636095967-1200.webp',
    '/img/IG_18109715416864353.jpeg',
    '/img/IG_18109715416864353-400.webp',
    '/img/IG_18109715416864353-800.webp',
    '/img/IG_18109715416864353-1200.webp',
    '/img/IG_17917735215181915.jpeg',
    '/img/IG_17917735215181915-400.webp',
    '/img/IG_17917735215181915-800.webp',
    '/img/IG_17917735215181915-1200.webp',
    '/img/IG_18393075559083487.jpeg',
    '/img/IG_18393075559083487-400.webp',
    '/img/IG_18393075559083487-800.webp',
    '/img/IG_18393075559083487-1200.webp',
    '/img/IG_18061997759710421.jpeg',
    '/img/IG_18061997759710421-400.webp',
    '/img/IG_18061997759710421-800.webp',
    '/img/IG_18061997759710421-1200.webp',
    '/img/IG_17887431276562955.jpeg',
    '/img/IG_17887431276562955-400.webp',
    '/img/IG_17887431276562955-800.webp',
    '/img/IG_17887431276562955-1200.webp',
    '/img/IG_18095953978957330.jpeg',
    '/img/IG_18095953978957330-400.webp',
    '/img/IG_18095953978957330-800.webp',
    '/img/IG_18095953978957330-1200.webp',
    '/img/IG_18097290721901876.jpeg',
    '/img/IG_18097290721901876-400.webp',
    '/img/IG_18097290721901876-800.webp',
    '/img/IG_18097290721901876-1200.webp',
    '/img/IG_17957653841964869.jpeg',
    '/img/IG_17957653841964869-400.webp',
    '/img/IG_17957653841964869-800.webp',
    '/img/IG_17957653841964869-1200.webp',
    '/img/IG_17963687460107882.jpeg',
    '/img/IG_17963687460107882-400.webp',
    '/img/IG_17963687460107882-800.webp',
    '/img/IG_17963687460107882-1200.webp',
    '/img/IG_18077094959275704.jpeg',
    '/img/IG_18077094959275704-400.webp',
    '/img/IG_18077094959275704-800.webp',
    '/img/IG_18077094959275704-1200.webp',
    '/img/IG_17872389108528500.jpeg',
    '/img/IG_17872389108528500-400.webp',
    '/img/IG_17872389108528500-800.webp',
    '/img/IG_17872389108528500-1200.webp',
    '/img/IG_18015303527904438.jpeg',
    '/img/IG_18015303527904438-400.webp',
    '/img/IG_18015303527904438-800.webp',
    '/img/IG_18015303527904438-1200.webp',
    '/img/IG_17868402897543380.jpeg',
    '/img/IG_17868402897543380-400.webp',
    '/img/IG_17868402897543380-800.webp',
    '/img/IG_17868402897543380-1200.webp',
    '/img/IG_18082073762553475.jpeg',
    '/img/IG_18082073762553475-400.webp',
    '/img/IG_18082073762553475-800.webp',
    '/img/IG_18082073762553475-1200.webp',
    '/img/IG_17870360103618042.jpeg',
    '/img/IG_17870360103618042-400.webp',
    '/img/IG_17870360103618042-800.webp',
    '/img/IG_17870360103618042-1200.webp',
    '/img/IG_18132492037570227.jpeg',
    '/img/IG_18132492037570227-400.webp',
    '/img/IG_18132492037570227-800.webp',
    '/img/IG_18132492037570227-1200.webp',
    '/img/IG_17904993897428947.jpeg',
    '/img/IG_17904993897428947-400.webp',
    '/img/IG_17904993897428947-800.webp',
    '/img/IG_17904993897428947-1200.webp',
    '/img/IG_17914247667401750.jpeg',
    '/img/IG_17914247667401750-400.webp',
    '/img/IG_17914247667401750-800.webp',
    '/img/IG_17914247667401750-1200.webp',
    '/img/IG_18043345292789985.jpeg',
    '/img/IG_18043345292789985-400.webp',
    '/img/IG_18043345292789985-800.webp',
    '/img/IG_18043345292789985-1200.webp',
    '/img/IG_18100047431279781.jpeg',
    '/img/IG_18100047431279781-400.webp',
    '/img/IG_18100047431279781-800.webp',
    '/img/IG_18100047431279781-1200.webp',
    '/img/IG_18090653012047311.jpeg',
    '/img/IG_18090653012047311-400.webp',
    '/img/IG_18090653012047311-800.webp',
    '/img/IG_18090653012047311-1200.webp',
    '/img/IG_18376574647160139.jpeg',
    '/img/IG_18376574647160139-400.webp',
    '/img/IG_18376574647160139-800.webp',
    '/img/IG_18376574647160139-1200.webp',
    '/img/IG_17879148105458714.jpeg',
    '/img/IG_17879148105458714-400.webp',
    '/img/IG_17879148105458714-800.webp',
    '/img/IG_17879148105458714-1200.webp',
    '/img/IG_18038217008639754.jpeg',
    '/img/IG_18038217008639754-400.webp',
    '/img/IG_18038217008639754-800.webp',
    '/img/IG_18038217008639754-1200.webp',
    '/img/IG_18208467916340909.jpeg',
    '/img/IG_18208467916340909-400.webp',
    '/img/IG_18208467916340909-800.webp',
    '/img/IG_18208467916340909-1200.webp',
    '/img/IG_18141687913516219.jpeg',
    '/img/IG_18141687913516219-400.webp',
    '/img/IG_18141687913516219-800.webp',
    '/img/IG_18141687913516219-1200.webp',
    '/img/IG_17990010884968060.jpeg',
    '/img/IG_17990010884968060-400.webp',
    '/img/IG_17990010884968060-800.webp',
    '/img/IG_17990010884968060-1200.webp',
    '/img/IG_17854531284660652.jpeg',
    '/img/IG_17854531284660652-400.webp',
    '/img/IG_17854531284660652-800.webp',
    '/img/IG_17854531284660652-1200.webp',
    '/img/IG_18026618264820152.jpeg',
    '/img/IG_18026618264820152-400.webp',
    '/img/IG_18026618264820152-800.webp',
    '/img/IG_18026618264820152-1200.webp',
    '/img/IG_18140429098517323.jpeg',
    '/img/IG_18140429098517323-400.webp',
    '/img/IG_18140429098517323-800.webp',
    '/img/IG_18140429098517323-1200.webp',
    '/img/IG_18094612081936792.jpeg',
    '/img/IG_18094612081936792-400.webp',
    '/img/IG_18094612081936792-800.webp',
    '/img/IG_18094612081936792-1200.webp',
    '/img/IG_18082195955411131.jpeg',
    '/img/IG_18082195955411131-400.webp',
    '/img/IG_18082195955411131-800.webp',
    '/img/IG_18082195955411131-1200.webp',
    '/img/IG_18436444705137216.jpeg',
    '/img/IG_18436444705137216-400.webp',
    '/img/IG_18436444705137216-800.webp',
    '/img/IG_18436444705137216-1200.webp',
    '/img/IG_18101625304951830.jpeg',
    '/img/IG_18101625304951830-400.webp',
    '/img/IG_18101625304951830-800.webp',
    '/img/IG_18101625304951830-1200.webp',
    '/img/IG_17869556793612028.jpeg',
    '/img/IG_17869556793612028-400.webp',
    '/img/IG_17869556793612028-800.webp',
    '/img/IG_17869556793612028-1200.webp',
    '/img/IG_18106546817495495.jpeg',
    '/img/IG_18106546817495495-400.webp',
    '/img/IG_18106546817495495-800.webp',
    '/img/IG_18106546817495495-1200.webp',
    '/img/IG_18089193371204319.jpeg',
    '/img/IG_18089193371204319-400.webp',
    '/img/IG_18089193371204319-800.webp',
    '/img/IG_18089193371204319-1200.webp',
    '/img/IG_17985386828814208.jpeg',
    '/img/IG_17985386828814208-400.webp',
    '/img/IG_17985386828814208-800.webp',
    '/img/IG_17985386828814208-1200.webp',
    '/img/IG_18069983498664410.jpeg',
    '/img/IG_18069983498664410-400.webp',
    '/img/IG_18069983498664410-800.webp',
    '/img/IG_18069983498664410-1200.webp',
    '/img/IG_17914340775362643.jpeg',
    '/img/IG_17914340775362643-400.webp',
    '/img/IG_17914340775362643-800.webp',
    '/img/IG_17914340775362643-1200.webp',
    '/img/IG_18080748431416203.jpeg',
    '/img/IG_18080748431416203-400.webp',
    '/img/IG_18080748431416203-800.webp',
    '/img/IG_18080748431416203-1200.webp',
    '/img/IG_18154108828458099.jpeg',
    '/img/IG_18154108828458099-400.webp',
    '/img/IG_18154108828458099-800.webp',
    '/img/IG_18154108828458099-1200.webp',
    '/img/IG_17871784602663700.jpeg',
    '/img/IG_17871784602663700-400.webp',
    '/img/IG_17871784602663700-800.webp',
    '/img/IG_17871784602663700-1200.webp',
    '/img/IG_18118246249640996.jpeg',
    '/img/IG_18118246249640996-400.webp',
    '/img/IG_18118246249640996-800.webp',
    '/img/IG_18118246249640996-1200.webp',
    '/img/IG_18174258253360197.jpeg',
    '/img/IG_18174258253360197-400.webp',
    '/img/IG_18174258253360197-800.webp',
    '/img/IG_18174258253360197-1200.webp',
    '/img/IG_17985866954971453.jpeg',
    '/img/IG_17985866954971453-400.webp',
    '/img/IG_17985866954971453-800.webp',
    '/img/IG_17985866954971453-1200.webp',
    '/img/IG_18089595115977774.jpeg',
    '/img/IG_18089595115977774-400.webp',
    '/img/IG_18089595115977774-800.webp',
    '/img/IG_18089595115977774-1200.webp',
    '/img/IG_18099315008008040.jpeg',
    '/img/IG_18099315008008040-400.webp',
    '/img/IG_18099315008008040-800.webp',
    '/img/IG_18099315008008040-1200.webp',
    '/img/IG_18312173050277861.jpeg',
    '/img/IG_18312173050277861-400.webp',
    '/img/IG_18312173050277861-800.webp',
    '/img/IG_18312173050277861-1200.webp',
    '/img/IG_17883306600502552.jpeg',
    '/img/IG_17883306600502552-400.webp',
    '/img/IG_17883306600502552-800.webp',
    '/img/IG_17883306600502552-1200.webp',
    '/img/IG_18417967792125333.jpeg',
    '/img/IG_18417967792125333-400.webp',
    '/img/IG_18417967792125333-800.webp',
    '/img/IG_18417967792125333-1200.webp',
    '/img/IG_18319887493265053.jpeg',
    '/img/IG_18319887493265053-400.webp',
    '/img/IG_18319887493265053-800.webp',
    '/img/IG_18319887493265053-1200.webp',
    '/img/IG_18086476100016483.jpeg',
    '/img/IG_18086476100016483-400.webp',
    '/img/IG_18086476100016483-800.webp',
    '/img/IG_18086476100016483-1200.webp',
    '/img/IG_18046796558752600.jpeg',
    '/img/IG_18046796558752600-400.webp',
    '/img/IG_18046796558752600-800.webp',
    '/img/IG_18046796558752600-1200.webp',
    '/img/IG_17917761678339044.jpeg',
    '/img/IG_17917761678339044-400.webp',
    '/img/IG_17917761678339044-800.webp',
    '/img/IG_17917761678339044-1200.webp',
    '/img/IG_18063426764341950.jpeg',
    '/img/IG_18063426764341950-400.webp',
    '/img/IG_18063426764341950-800.webp',
    '/img/IG_18063426764341950-1200.webp',
    '/img/IG_18005375426710787.jpeg',
    '/img/IG_18005375426710787-400.webp',
    '/img/IG_18005375426710787-800.webp',
    '/img/IG_18005375426710787-1200.webp',
    '/img/IG_17972823113858508.jpeg',
    '/img/IG_17972823113858508-400.webp',
    '/img/IG_17972823113858508-800.webp',
    '/img/IG_17972823113858508-1200.webp',
    '/img/IG_18071324624541843.jpeg',
    '/img/IG_18071324624541843-400.webp',
    '/img/IG_18071324624541843-800.webp',
    '/img/IG_18071324624541843-1200.webp',
    '/img/IG_18023227511639731.jpeg',
    '/img/IG_18023227511639731-400.webp',
    '/img/IG_18023227511639731-800.webp',
    '/img/IG_18023227511639731-1200.webp',
    '/img/IG_18102142781309641.jpeg',
    '/img/IG_18102142781309641-400.webp',
    '/img/IG_18102142781309641-800.webp',
    '/img/IG_18102142781309641-1200.webp',
    '/img/IG_18127312852603869.jpeg',
    '/img/IG_18127312852603869-400.webp',
    '/img/IG_18127312852603869-800.webp',
    '/img/IG_18127312852603869-1200.webp',
    '/img/IG_18046375097729709.jpeg',
    '/img/IG_18046375097729709-400.webp',
    '/img/IG_18046375097729709-800.webp',
    '/img/IG_18046375097729709-1200.webp',
    '/img/IG_17854862022631904.jpeg',
    '/img/IG_17854862022631904-400.webp',
    '/img/IG_17854862022631904-800.webp',
    '/img/IG_17854862022631904-1200.webp',
    '/img/IG_18175707910377145.jpeg',
    '/img/IG_18175707910377145-400.webp',
    '/img/IG_18175707910377145-800.webp',
    '/img/IG_18175707910377145-1200.webp',
    '/img/IG_18104183341887528.jpeg',
    '/img/IG_18104183341887528-400.webp',
    '/img/IG_18104183341887528-800.webp',
    '/img/IG_18104183341887528-1200.webp',
    '/img/IG_17999589350910911.jpeg',
    '/img/IG_17999589350910911-400.webp',
    '/img/IG_17999589350910911-800.webp',
    '/img/IG_17999589350910911-1200.webp',
    '/img/IG_18170813791392948.jpeg',
    '/img/IG_18170813791392948-400.webp',
    '/img/IG_18170813791392948-800.webp',
    '/img/IG_18170813791392948-1200.webp',
    '/img/IG_17920957479266936.jpeg',
    '/img/IG_17920957479266936-400.webp',
    '/img/IG_17920957479266936-800.webp',
    '/img/IG_17920957479266936-1200.webp',
    '/img/IG_18071761007140852.jpeg',
    '/img/IG_18071761007140852-400.webp',
    '/img/IG_18071761007140852-800.webp',
    '/img/IG_18071761007140852-1200.webp',
    '/img/IG_17902748031199245.jpeg',
    '/img/IG_17902748031199245-400.webp',
    '/img/IG_17902748031199245-800.webp',
    '/img/IG_17902748031199245-1200.webp',
    '/img/IG_18110866735659338.jpeg',
    '/img/IG_18110866735659338-400.webp',
    '/img/IG_18110866735659338-800.webp',
    '/img/IG_18110866735659338-1200.webp',
    '/img/IG_18119567194606230.jpeg',
    '/img/IG_18119567194606230-400.webp',
    '/img/IG_18119567194606230-800.webp',
    '/img/IG_18119567194606230-1200.webp',
    '/img/IG_17996237519906325.jpeg',
    '/img/IG_17996237519906325-400.webp',
    '/img/IG_17996237519906325-800.webp',
    '/img/IG_17996237519906325-1200.webp',
    '/img/IG_17909902839309642.jpeg',
    '/img/IG_17909902839309642-400.webp',
    '/img/IG_17909902839309642-800.webp',
    '/img/IG_17909902839309642-1200.webp',
    '/img/IG_18119768341583465.jpeg',
    '/img/IG_18119768341583465-400.webp',
    '/img/IG_18119768341583465-800.webp',
    '/img/IG_18119768341583465-1200.webp',
    '/img/IG_17867016285552189.jpeg',
    '/img/IG_17867016285552189-400.webp',
    '/img/IG_17867016285552189-800.webp',
    '/img/IG_17867016285552189-1200.webp',
    '/img/IG_18020656073803699.jpeg',
    '/img/IG_18020656073803699-400.webp',
    '/img/IG_18020656073803699-800.webp',
    '/img/IG_18020656073803699-1200.webp',
    '/img/IG_18098015590916334.jpeg',
    '/img/IG_18098015590916334-400.webp',
    '/img/IG_18098015590916334-800.webp',
    '/img/IG_18098015590916334-1200.webp',
    '/img/IG_18049655384645855.jpeg',
    '/img/IG_18049655384645855-400.webp',
    '/img/IG_18049655384645855-800.webp',
    '/img/IG_18049655384645855-1200.webp',
    '/img/IG_18320707375210014.jpeg',
    '/img/IG_18320707375210014-400.webp',
    '/img/IG_18320707375210014-800.webp',
    '/img/IG_18320707375210014-1200.webp',
    '/img/IG_17895332295180674.jpeg',
    '/img/IG_17895332295180674-400.webp',
    '/img/IG_17895332295180674-800.webp',
    '/img/IG_17895332295180674-1200.webp',
    '/img/IG_17913121242031125.jpeg',
    '/img/IG_17913121242031125-400.webp',
    '/img/IG_17913121242031125-800.webp',
    '/img/IG_17913121242031125-1200.webp'
];

// URLs que NO deben cachearse
const EXCLUDED_URLS = [
    'docs.google.com',
    'cloudflareinsights.com',
    'analytics',
    'chrome-extension'
];

// ========== INSTALACIÓN ==========
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando recursos estáticos');
                return cache.addAll(STATIC_RESOURCES);
            })
            .then(() => {
                // Cachear imágenes de Instagram en segundo plano
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        console.log('[Service Worker] Cacheando imágenes de Instagram');
                        return cache.addAll(INSTAGRAM_IMAGES).catch((err) => {
                            console.warn('[Service Worker] Algunas imágenes no se pudieron cachear:', err);
                        });
                    });
            })
            .then(() => {
                console.log('[Service Worker] Instalación completada');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch((error) => {
                console.error('[Service Worker] Error en instalación:', error);
            })
    );
});

// ========== ACTIVACIÓN ==========
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Eliminar cachés antiguos
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('ropavejero-') && 
                                   cacheName !== CACHE_NAME && 
                                   cacheName !== DATA_CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activación completada');
                return self.clients.claim(); // Tomar control inmediatamente
            })
    );
});

// ========== FETCH - ESTRATEGIA DE CACHÉ ==========
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar URLs excluidas
    if (EXCLUDED_URLS.some(excluded => url.href.includes(excluded))) {
        return;
    }
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Estrategia: Cache First para recursos estáticos
    if (isStaticResource(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estrategia: Network First para datos dinámicos (Google Sheets)
    if (isDataRequest(url)) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estrategia: Stale While Revalidate para imágenes
    if (isImageRequest(url)) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // Por defecto: Network First
    event.respondWith(networkFirst(request));
});

// ========== ESTRATEGIAS DE CACHÉ ==========

// Cache First: Busca en caché primero, luego en red
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('[Service Worker] Error en fetch:', error);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Network First: Intenta red primero, luego caché
async function networkFirst(request) {
    const cache = await caches.open(DATA_CACHE_NAME);
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// Stale While Revalidate: Devuelve caché y actualiza en segundo plano
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// ========== FUNCIONES AUXILIARES ==========

function isStaticResource(url) {
    return url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.woff2') ||
           url.pathname.endsWith('.ttf') ||
           url.pathname === '/' ||
           url.pathname === '/index.html' ||
           url.pathname === '/manifest.json';
}

function isDataRequest(url) {
    return url.hostname.includes('docs.google.com') ||
           url.pathname.includes('/api/');
}

function isImageRequest(url) {
    return url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.jpeg') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.gif') ||
           url.pathname.endsWith('.webp') ||
           url.pathname.endsWith('.svg');
}

// ========== MENSAJES ==========
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

console.log('[Service Worker] Cargado correctamente');
