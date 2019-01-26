/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
!function(e,t){var n=t.define,r=t.require,o="function"==typeof n&&n.amd,i=!o&&"undefined"!=typeof exports;if(!o&&!n){var a={};n=t.define=function(e,t,n){"function"==typeof n?(a[e]={factory:n,deps:t.map(function(t){return function(e,t){if("."!==e[0])return e;var n=t.split("/"),r=e.split("/");n.pop();for(var o=0;o<r.length;o++)"."!=r[o]&&(".."==r[o]?n.pop():n.push(r[o]));return n.join("/")}(t,e)}),exports:null},r(e)):a[e]=n},r=t.require=function(e){if(!a.hasOwnProperty(e))throw new Error("Module "+e+" has not been defined");var n=a[e];if(!n.exports){var o=[];n.deps.forEach(function(e){o.push(r(e))}),n.exports=n.factory.apply(t,o)}return n.exports}}if(!n)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(e,t){e("skylark-langx/types",[],function(){var e,t={}.toString,n=(e={},"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(t){e["[object "+t+"]"]=t.toLowerCase()}),function(n){return null==n?String(n):e[t.call(n)]||"object"});function r(e){var t;for(t in e)if(null!==e[t])return!1;return!0}function o(e){return"function"==n(e)}function i(e){return e&&e instanceof Node}function a(e){return"object"==n(e)}function u(e){return"string"==typeof e}function l(e){return e&&e==e.window}return{isArray:function(e){return e&&e.constructor===Array},isArrayLike:function(e){return!u(e)&&!i(e)&&"number"==typeof e.length&&!o(e)},isBoolean:function(e){return"boolean"==typeof e},isDefined:function(e){return void 0!==e},isDocument:function(e){return null!=e&&e.nodeType==e.DOCUMENT_NODE},isEmpty:r,isEmptyObject:r,isFunction:o,isHtmlNode:i,isNull:function(e){return"null"===n(e)},isNumber:function(e){return"number"==typeof e},isObject:a,isPlainObject:function(e){return a(e)&&!l(e)&&Object.getPrototypeOf(e)==Object.prototype},isString:u,isSameOrigin:function(e){if(e){var t=location.protocol+"//"+location.hostname;return location.port&&(t+=":"+location.port),e.startsWith(t)}},isSymbol:function(e){return"symbol"==typeof e||isObjectLike(e)&&objectToString.call(e)==symbolTag},isUndefined:function(e){return void 0===e},isWindow:l,type:n}}),e("skylark-langx/arrays",["./types"],function(e,t){var n=Array.prototype.filter,r=e.isArrayLike;function o(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}function i(e){return e!=e}function a(e){if(r(e)){for(var t=[],n=0;n<e.length;n++){var o=e[n];if(r(o))for(var i=0;i<o.length;i++)t.push(o[i]);else t.push(o)}return t}return e}return{baseFindIndex:o,baseIndexOf:function(e,t,n){if(t!=t)return o(e,i,n);var r=n-1,a=e.length;for(;++r<a;)if(e[r]===t)return r;return-1},compact:function(e){return n.call(e,function(e){return null!=e})},first:function(e,t){return t?e.slice(0,t):e[0]},flatten:a,inArray:function(e,t){if(!t)return-1;var n;if(t.indexOf)return t.indexOf(e);n=t.length;for(;n--;)if(t[n]===e)return n;return-1},makeArray:function(e,t,n){if(r(e))return(n||[]).concat(Array.prototype.slice.call(e,t||0));return[e]},map:function(e,t){var n,o,i,u=[];if(r(e))for(o=0;o<e.length;o++)null!=(n=t.call(e[o],e[o],o))&&u.push(n);else for(i in e)null!=(n=t.call(e[i],e[i],i))&&u.push(n);return a(u)},uniq:function(e){return n.call(e,function(t,n){return e.indexOf(t)==n})}}}),e("skylark-langx/hoster",[],function(){var e={isBrowser:!0,isNode:null,global:this,browser:null,node:null};"object"==typeof process&&process.versions&&process.versions.node&&process.versions.v8&&(e.isNode=!0,e.isBrowser=!1),e.global=function(){return"undefined"!=typeof global&&"function"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:this}();var n=null;return Object.defineProperty(e,"document",function(){if(!n){var e="undefined"==typeof window?t("html-element"):window;n=e.document}return n}),e}),e("skylark-langx/skylark",[],function(){return{}}),e("skylark-tangular/hyperscript",["skylark-langx/skylark"],function(e){return e.hyperscript={}}),e("skylark-tangular/h",["skylark-langx/types","skylark-langx/arrays","skylark-langx/hoster","./hyperscript"],function(e,t,n,r){var o=e.isArray,i=e.isHtmlNode,a=t.forEach,u=n.document,l=w.Text,f=function(e,t){return e.split(t)},s=function(e,t){e.classList.add(t)};function c(){var e=[];function t(){var t=[].slice.call(arguments),n=null;function r(t){var c;if(null==t);else if("string"==typeof t)n?n.appendChild(c=u.createTextNode(t)):function(e){var t=f(e,/([\.#]?[^\s#.]+)/);/^\.|#/.test(t[1])&&(n=u.createElement("div"));a(t,function(e){var t=e.substring(1,e.length);e&&(n?"."===e[0]?s(n,t):"#"===e[0]&&n.setAttribute("id",t):n=u.createElement(e))})}(t);else if("number"==typeof t||"boolean"==typeof t||t instanceof Date||t instanceof RegExp)n.appendChild(c=u.createTextNode(t.toString()));else if(o(t))a(t,r);else if(i(t))n.appendChild(c=t);else if(t instanceof l)n.appendChild(c=t);else if("object"==typeof t)for(var p in t)if("function"==typeof t[p])/^on\w+/.test(p)?function(t,r){n.addEventListener?(n.addEventListener(t.substring(2),r[t],!1),e.push(function(){n.removeEventListener(t.substring(2),r[t],!1)})):(n.attachEvent(t,r[t]),e.push(function(){n.detachEvent(t,r[t])}))}(p,t):(n[p]=t[p](),e.push(t[p](function(e){n[p]=e})));else if("style"===p)if("string"==typeof t[p])n.style.cssText=t[p];else for(var d in t[p])!function(r,o){if("function"==typeof o)n.style.setProperty(r,o()),e.push(o(function(e){n.style.setProperty(r,e)}));else var i=t[p][r].match(/(.*)\W+!important\W*$/);i?n.style.setProperty(r,i[1],"important"):n.style.setProperty(r,t[p][r])}(d,t[p][d]);else if("attrs"===p)for(var y in t[p])n.setAttribute(y,t[p][y]);else"data-"===p.substr(0,5)?n.setAttribute(p,t[p]):n[p]=t[p];else if("function"==typeof t){var y=t();n.appendChild(c=i(y)?y:u.createTextNode(y)),e.push(t(function(e){i(e)&&c.parentElement?(c.parentElement.replaceChild(e,c),c=e):c.textContent=e}))}return c}for(;t.length;)r(t.shift());return n}return t.cleanup=function(){for(var t=0;t<e.length;t++)e[t]();e.length=0},t}var p=c();return p.context=c,r.h=p}),e("skylark-tangular/tags",["./hyperscript","./h"],function(e,t){function n(e){return function(e){return"string"==typeof e&&e.length>0}(e)&&("."===e[0]||"#"===e[0])}function r(e){return function(r,o,i){var a=void 0!==r,u=void 0!==o,l=void 0!==i;return n(r)?u&&l?t(e+r,o,i):t(e+r,u?o:{}):l?t(e+r,o,i):u?t(e,r,o):t(e,a?r:{})}}var o=["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","colorProfile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotlight","feTile","feTurbulence","filter","font","fontFace","fontFaceFormat","fontFaceName","fontFaceSrc","fontFaceUri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missingGlyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","script","set","stop","style","switch","symbol","text","textPath","title","tref","tspan","use","view","vkern"],i=r("svg");o.forEach(function(e){i[e]=r(e)});var a=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","dd","del","dfn","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","meta","nav","noscript","object","ol","optgroup","option","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","u","ul","video"],u={SVG_TAG_NAMES:o,TAG_NAMES:a,svg:i,isSelector:n,createTagFunction:r};return a.forEach(function(e){u[e]=r(e)}),e.tags=u}),e("skylark-tangular/main",["./h","./tags"],function(e){return e}),e("skylark-tangular",["skylark-tangular/main"],function(e){return e})}(n,r),!o){var u=r("skylark-langx/skylark");i?module.exports=u:t.skylarkjs=u}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-tangular-all.js.map