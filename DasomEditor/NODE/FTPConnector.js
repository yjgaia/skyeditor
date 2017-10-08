DasomEditor.FTPConnector = CLASS({

	init : (inner, self, ftpInfo, handlers) => {
		//REQUIRED: ftpInfo
		//REQUIRED: ftpInfo.title
		//REQUIRED: ftpInfo.host
		//REQUIRED: ftpInfo.port
		//REQUIRED: ftpInfo.protocol
		//REQUIRED: ftpInfo.username
		//REQUIRED: ftpInfo.password
		//REQUIRED: ftpInfo.privateKey
		//REQUIRED: handlers
		//REQUIRED: handlers.error
		//REQUIRED: handlers.suceess
		
		let title = ftpInfo.title;
		let protocol = ftpInfo.protocol;
		
		let errorHandler = handlers.error;
		let callback = handlers.success;
		
		let ftp;
		
		if (protocol === 'sftp') {
			ftp = UFTP.SFTP(ftpInfo, {
				error : errorHandler,
				success : () => {
					callback();
				}
			});
		}
		
		else {
			ftp = UFTP.FTP(ftpInfo, {
				error : errorHandler,
				success : () => {
					callback();
				}
			});
		}
		
		let loadFiles = self.loadFiles = (path, handlers) => {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.findFolderNames(path, {
				error : () => {
					errorHandler();
				},
				success : (folderNames) => {
					
					ftp.findFileNames(path, {
						error : () => {
							errorHandler();
						},
						success : (fileNames) => {
							callback(folderNames, fileNames);
						}
					});
				}
			});
		};
		
		let load = self.load = (path, handlers) => {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.readFile(path, {
				error : () => {
					errorHandler();
				},
				success : (buffer) => {
					callback(buffer.toString());
				}
			});
		};
		
		let save = self.save = (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: params.path
			//REQUIRED: params.content
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let path = params.path;
			let content = params.content;
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.writeFile({
				path : path,
				content : content
			}, {
				error : () => {
					errorHandler();
				},
				success : (buffer) => {
					callback();
				}
			});
		};
		
		let disconnect = self.disconnect = () => {
			ftp.disconnect();
		};
	}
});