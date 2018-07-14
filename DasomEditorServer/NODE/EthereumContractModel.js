OVERRIDE(DasomEditorServer.EthereumContractModel, (origin) => {
	
	DasomEditorServer.EthereumContractModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let Solc = require('solc');
			
			DasomEditorServer.ROOM(self.getName(), (clientInfo, on, off, send, broadcastExceptMe) => {
				
				// Solidity 코드를 컴파일합니다.
				on('compileSolidityCode', (params, ret) => {
					
					let code = params.code;
					let importCodes = params.importCodes;
					
					ret(Solc.compile({
						sources : {
							code : code
						}
					}, 1, (path) => {
						return importCodes === undefined || importCodes[path] === undefined ? {} : {
							contents : importCodes[path]
						};
					}));
				});
			});
		}
	});
});
