/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
define(["./hyperscript","./h"],function(e,t){function a(e){return function(e){return"string"==typeof e&&e.length>0}(e)&&("."===e[0]||"#"===e[0])}function r(e){return function(r,o,i){var n=void 0!==r,f=void 0!==o,l=void 0!==i;return a(r)?f&&l?t(e+r,o,i):t(e+r,f?o:{}):l?t(e+r,o,i):f?t(e,r,o):t(e,n?r:{})}}var o=["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","colorProfile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotlight","feTile","feTurbulence","filter","font","fontFace","fontFaceFormat","fontFaceName","fontFaceSrc","fontFaceUri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missingGlyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","script","set","stop","style","switch","symbol","text","textPath","title","tref","tspan","use","view","vkern"],i=r("svg");o.forEach(function(e){i[e]=r(e)});var n=["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","dd","del","dfn","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","meta","nav","noscript","object","ol","optgroup","option","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","u","ul","video"],f={SVG_TAG_NAMES:o,TAG_NAMES:n,svg:i,isSelector:a,createTagFunction:r};return n.forEach(function(e){f[e]=r(e)}),e.tags=f});
//# sourceMappingURL=sourcemaps/tags.js.map