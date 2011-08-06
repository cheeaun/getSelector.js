describe('getSelector', function(){
	
	var iframe = document.createElement('iframe');
	iframe.style.position = 'absolute';
	iframe.style.top = '-999px';
	iframe.style.left = '-999px';
	
	beforeEach(function(){
		if (!iframe.contentDocument){
			document.body.appendChild(iframe);
			var d = iframe.contentDocument;
			d.open();
			d.write('<!DOCTYPE html><body></body>');
			d.close();
		}
	});
	
	// A custom attribute 'selectthis' is added to the element to be selected.
	
	var tests = [
		{
			it: 'should get the ID',
			selector: '#test',
			html: '<div id="test" selectthis></div>'
		},
		{
			it: 'should get the ID with tag name when there are multiple same IDs',
			selector: "div[id='test']",
			html: '<p id="test"></p><div id="test" selectthis></div>'
		},
		{
			it: 'should get the class',
			selector: 'div.test',
			html: '<div class="test" selectthis></div>'
		},
		{
			it: 'should get the first div element',
			selector: 'div:first-child',
			html: '<div selectthis></div><div></div><div></div>'
		},
		{
			it: 'should get the last div element',
			selector: 'div:last-child',
			html: '<div></div><div></div><div selectthis></div>'
		},
		{
			it: 'should get the second div element',
			selector: 'div:nth-child(2)',
			html: '<div></div><div selectthis></div><div></div>'
		},
		{
			it: 'should ignore multiple same IDs and get the second div element',
			selector: 'div:nth-child(2)',
			html: '<div id="test"></div><div id="test" selectthis></div><div id="test"></div>'
		},
		{
			it: 'should ignore multiple same classes and get the second div element',
			selector: 'div:nth-child(2)',
			html: '<div class="test"></div><div class="test" selectthis></div><div class="test"></div>'
		},
		{
			it: 'should get the ID and class together if element has both',
			selector: "div[id='test'].test",
			html: '<div id="test"></div><div class="test"></div><div id="test" class="test" selectthis></div>'
		},
		{
			it: 'should traverse and get the child div',
			selector: 'div>div',
			html: '<div><div selectthis></div></div>'
		},
		{
			it: 'should get the unique (least popular) class',
			selector: 'div.b',
			html: '<div class="a"></div><div class="a b c" selectthis></div><div class="c"></div>'
		},
		{
			it: 'should get the a element "href" with hash',
			selector: "a[href='#test']",
			html: '<a href="#test" selectthis></a>'
		},
		{
			it: 'should get the a element "href" with file name',
			selector: "a[href*='test.html']",
			html: '<a href="http://test.com/test.html?test=1" selectthis></a>'
		},
		{
			it: 'should get the a element "href" with hostname',
			selector: "a[href*='test.com']",
			html: '<a href="http://test.com/test1/test2?test=1" selectthis></a>'
		},
		{
			it: 'should get the a element "href" with pathname',
			selector: "a[href*='/test1/test2']",
			html: '<a href="http://test.com/"></a><a href="http://test.com/test1/test2" selectthis></a>'
		},
		{
			it: 'should get the img element "src" with filename',
			selector: "img[src*='test.png']",
			html: '<img src="http://test.com/test.png?test=1" selectthis>'
		},
		{
			it: 'should get the input element with "name"',
			selector: "input[name='test']",
			html: '<input name="test" selectthis>'
		},
		{
			it: 'should get the button element with "name"',
			selector: "button[name='test']",
			html: '<button name="test" selectthis></button>'
		},
		{
			it: 'should get the select element with "name"',
			selector: "select[name='test']",
			html: '<select name="test" selectthis></select>'
		},
		{
			it: 'should get the textarea element with "name"',
			selector: "textarea[name='test']",
			html: '<textarea name="test" selectthis></textarea>'
		},
		{
			it: 'should get the label element with "for"',
			selector: "label[for='test']",
			html: '<label for="test" selectthis></label>'
		}
	];
	
	tests.forEach(function(test){
		var selector = test.selector;
		it(test.it + ' - ' + selector, function(){
			var d = iframe.contentDocument;
			d.body.innerHTML = test.html;
			expect(getSelector(d.querySelector('[selectthis]'))).toEqual(selector);
		});
	});
	
});