importScripts('UPPERCASE-CORE/WORKER_HELPER.js');

Module = {};
importScripts('https://ethereum.github.io/solc-bin/bin/soljson-v0.4.6+commit.2dabbdf0.js', 'solc-wrapper.js');
solc = solcWrapper(Module);

on('compile', (params, ret) => {
	
	let code = params.code;
	let importCodes = params.importCodes;
	
	ret(solc.compile({
		sources : {
			code : code
		}
	}, 1, (path) => {
		return importCodes === undefined || importCodes[path] === undefined ? {} : {
			contents : importCodes[path]
		};
	}));
});