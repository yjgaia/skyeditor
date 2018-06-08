Module = {};
importScripts('https://ethereum.github.io/solc-bin/bin/soljson-v0.4.6+commit.2dabbdf0.js', 'solc-wrapper.js');
solc = solcWrapper(Module);

self.onmessage = (e) => {
	postMessage(solc.compile(e.data, 1));
};