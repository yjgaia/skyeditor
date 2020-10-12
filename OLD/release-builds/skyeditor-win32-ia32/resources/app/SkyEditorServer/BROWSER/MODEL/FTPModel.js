OVERRIDE(SkyEditorServer.FTPModel, (origin) => {
	
	SkyEditorServer.FTPModel = OBJECT({

		preset : () => {
			return origin;
		},

		init : (inner, self) => {
			
			let room = self.getRoom();
			
			// FTP에 연결합니다.
			let connect = self.connect = (ftpInfo, handlers) => {
				//REQUIRED: ftpInfo
				//REQUIRED: ftpInfo.title
				//REQUIRED: ftpInfo.host
				//REQUIRED: ftpInfo.port
				//REQUIRED: ftpInfo.protocol
				//REQUIRED: ftpInfo.username
				//OPTIONAL: ftpInfo.password
				//OPTIONAL: ftpInfo.privateKey
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'connect',
					data : ftpInfo
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP로부터 파일 목록을 가져옵니다.
			let loadFiles = self.loadFiles = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'loadFiles',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback(result.folderNames, result.fileNames);
					}
				});
			};
			
			// FTP로부터 파일의 내용을 불러옵니다.
			let loadFile = self.loadFile = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'loadFile',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback(result.content);
					}
				});
			};
			
			// FTP로부터 파일의 정보를 가져옵니다.
			let getFileInfo = self.getFileInfo = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'getFileInfo',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback(result.info);
					}
				});
			};
			
			// FTP에 파일이 존재하는지 확인합니다.
			let checkFileExists = self.checkFileExists = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'checkFileExists',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback(result.exists);
					}
				});
			};
			
			// FTP에 파일을 저장합니다.
			let saveFile = self.saveFile = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: params.content
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'saveFile',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP에 폴더를 생성합니다.
			let createFolder = self.createFolder = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'createFolder',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP에서 파일을 이동합니다.
			let moveFile = self.moveFile = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.fromFTPInfo
				//REQUIRED: params.toFTPInfo
				//REQUIRED: params.from
				//REQUIRED: params.to
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'moveFile',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP에서 파일을 복사합니다.
			let cloneFile = self.cloneFile = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.fromFTPInfo
				//REQUIRED: params.toFTPInfo
				//REQUIRED: params.from
				//REQUIRED: params.to
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'cloneFile',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP에서 파일을 삭제합니다.
			let removeFile = self.removeFile = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'removeFile',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback();
					}
				});
			};
			
			// FTP에서 폴더인지 확인합니다.
			let checkIsFolder = self.checkIsFolder = (params, handlers) => {
				//REQUIRED: params
				//REQUIRED: params.ftpInfo
				//REQUIRED: params.path
				//REQUIRED: handlers
				//REQUIRED: handlers.error
				//REQUIRED: handlers.success
				
				let errorHandler = handlers.error;
				let callback = handlers.success;
				
				room.send({
					methodName : 'checkIsFolder',
					data : params
				}, (result) => {
					if (result.errorMsg !== undefined) {
						errorHandler(result.errorMsg);
					} else {
						callback(result.isFolder);
					}
				});
			};
		}
	});
});
