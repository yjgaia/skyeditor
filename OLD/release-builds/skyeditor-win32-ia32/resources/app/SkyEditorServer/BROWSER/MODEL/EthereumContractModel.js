OVERRIDE(SkyEditorServer.EthereumContractModel, (origin) => {
	
	SkyEditorServer.EthereumContractModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let room = self.getRoom();
			
			// Solidity 코드를 컴파일합니다.
			let compileSolidityCode = self.compileSolidityCode = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.fileName
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
						errorHandler('\n' + result.errors[0].formattedMessage);
					} else {
						callback(result.contracts);
					}
				});
			};
			
			// 계약의 정보들을 저장합니다.
			let saveContractInfos = self.saveContractInfos = (params) => {
				//REQUIRED: params
				//REQUIRED: params.path
				//REQUIRED: params.contractInfos
				
				room.send({
					methodName : 'saveContractInfos',
					data : params
				});
			};
			
			// 계약의 정보들을 불러옵니다.
			let getContractInfos = self.getContractInfos = (path, callback) => {
				//REQUIRED: path
				//REQUIRED: callback
				
				room.send({
					methodName : 'getContractInfos',
					data : path
				}, callback);
			};
			
			// 계약의 정보들을 삭제합니다.
			let removeContractInfos = self.removeContractInfos = (path, callback) => {
				//REQUIRED: path
				//REQUIRED: callback
				
				room.send({
					methodName : 'removeContractInfos',
					data : path
				}, callback);
			};
		}
	});
});
