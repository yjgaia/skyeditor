importScripts('UPPERCASE-CORE/WORKER_HELPER.js');

Module = {};
importScripts('https://ethereum.github.io/solc-bin/bin/soljson-v0.4.6+commit.2dabbdf0.js', 'solc-wrapper.js');
solc = solcWrapper(Module);

on('compile', (source) => {
	
	send({
		methodName : 'compiled',
		data : solc.compile(source, 1)
	});
});