getSelector.js
==============

getSelector.js provides a simple function to get the **shortest possible** CSS selector path of an element.

Example
-------

Here's some HTML:

	<!DOCTYPE html>
	<div id="container">
		<ul>
			<li>1</li>
			<li>2</li><!-- second 'li' here -->
			<li>3</li>
		</ul>
	</div>

... and for some reason, your JavaScript code has a variable reference to the second `<li>` tag (let's call it the `el` variable). You can get the CSS selector path to it by calling the `getSelector` function:

	getSelector(el); // Returns "li:nth-child(2)"

It's that simple.

Supported & Tested Browsers
-----------------------------

getSelector.js should work on browsers that support [`querySelector`](https://developer.mozilla.org/En/DOM/Document.querySelector), [`getElementsByClassName`](https://developer.mozilla.org/en/DOM/document.getElementsByClassName) and [`String.trim`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim), which *probably* includes:

- Chrome 4+
- Firefox 3.5+
- Internet Explorer 9+
- Opera 10.5+
- Safari 5+

**But**, currently it's only tested on:

- Chrome 14+
- Firefox 7+

License
-------

Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).