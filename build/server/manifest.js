const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","apple-touch-icon-precomposed.png","apple-touch-icon.png","favicon-kcu.png","favicon.png","fs-logo-kcu-large.png","fs-logo-kcu-small.png","fs-logo.svg","wallet-data.json"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DqE-SZt6.js",app:"_app/immutable/entry/app.BX0Kp3zW.js",imports:["_app/immutable/entry/start.DqE-SZt6.js","_app/immutable/chunks/CaZwOZBV.js","_app/immutable/chunks/BresNdZ7.js","_app/immutable/chunks/BNVOO-lP.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/Cs_YHDUa.js","_app/immutable/entry/app.BX0Kp3zW.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/DHOVcdmf.js","_app/immutable/chunks/BNVOO-lP.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CKDLqQ2C.js","_app/immutable/chunks/IvBMGwZF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BresNdZ7.js","_app/immutable/chunks/DNmx02vD.js","_app/immutable/chunks/VqvQOhvV.js","_app/immutable/chunks/U66Fon3e.js","_app/immutable/chunks/j9NDVOo8.js","_app/immutable/chunks/Cs_YHDUa.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./chunks/0-B2mmsu1r.js')),
			__memo(() => import('./chunks/1-D2TS44En.js')),
			__memo(() => import('./chunks/2-MRPYx6gN.js')),
			__memo(() => import('./chunks/3-B16cTOd4.js')),
			__memo(() => import('./chunks/4-CneQhVZu.js')),
			__memo(() => import('./chunks/5-DOHTtcHY.js')),
			__memo(() => import('./chunks/6-CWcY38o-.js')),
			__memo(() => import('./chunks/7-BwKxwJ6Q.js')),
			__memo(() => import('./chunks/8-wjordPRF.js')),
			__memo(() => import('./chunks/9-P2rR6AcX.js')),
			__memo(() => import('./chunks/10-BTbOLXgX.js')),
			__memo(() => import('./chunks/11-DjQ7wIsm.js')),
			__memo(() => import('./chunks/12-D3OJZqRD.js')),
			__memo(() => import('./chunks/13-ia1YvNys.js')),
			__memo(() => import('./chunks/14-lQCqZQPw.js')),
			__memo(() => import('./chunks/15-D_cX-nlg.js')),
			__memo(() => import('./chunks/16-CQGx4CpM.js')),
			__memo(() => import('./chunks/17-DDlhcCFB.js')),
			__memo(() => import('./chunks/18-CVEKWeH-.js')),
			__memo(() => import('./chunks/19-Cw6_EBLv.js')),
			__memo(() => import('./chunks/20-CeYvCc_k.js')),
			__memo(() => import('./chunks/21-DNraN264.js')),
			__memo(() => import('./chunks/22-CR-ukFNi.js')),
			__memo(() => import('./chunks/23-DIDAR1UX.js')),
			__memo(() => import('./chunks/24-DDoZcvT7.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/generate-pdf",
				pattern: /^\/api\/generate-pdf\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B-0yFinO.js'))
			},
			{
				id: "/api/image-proxy",
				pattern: /^\/api\/image-proxy\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D7nA-pzj.js'))
			},
			{
				id: "/cart",
				pattern: /^\/cart\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/gifted-card/[id]",
				pattern: /^\/gifted-card\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/marketplace",
				pattern: /^\/marketplace\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/marketplace/[id]",
				pattern: /^\/marketplace\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/order-history",
				pattern: /^\/order-history\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/order-history/[id]",
				pattern: /^\/order-history\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/privacy-policy",
				pattern: /^\/privacy-policy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/reset-password",
				pattern: /^\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/settings/account",
				pattern: /^\/settings\/account\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/settings/notifications",
				pattern: /^\/settings\/notifications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/signin",
				pattern: /^\/signin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/terms-of-service",
				pattern: /^\/terms-of-service\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/wallet/send-gift-card",
				pattern: /^\/wallet\/send-gift-card\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/wallet/transferred/[id]",
				pattern: /^\/wallet\/transferred\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/wallet/upload-card",
				pattern: /^\/wallet\/upload-card\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/wallet/upload-gift-card",
				pattern: /^\/wallet\/upload-gift-card\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/wallet/[id]",
				pattern: /^\/wallet\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
