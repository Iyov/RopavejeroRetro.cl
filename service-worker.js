// ========== SERVICE WORKER - ROPAVEJERO RETRO ==========
// Versión del caché - Incrementar cuando actualices recursos
const CACHE_VERSION = 'ropavejero-v2026-09-25_1603';
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
    '/js/modules/logger.js',
    '/js/modules/cache.js',
    '/js/modules/siglas.js',
    '/js/modules/utils.js',
    '/js/modules/ui.js',
    '/js/modules/products.js',
    '/js/modules/instagram.js',
    '/js/modules/efemerides.js',
    '/js/modules/analytics.js',
    '/js/instagram_posts.min.js',
    '/js/app.min.js',
    '/js/console_aliases.json',
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
    '/img/IG_18126163030799246.jpeg',
    '/img/IG_18126163030799246-400.webp',
    '/img/IG_18126163030799246-800.webp',
    '/img/IG_18126163030799246-1200.webp',
    '/img/IG_17965170821962909.jpeg',
    '/img/IG_17965170821962909-400.webp',
    '/img/IG_17965170821962909-800.webp',
    '/img/IG_17965170821962909-1200.webp',
    '/img/IG_18100600127219278.jpeg',
    '/img/IG_18100600127219278-400.webp',
    '/img/IG_18100600127219278-800.webp',
    '/img/IG_18100600127219278-1200.webp',
    '/img/IG_18093190739121120.jpeg',
    '/img/IG_18093190739121120-400.webp',
    '/img/IG_18093190739121120-800.webp',
    '/img/IG_18093190739121120-1200.webp',
    '/img/IG_18151922629510156.jpeg',
    '/img/IG_18151922629510156-400.webp',
    '/img/IG_18151922629510156-800.webp',
    '/img/IG_18151922629510156-1200.webp',
    '/img/IG_18091198223390424.jpeg',
    '/img/IG_18091198223390424-400.webp',
    '/img/IG_18091198223390424-800.webp',
    '/img/IG_18091198223390424-1200.webp',
    '/img/IG_18147514984537319.jpeg',
    '/img/IG_18147514984537319-400.webp',
    '/img/IG_18147514984537319-800.webp',
    '/img/IG_18147514984537319-1200.webp',
    '/img/IG_17933591445366264.jpeg',
    '/img/IG_17933591445366264-400.webp',
    '/img/IG_17933591445366264-800.webp',
    '/img/IG_17933591445366264-1200.webp',
    '/img/IG_18093614240532887.jpeg',
    '/img/IG_18093614240532887-400.webp',
    '/img/IG_18093614240532887-800.webp',
    '/img/IG_18093614240532887-1200.webp',
    '/img/IG_18071865887441908.jpeg',
    '/img/IG_18071865887441908-400.webp',
    '/img/IG_18071865887441908-800.webp',
    '/img/IG_18071865887441908-1200.webp',
    '/img/IG_18616812919027782.jpeg',
    '/img/IG_18616812919027782-400.webp',
    '/img/IG_18616812919027782-800.webp',
    '/img/IG_18616812919027782-1200.webp',
    '/img/IG_18089150498238111.jpeg',
    '/img/IG_18089150498238111-400.webp',
    '/img/IG_18089150498238111-800.webp',
    '/img/IG_18089150498238111-1200.webp',
    '/img/IG_18111290540085034.jpeg',
    '/img/IG_18111290540085034-400.webp',
    '/img/IG_18111290540085034-800.webp',
    '/img/IG_18111290540085034-1200.webp',
    '/img/IG_17985411237104572.jpeg',
    '/img/IG_17985411237104572-400.webp',
    '/img/IG_17985411237104572-800.webp',
    '/img/IG_17985411237104572-1200.webp',
    '/img/IG_18101525171223871.jpeg',
    '/img/IG_18101525171223871-400.webp',
    '/img/IG_18101525171223871-800.webp',
    '/img/IG_18101525171223871-1200.webp',
    '/img/IG_18083290445259495.jpeg',
    '/img/IG_18083290445259495-400.webp',
    '/img/IG_18083290445259495-800.webp',
    '/img/IG_18083290445259495-1200.webp',
    '/img/IG_18019950710856583.jpeg',
    '/img/IG_18019950710856583-400.webp',
    '/img/IG_18019950710856583-800.webp',
    '/img/IG_18019950710856583-1200.webp',
    '/img/IG_18059338853783101.jpeg',
    '/img/IG_18059338853783101-400.webp',
    '/img/IG_18059338853783101-800.webp',
    '/img/IG_18059338853783101-1200.webp',
    '/img/IG_18610102309063434.jpeg',
    '/img/IG_18610102309063434-400.webp',
    '/img/IG_18610102309063434-800.webp',
    '/img/IG_18610102309063434-1200.webp',
    '/img/IG_18130910356664958.jpeg',
    '/img/IG_18130910356664958-400.webp',
    '/img/IG_18130910356664958-800.webp',
    '/img/IG_18130910356664958-1200.webp',
    '/img/IG_17973296387922777.jpeg',
    '/img/IG_17973296387922777-400.webp',
    '/img/IG_17973296387922777-800.webp',
    '/img/IG_17973296387922777-1200.webp',
    '/img/IG_18208601029357992.jpeg',
    '/img/IG_18208601029357992-400.webp',
    '/img/IG_18208601029357992-800.webp',
    '/img/IG_18208601029357992-1200.webp',
    '/img/IG_17865842730637221.jpeg',
    '/img/IG_17865842730637221-400.webp',
    '/img/IG_17865842730637221-800.webp',
    '/img/IG_17865842730637221-1200.webp',
    '/img/IG_18017625290860579.jpeg',
    '/img/IG_18017625290860579-400.webp',
    '/img/IG_18017625290860579-800.webp',
    '/img/IG_18017625290860579-1200.webp',
    '/img/IG_17900929116518491.jpeg',
    '/img/IG_17900929116518491-400.webp',
    '/img/IG_17900929116518491-800.webp',
    '/img/IG_17900929116518491-1200.webp',
    '/img/IG_18063570485502687.jpeg',
    '/img/IG_18063570485502687-400.webp',
    '/img/IG_18063570485502687-800.webp',
    '/img/IG_18063570485502687-1200.webp',
    '/img/IG_18405162232089464.jpeg',
    '/img/IG_18405162232089464-400.webp',
    '/img/IG_18405162232089464-800.webp',
    '/img/IG_18405162232089464-1200.webp',
    '/img/IG_18079560557679684.jpeg',
    '/img/IG_18079560557679684-400.webp',
    '/img/IG_18079560557679684-800.webp',
    '/img/IG_18079560557679684-1200.webp',
    '/img/IG_17890144305416118.jpeg',
    '/img/IG_17890144305416118-400.webp',
    '/img/IG_17890144305416118-800.webp',
    '/img/IG_17890144305416118-1200.webp',
    '/img/IG_18112342928064657.jpeg',
    '/img/IG_18112342928064657-400.webp',
    '/img/IG_18112342928064657-800.webp',
    '/img/IG_18112342928064657-1200.webp',
    '/img/IG_18021516065856230.jpeg',
    '/img/IG_18021516065856230-400.webp',
    '/img/IG_18021516065856230-800.webp',
    '/img/IG_18021516065856230-1200.webp',
    '/img/IG_18064010813751482.jpeg',
    '/img/IG_18064010813751482-400.webp',
    '/img/IG_18064010813751482-800.webp',
    '/img/IG_18064010813751482-1200.webp',
    '/img/IG_18027904652832682.jpeg',
    '/img/IG_18027904652832682-400.webp',
    '/img/IG_18027904652832682-800.webp',
    '/img/IG_18027904652832682-1200.webp',
    '/img/IG_18023292980687007.jpeg',
    '/img/IG_18023292980687007-400.webp',
    '/img/IG_18023292980687007-800.webp',
    '/img/IG_18023292980687007-1200.webp',
    '/img/IG_17900271300520725.jpeg',
    '/img/IG_17900271300520725-400.webp',
    '/img/IG_17900271300520725-800.webp',
    '/img/IG_17900271300520725-1200.webp',
    '/img/IG_18122833891830724.jpeg',
    '/img/IG_18122833891830724-400.webp',
    '/img/IG_18122833891830724-800.webp',
    '/img/IG_18122833891830724-1200.webp',
    '/img/IG_18605858809018199.jpeg',
    '/img/IG_18605858809018199-400.webp',
    '/img/IG_18605858809018199-800.webp',
    '/img/IG_18605858809018199-1200.webp',
    '/img/IG_18161520454462773.jpeg',
    '/img/IG_18161520454462773-400.webp',
    '/img/IG_18161520454462773-800.webp',
    '/img/IG_18161520454462773-1200.webp',
    '/img/IG_18001603967972842.jpeg',
    '/img/IG_18001603967972842-400.webp',
    '/img/IG_18001603967972842-800.webp',
    '/img/IG_18001603967972842-1200.webp',
    '/img/IG_18089490338116995.jpeg',
    '/img/IG_18089490338116995-400.webp',
    '/img/IG_18089490338116995-800.webp',
    '/img/IG_18089490338116995-1200.webp',
    '/img/IG_18259538584306862.jpeg',
    '/img/IG_18259538584306862-400.webp',
    '/img/IG_18259538584306862-800.webp',
    '/img/IG_18259538584306862-1200.webp',
    '/img/IG_18111504205748090.jpeg',
    '/img/IG_18111504205748090-400.webp',
    '/img/IG_18111504205748090-800.webp',
    '/img/IG_18111504205748090-1200.webp',
    '/img/IG_18009292307936084.jpeg',
    '/img/IG_18009292307936084-400.webp',
    '/img/IG_18009292307936084-800.webp',
    '/img/IG_18009292307936084-1200.webp',
    '/img/IG_18096902894208879.jpeg',
    '/img/IG_18096902894208879-400.webp',
    '/img/IG_18096902894208879-800.webp',
    '/img/IG_18096902894208879-1200.webp',
    '/img/IG_18053899619558881.jpeg',
    '/img/IG_18053899619558881-400.webp',
    '/img/IG_18053899619558881-800.webp',
    '/img/IG_18053899619558881-1200.webp',
    '/img/IG_18070388459415230.jpeg',
    '/img/IG_18070388459415230-400.webp',
    '/img/IG_18070388459415230-800.webp',
    '/img/IG_18070388459415230-1200.webp',
    '/img/IG_18075489200696001.jpeg',
    '/img/IG_18075489200696001-400.webp',
    '/img/IG_18075489200696001-800.webp',
    '/img/IG_18075489200696001-1200.webp',
    '/img/IG_18022761137850150.jpeg',
    '/img/IG_18022761137850150-400.webp',
    '/img/IG_18022761137850150-800.webp',
    '/img/IG_18022761137850150-1200.webp',
    '/img/IG_18161098345485860.jpeg',
    '/img/IG_18161098345485860-400.webp',
    '/img/IG_18161098345485860-800.webp',
    '/img/IG_18161098345485860-1200.webp',
    '/img/IG_17893974075544347.jpeg',
    '/img/IG_17893974075544347-400.webp',
    '/img/IG_17893974075544347-800.webp',
    '/img/IG_17893974075544347-1200.webp',
    '/img/IG_18467792680129493.jpeg',
    '/img/IG_18467792680129493-400.webp',
    '/img/IG_18467792680129493-800.webp',
    '/img/IG_18467792680129493-1200.webp',
    '/img/IG_18078697145277808.jpeg',
    '/img/IG_18078697145277808-400.webp',
    '/img/IG_18078697145277808-800.webp',
    '/img/IG_18078697145277808-1200.webp',
    '/img/IG_18097437857245247.jpeg',
    '/img/IG_18097437857245247-400.webp',
    '/img/IG_18097437857245247-800.webp',
    '/img/IG_18097437857245247-1200.webp',
    '/img/IG_18134732296514374.jpeg',
    '/img/IG_18134732296514374-400.webp',
    '/img/IG_18134732296514374-800.webp',
    '/img/IG_18134732296514374-1200.webp',
    '/img/IG_18012318548714493.jpeg',
    '/img/IG_18012318548714493-400.webp',
    '/img/IG_18012318548714493-800.webp',
    '/img/IG_18012318548714493-1200.webp',
    '/img/IG_17955187178982678.jpeg',
    '/img/IG_17955187178982678-400.webp',
    '/img/IG_17955187178982678-800.webp',
    '/img/IG_17955187178982678-1200.webp',
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
    '/img/IG_18039500906643180.jpeg',
    '/img/IG_18039500906643180-400.webp',
    '/img/IG_18039500906643180-800.webp',
    '/img/IG_18039500906643180-1200.webp',
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
    '/img/IG_18029625389814183.jpeg',
    '/img/IG_18029625389814183-400.webp',
    '/img/IG_18029625389814183-800.webp',
    '/img/IG_18029625389814183-1200.webp',
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
    '/img/IG_17872389108528500.jpeg',
    '/img/IG_17872389108528500-400.webp',
    '/img/IG_17872389108528500-800.webp',
    '/img/IG_17872389108528500-1200.webp',
    '/img/IG_18015303527904438.jpeg',
    '/img/IG_18015303527904438-400.webp',
    '/img/IG_18015303527904438-800.webp',
    '/img/IG_18015303527904438-1200.webp',
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
    '/img/IG_18043345292789985.jpeg',
    '/img/IG_18043345292789985-400.webp',
    '/img/IG_18043345292789985-800.webp',
    '/img/IG_18043345292789985-1200.webp',
    '/img/IG_18100047431279781.jpeg',
    '/img/IG_18100047431279781-400.webp',
    '/img/IG_18100047431279781-800.webp',
    '/img/IG_18100047431279781-1200.webp',
    '/img/IG_17879148105458714.jpeg',
    '/img/IG_17879148105458714-400.webp',
    '/img/IG_17879148105458714-800.webp',
    '/img/IG_17879148105458714-1200.webp',
    '/img/IG_17941959300215875.jpeg',
    '/img/IG_17941959300215875-400.webp',
    '/img/IG_17941959300215875-800.webp',
    '/img/IG_17941959300215875-1200.webp',
    '/img/IG_18074451332306748.jpeg',
    '/img/IG_18074451332306748-400.webp',
    '/img/IG_18074451332306748-800.webp',
    '/img/IG_18074451332306748-1200.webp',
    '/img/IG_17944502424196559.jpeg',
    '/img/IG_17944502424196559-400.webp',
    '/img/IG_17944502424196559-800.webp',
    '/img/IG_17944502424196559-1200.webp',
    '/img/IG_17939742018246858.jpeg',
    '/img/IG_17939742018246858-400.webp',
    '/img/IG_17939742018246858-800.webp',
    '/img/IG_17939742018246858-1200.webp',
    '/img/IG_18038217008639754.jpeg',
    '/img/IG_18038217008639754-400.webp',
    '/img/IG_18038217008639754-800.webp',
    '/img/IG_18038217008639754-1200.webp',
    '/img/IG_17976110409030612.jpeg',
    '/img/IG_17976110409030612-400.webp',
    '/img/IG_17976110409030612-800.webp',
    '/img/IG_17976110409030612-1200.webp',
    '/img/IG_18141687913516219.jpeg',
    '/img/IG_18141687913516219-400.webp',
    '/img/IG_18141687913516219-800.webp',
    '/img/IG_18141687913516219-1200.webp',
    '/img/IG_18135855421477052.jpeg',
    '/img/IG_18135855421477052-400.webp',
    '/img/IG_18135855421477052-800.webp',
    '/img/IG_18135855421477052-1200.webp',
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
    '/img/IG_18174258253360197-1200.webp'
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
