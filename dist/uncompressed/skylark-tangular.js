/**
 * skylark-tangular - A version of tangular.js that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-tangular/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                exports: null
            };
            require(id);
        } else {
            map[id] = factory;
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.exports) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args);
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-tangular/hyperscript',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.hyperscript = {};
});
define('skylark-tangular/h',[
	"skylark-langx/types",
	"skylark-langx/arrays",
	"skylark-langx/hoster",
	"./hyperscript"
],function(types, arrays,hoster, hyperscript){
	var isArray = types.isArray,
		isNode = types.isHtmlNode,
		forEach = arrays.forEach,	
		document = hoster.document,
		Text = w.Text,
		split = function(s,arg) {
			return s.split(arg);
		},
		addClass = function(el,cls) {
			el.classList.add(cls);
		};

	function context () {

	  var cleanupFuncs = []

	  function h() {
	    var args = [].slice.call(arguments), e = null
	    function item (l) {
	      var r
	      function parseClass (string) {

	        var m = split(string, /([\.#]?[^\s#.]+)/)
	        if(/^\.|#/.test(m[1])) {
	          e = document.createElement('div');
	        }
	        forEach(m, function (v) {
	          var s = v.substring(1,v.length);
	          if(!v) {
	          	return ;
	          }
	          if(!e) {
	            e = document.createElement(v);
	          } else if (v[0] === '.') {
	            addClass(e,s);
	          } else if (v[0] === '#') {
	            e.setAttribute('id', s);
	          }
	        })
	      }

	      if(l == null) {
	        ;
	      } else if('string' === typeof l) {
	        if(!e) {
	          parseClass(l)
	        } else {
	          e.appendChild(r = document.createTextNode(l))
	        }
	      } else if('number' === typeof l
	        || 'boolean' === typeof l
	        || l instanceof Date
	        || l instanceof RegExp ) {
	          e.appendChild(r = document.createTextNode(l.toString()))
	      } else if (isArray(l)) {
	        forEach(l, item) ;
	      } else if(isNode(l)) {
	        e.appendChild(r = l)
	      } else if(l instanceof Text) {
	        e.appendChild(r = l)
	      } else if ('object' === typeof l) {
	        for (var k in l) {
	          if('function' === typeof l[k]) {
	            if(/^on\w+/.test(k)) {
	              (function (k, l) { // capture k, l in the closure
	                if (e.addEventListener){
	                  e.addEventListener(k.substring(2), l[k], false)
	                  cleanupFuncs.push(function(){
	                    e.removeEventListener(k.substring(2), l[k], false)
	                  })
	                }else{
	                  e.attachEvent(k, l[k])
	                  cleanupFuncs.push(function(){
	                    e.detachEvent(k, l[k])
	                  })
	                }
	              })(k, l)
	            } else {
	              // observable
	              e[k] = l[k]()
	              cleanupFuncs.push(l[k](function (v) {
	                e[k] = v
	              }))
	            }
	          }
	          else if(k === 'style') {
	            if('string' === typeof l[k]) {
	              e.style.cssText = l[k]
	            }else{
	              for (var s in l[k]) (function(s, v) {
	                if('function' === typeof v) {
	                  // observable
	                  e.style.setProperty(s, v())
	                  cleanupFuncs.push(v(function (val) {
	                    e.style.setProperty(s, val)
	                  }))
	                } else
	                  var match = l[k][s].match(/(.*)\W+!important\W*$/);
	                  if (match) {
	                    e.style.setProperty(s, match[1], 'important')
	                  } else {
	                    e.style.setProperty(s, l[k][s])
	                  }
	              })(s, l[k][s])
	            }
	          } else if(k === 'attrs') {
	            for (var v in l[k]) {
	              e.setAttribute(v, l[k][v])
	            }
	          } else if (k.substr(0, 5) === "data-") {
	            e.setAttribute(k, l[k])
	          } else {
	            e[k] = l[k]
	          }
	        }
	      } else if ('function' === typeof l) {
	        //assume it's an observable!
	        var v = l()
	        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

	        cleanupFuncs.push(l(function (v) {
	          if(isNode(v) && r.parentElement) {
	            r.parentElement.replaceChild(v, r), r = v
	          } else {
	            r.textContent = v ;
	          }
	        }))
	      }

	      return r
	    }
	    while(args.length) {
	      item(args.shift())
	    }

	    return e
	  }

	  h.cleanup = function () {
	    for (var i = 0; i < cleanupFuncs.length; i++){
	      cleanupFuncs[i]()
	    }
	    cleanupFuncs.length = 0
	  }

	  return h
	}

	var h =  context() ;
	h.context = context ;

	return hyperscript.h = h;

});
define('skylark-tangular/tags',[
	"./hyperscript",
	"./h"
],function(hyperscript, h) {

	function isValidString(param) {
	    return typeof param === 'string' && param.length > 0;
	}
	function isSelector(param) {
	    return isValidString(param) && (param[0] === '.' || param[0] === '#');
	}

	function createTagFunction(tagName) {
	    return function hyperscript(a, b, c) {
	        var hasA = typeof a !== 'undefined';
	        var hasB = typeof b !== 'undefined';
	        var hasC = typeof c !== 'undefined';
	        if (isSelector(a)) {
	            if (hasB && hasC) {
	                return h(tagName + a, b, c);
	            }
	            else if (hasB) {
	                return h(tagName + a, b);
	            }
	            else {
	                return h(tagName + a, {});
	            }
	        }
	        else if (hasC) {
	            return h(tagName + a, b, c);
	        }
	        else if (hasB) {
	            return h(tagName, a, b);
	        }
	        else if (hasA) {
	            return h(tagName, a);
	        }
	        else {
	            return h(tagName, {});
	        }
	    };
	}
	var SVG_TAG_NAMES = [
	    'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
	    'animateMotion', 'animateTransform', 'circle', 'clipPath', 'colorProfile',
	    'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
	    'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	    'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
	    'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
	    'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
	    'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'fontFace',
	    'fontFaceFormat', 'fontFaceName', 'fontFaceSrc', 'fontFaceUri',
	    'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
	    'linearGradient', 'marker', 'mask', 'metadata', 'missingGlyph', 'mpath',
	    'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script',
	    'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title',
	    'tref', 'tspan', 'use', 'view', 'vkern',
	];
	var svg = createTagFunction('svg');
	SVG_TAG_NAMES.forEach(function (tag) {
	    svg[tag] = createTagFunction(tag);
	});
	var TAG_NAMES = [
	    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
	    'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
	    'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl',
	    'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
	    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
	    'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
	    'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript',
	    'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q',
	    'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small',
	    'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td',
	    'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video',
	];
	var tags = { 
		SVG_TAG_NAMES: SVG_TAG_NAMES, 
		TAG_NAMES: TAG_NAMES, 
		svg: svg, 
		isSelector: isSelector, 
		createTagFunction: createTagFunction 
	};
	TAG_NAMES.forEach(function (n) {
	    tags[n] = createTagFunction(n);
	});

	return  hyperscript.tags = tags;
});
define('skylark-tangular/main',[
	"./h",
	"./tags"
],function(h){
	return h;
});
define('skylark-tangular', ['skylark-tangular/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-tangular.js.map
