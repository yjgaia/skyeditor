OVERRIDE(DasomEditorServer.EthereumContractModel, (origin) => {
	
	DasomEditorServer.EthereumContractModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let room = self.getRoom();
			
				// Solidity 코드를 컴파일합니다.
			let compileSolidityCode = self.compileSolidityCode = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.code
				//REQUIRED: params.importCodes
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'compileSolidityCode',
					data : params
				}, (result) => {
					if (result.errors !== undefined) {
						errorHandler(result.errors[0]);
					} else {
						callback(result.contracts);
					}
				});
			};
		}
	});
});
