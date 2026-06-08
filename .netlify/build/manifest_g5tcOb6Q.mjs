import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, i as decodeKey } from './chunks/astro/server_BhFw1asC.mjs';
import 'cookie';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/","cacheDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/node_modules/.astro/","outDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/dist/","srcDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/src/","publicDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/public/","buildClientDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/dist/","buildServerDir":"file:///Users/lilystone/Documents/Amplifly%20Things/amplifly_site/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacy-policy/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy-policy","isIndex":false,"type":"page","pattern":"^\\/privacy-policy\\/?$","segments":[[{"content":"privacy-policy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy-policy.astro","pathname":"/privacy-policy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"terms-of-service/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms-of-service","isIndex":false,"type":"page","pattern":"^\\/terms-of-service\\/?$","segments":[[{"content":"terms-of-service","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms-of-service.astro","pathname":"/terms-of-service","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"thank-you/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/thank-you","isIndex":false,"type":"page","pattern":"^\\/thank-you\\/?$","segments":[[{"content":"thank-you","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/thank-you.astro","pathname":"/thank-you","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/pages/privacy-policy.astro",{"propagation":"none","containsHead":true}],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/pages/terms-of-service.astro",{"propagation":"none","containsHead":true}],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/pages/thank-you.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/privacy-policy@_@astro":"pages/privacy-policy.astro.mjs","\u0000@astro-page:src/pages/terms-of-service@_@astro":"pages/terms-of-service.astro.mjs","\u0000@astro-page:src/pages/thank-you@_@astro":"pages/thank-you.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_g5tcOb6Q.mjs","/Users/lilystone/Documents/Amplifly Things/amplifly_site/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.5YRlrdWn.js","/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/components/FAQ.astro?astro&type=script&index=0&lang.ts":"_astro/FAQ.astro_astro_type_script_index_0_lang.D3eMJeVG.js","/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/components/Navigation.astro?astro&type=script&index=0&lang.ts":"_astro/Navigation.astro_astro_type_script_index_0_lang.jbm1cyzC.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"click\",function(n){if(!n.target||!(n.target instanceof Element))return;const t=n.target.closest(\"a\");if(t&&t.hash&&t.origin+t.pathname===window.location.origin+window.location.pathname){n.preventDefault();const e=document.querySelector(t.hash);e&&(e.scrollIntoView({behavior:\"smooth\"}),history.pushState(null,\"\",t.hash))}});"],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/components/FAQ.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".faq-btn\").forEach(e=>{e.addEventListener(\"click\",()=>{const n=e.nextElementSibling,c=e.querySelector(\".faq-icon\"),t=!n.classList.contains(\"hidden\");n.classList.toggle(\"hidden\",t),c.textContent=t?\"+\":\"−\",e.setAttribute(\"aria-expanded\",String(!t))})});"],["/Users/lilystone/Documents/Amplifly Things/amplifly_site/src/components/Navigation.astro?astro&type=script&index=0&lang.ts","const s=document.getElementById(\"mobile-menu-btn\"),n=document.getElementById(\"mobile-menu\"),t=document.getElementById(\"icon-open\"),d=document.getElementById(\"icon-close\");s?.addEventListener(\"click\",()=>{const e=n?.classList.contains(\"hidden\");n?.classList.toggle(\"hidden\",!e),t?.classList.toggle(\"hidden\",!e),d?.classList.toggle(\"hidden\",e)});n?.querySelectorAll(\"a\").forEach(e=>e.addEventListener(\"click\",()=>{n.classList.add(\"hidden\"),t?.classList.remove(\"hidden\"),d?.classList.add(\"hidden\")}));"]],"assets":["/_astro/about.BnUEnhXt.css","/favicon.svg","/robots.txt","/sitemap.xml","/images/lily.jpeg","/images/app-screenshots/ai-chat.png","/images/app-screenshots/checkin.png","/images/app-screenshots/dashboard.png","/images/app-screenshots/tools.png","/about/index.html","/privacy-policy/index.html","/terms-of-service/index.html","/thank-you/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"Hw3tbyE3FZrUyWaJTrvaK5EnxC/ouc0Kn6S7qFXSz5U=","sessionConfig":{"driver":"fs-lite","options":{"base":"/Users/lilystone/Documents/Amplifly Things/amplifly_site/node_modules/.astro/sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
