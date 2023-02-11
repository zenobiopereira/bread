// ==UserScript==
// @name        Bread
// @match       *://*/*
// @version     2.3.0
// @author      Toby (v1.0.5), ltGuillaume
// @license     MIT
// @description Bread (Bionic Reading) - Read text faster & easier
// @grant       GM_addStyle
// @grant       GM_getValue
// @run-at      document-start
// ==/UserScript==

/* source: https://github.com/tobyxdd/bread (v1.0.5) */
/* jshint esversion: 6 */

let minWordLength = GM_getValue('MinWordLength') || 4;    // Minimum word length
let minTextLength = GM_getValue('MinTextLength') || 20;   // Minimum text length
let boldRatio     = GM_getValue('BoldRatio')	   || 0.4;  // Bold ratio (percentage of letters per word)
let processDyn    = GM_getValue('ProcessDyn')	   || true; // Process dynamically loaded content (may cause performance issues)
let breadNodes    = GM_getValue('BreadNodes')    || {};   // Restrict bread to a specific node per domain (use a CSS query): {"domain": "#css_selector", ...}
let breadNode     = false;

function insertTextBefore(text, node, bold) {
	if (bold) {
		let span = document.createElement('span');
		span.className = 'bread';
		span.appendChild(document.createTextNode(text));

		node.parentNode.insertBefore(span, node);
	} else {
		node.parentNode.insertBefore(document.createTextNode(text), node);
	}
}

function processNode(base) {
	let walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, {
		acceptNode: function (node) {
			return (
				node.parentNode.nodeName !== 'INPUT' &&
				node.parentNode.nodeName !== 'NOSCRIPT' &&
				node.parentNode.nodeName !== 'SCRIPT' &&
				node.parentNode.nodeName !== 'STYLE' &&
				node.parentNode.nodeName !== 'TEXTAREA' &&
				node.parentNode.nodeName !== 'TITLE' &&
			 (node.parentNode.nodeName === 'A' ||
				node.parentNode.nodeName === 'EM' ||
				node.parentNode.nodeName === 'STRONG' ||
				node.nodeValue.length	 >= minTextLength)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
		}
	});

	let node;
	while (node = walker.nextNode()) {
		let text = node.nodeValue;
		let wStart = -1, wLen = 0, eng = null;

		for (let i = 0; i <= text.length; i++) {	// We use <= here because we want to include the last character in the loop
			let cEng = i < text.length ? /[\p{Letter}\p{Mark}]/u.test(text[i]) : false;

			if (i == text.length || eng !== cEng) {
				// State flipped or end of string
				if (eng && wLen >= minWordLength) {
					let word = text.substring(wStart, wStart + wLen);
					let numBold = Math.ceil(word.length * boldRatio);
					let bt = word.substring(0, numBold), nt = word.substring(numBold);
					insertTextBefore(bt, node, true);
					insertTextBefore(nt, node, false);
				} else if (wLen > 0) {
					let word = text.substring(wStart, wStart + wLen);
					insertTextBefore(word, node, false);
				}
				wStart = i;
				wLen = 1;
				eng = cEng;
			} else {
				wLen++;
			}
		}

		node.nodeValue = '';	// Can't remove the node (otherwise the tree walker will break) so just set it to empty
	}
}

window.addEventListener('load', function (event) {
	for (domain in breadNodes) {
		if (document.location.host.indexOf(domain) > -1) {
			breadNode = document.querySelector(breadNodes[domain]);
			break;
		}
	}
	processNode(breadNode || event.target);
	if (processDyn) {
		document.body.addEventListener('DOMNodeInserted', function (event) {
			if (!breadNode || breadNode.contains(event.target))
				processNode(event.target);
		}, false);
	}
}, false);

GM_addStyle(`
	span.bread {
		display: contents !important;
		font-weight: bolder;
	}
`);