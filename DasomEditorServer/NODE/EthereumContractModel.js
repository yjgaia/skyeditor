OVERRIDE(DasomEditorServer.EthereumContractModel, (origin) => {
	
	DasomEditorServer.EthereumContractModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let Solc = require('solc');
			
			let contractInfosDB = DasomEditorServer.DB({
				name : 'ContractInfos',
				isNotUsingObjectId : true
			});
			
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
				
				// 계약의 정보들을 저장합니다.
				on('saveContractInfos', (params, ret) => {
					
					let path = params.path;
					let contractInfos = params.contractInfos;
					
					contractInfosDB.create({
						id : path,
						contractInfosStr : STRINGIFY(contractInfos)
					});
				});
				
				// 계약의 정보들을 불러옵니다.
				on('getContractInfos', (path, ret) => {
					contractInfosDB.get(path, {
						notExists : () => {
							ret();
						},
						success : (data) => {
							ret(PARSE_STR(data.contractInfosStr));
						}
					});
				});
				
				// 계약의 정보들을 삭제합니다.
				on('removeContractInfos', (path, ret) => {
					contractInfosDB.remove(path, {
						notExists : () => {
							ret();
						},
						success : (data) => {
							ret();
						}
					});
				});
			});
		}
	});
});
