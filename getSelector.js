// getSelector.js (c) 2011, Lim Chee Aun. Licensed under the MIT license.

var getSelector = (function(d){
	
	if (!d.querySelector) return function(){};
	
	// https://github.com/mathiasbynens/mothereffingcssescapes
	function cssEscape(str) {
		var firstChar = str.charAt(0),
		    result = '';
		if (/^-+$/.test(str)){
			return '\\-' + str.slice(1);
		}
		if (/\d/.test(firstChar)){
			result = '\\3' + firstChar + ' ';
			str = str.slice(1);
		}
		result += str.split('').map(function(chr){
			if (/[\t\n\v\f]/.test(chr)){
				return '\\' + chr.charCodeAt().toString(16) + ' ';
			}
			return (/[ !"#$%&'()*+,./:;<=>?@\[\\\]^_`{|}~]/.test(chr) ? '\\' : '') + chr;
		}).join('');
		return result;
	}
	
	function qsm(str, el){ // querySelector match
		return d.querySelector(str) === el;
	};
	
	return function(el){
		if (!el) return;
		if (d !== el.ownerDocument) d = el.ownerDocument;
		var originalEl = el,
			selector = '';
		
		do {
			var tagName = el.tagName;
			if (!tagName || /html|body|head/i.test(tagName)) return '';
			tagName = tagName.toLowerCase();
			
			var id = el.id,
				className = el.className.trim(),
				classList = el.classList || className.split(/\s+/);
			
			// Select the ID, which is supposed to be unique.
			// If there are multiple elements with the same ID, only first will be selected.
			if (id){
				id = cssEscape(id);
				var s = '#' + id + selector;
				if (qsm(s, originalEl)) return s;
				s = tagName + "[id='" + id + "']" + selector;
				if (qsm(s, originalEl)) return s;
			}

			// If there's no ID or has multiple elements with same ID, select the className.
			// Some authors use "unique" classes, like IDs, so use it.
			// If one element contains multiple classes, choose the least popular class name.
			var uniqueClass;
			if (className){
				var uniqueClassCount = Infinity;
				for (var i=0, l=classList.length; i<l; i++){
					var c = classList[i],
						count = d.getElementsByClassName(c).length;
					if (count < uniqueClassCount){
						uniqueClassCount = count;
						uniqueClass = cssEscape(c);
					}
				}
				var s = tagName + '.' + uniqueClass + selector;
				if (qsm(s, originalEl)) return s;
				
				// If className can't work and the element has an ID, try combine both.
				// Eg: div[id*='id'].class
				if (id){
					s = tagName + "[id='" + id + "']." + uniqueClass + selector;
					if (qsm(s, originalEl)) return s;
				}
			}
			
			// If ID and className fails, try get something "unique" from the element
			switch (tagName){
				case 'a':
					var href = el.getAttribute('href'),
						s;
					// URL hash
					var hash = el.hash;
					if (hash){
						s = tagName + "[href='" + hash + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					// URL filename
					var pathname = el.pathname || '',
						filename = (pathname.match(/\/([^\/]+\.[^\/\.]+)$/i) || [, ''])[1];
					if (filename){
						s = tagName + "[href*='" + filename + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					// URL hostname
					var hostname = el.hostname;
					if (hostname){
						s = tagName + "[href*='" + hostname + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					// "short" URL pathname, ignore the longer ones (50 chars max)
					if (pathname && pathname.length <= 50){
						s = tagName + "[href*='" + pathname + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					break;
				case 'img':
					var src = el.getAttribute('src'),
						pathname = (function(src){
							var a = d.createElement('a');
							a.href = src;
							var pathname = a.pathname;
							a = null;
							return pathname;
						})(src),
						filename = (pathname.match(/\/([^\/]+\.[^\/\.]+)$/i) || [, ''])[1];
					if (filename){
						var s = tagName + "[src*='" + filename + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					break;
				case 'input':
				case 'button':
				case 'select':
				case 'textarea':
					var name = el.getAttribute('name');
					if (name){
						var s = tagName + "[name='" + name + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					break;
				case 'label':
					var _for = el.getAttribute('for');
					if (_for){
						var s = tagName + "[for='" + _for + "']" + selector;
						if (qsm(s, originalEl)) return s;
					}
					break;
			}

			// Select the nth-child if all above fails.
			var siblings = el.parentNode.children,
				siblingsLength = siblings.length,
				index = 0,
				theOnlyType = true;
			for (var i=0, l=siblings.length; i<l; i++){
				var sibling = siblings[i];
				if (sibling === el){
					index = i+1;
				} else if (sibling.tagName.toLowerCase() == tagName){
					theOnlyType = false;
				}
			}
			// See if the there are siblings and if there's not only one "type" (tagName) that's the same as selected element.
			// Eg: <a><b><c> = only one type; <a><b><b><c><b> = three types
			// Also, intelligently use first-child or last-child.
			if (siblingsLength>1 && !theOnlyType){
				var pseudoChild;
				if (index == 1){
					pseudoChild = ':first-child';
				} else if (index == siblingsLength){
					pseudoChild = ':last-child';
				} else {
					pseudoChild = ':nth-child(' + index + ')';
				}
				selector = tagName + pseudoChild + selector;
				if (qsm(selector, originalEl)) return selector;
			} else { // Last step, clean up before traversing to the parent level
				if (id){
					selector = tagName + "[id='" + id + "']" + selector;
				} else if (uniqueClass){
					selector = tagName + '.' + uniqueClass + selector;
				} else {
					selector = tagName + selector;
					if (qsm(selector, originalEl)) return selector;
				}
			}
		} while((el = el.parentNode) && (selector = '>' + selector));
		
		return selector;
	};
	
})(document);