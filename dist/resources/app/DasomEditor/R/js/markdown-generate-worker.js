window = self;

importScripts('marked.js');
importScripts('highlight.js');

// Synchronous highlighting with highlight.js
marked.setOptions({
	highlight : (code) => {
		return hljs.highlightAuto(code).value;
	}
});

self.addEventListener('message', (e) => {
	self.postMessage(marked(e.data));
}, false);