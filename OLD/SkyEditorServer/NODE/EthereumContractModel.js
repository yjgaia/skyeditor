OVERRIDE(SkyEditorServer.EthereumContractModel, (origin) => {
	
	SkyEditorServer.EthereumContractModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let Solc = require('solc');
			
			let contractInfosDB = SkyEditorServer.DB({
				name : 'ContractInfos',
				isNotUsingObjectId : true
			});
			
			SkyEditorServer.ROOM(self.getName(), (clientInfo, on, off, send, broadcastExceptMe) => {
				
				// Solidity 코드를 컴파일합니다.
				on('compileSolidityCode', (params, ret) => {
					
					let fileName = params.fileName;
					let code = params.code;
					let importCodes = params.importCodes;
					
					let sources = {};
					sources[fileName] = {
						content : code
					};
					
					ret(JSON.parse(Solc.compile(JSON.stringify({
						language: 'Solidity',
						sources : sources,
						settings : {
							outputSelection : {
								'*' : {
									'*' : [ '*' ]
								}
							}
						}
					}), {
						import : (path) => {
							return importCodes === undefined || importCodes[path] === undefined ? {} : {
								contents : importCodes[path]
							};
						}
					})));
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
