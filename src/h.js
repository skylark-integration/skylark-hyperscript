define([
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