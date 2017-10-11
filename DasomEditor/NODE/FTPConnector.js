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
				success : callback
			});
		}
		
		else {
			ftp = UFTP.FTP(ftpInfo, {
				error : errorHandler,
				success : callback
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
						error : errorHandler,
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
				error : errorHandler,
				success : (buffer) => {
					callback(buffer.toString());
				}
			});
		};
		
		let getInfo = self.getInfo = (path, handlers) => {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.getFileInfo(path, {
				error : errorHandler,
				success : callback
			});
		};
		
		let save = self.save = (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: params.path
			//OPTIONAL: params.content
			//OPTIONAL: params.buffer
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let path = params.path;
			let content = params.content;
			let buffer = params.buffer;
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.writeFile({
				path : path,
				content : content,
				buffer : buffer
			}, {
				error : errorHandler,
				success : callback
			});
		};
		
		let move = self.move = (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: params.from
			//REQUIRED: params.to
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let from = params.from;
			let to = params.to;
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.moveFile({
				from : from,
				to : to
			}, {
				error : errorHandler,
				success : callback
			});
		};
		
		let remove = self.remove = (path, handlers) => {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.removeFile(path, {
				error : errorHandler,
				success : callback
			});
		};
		
		let checkExists = self.checkExists = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			ftp.checkFileExists(path, callback);
		};
		
		let checkIsFolder = self.checkIsFolder = (path, handlers) => {
			//REQUIRED: path
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.checkIsFolder(path, {
				error : errorHandler,
				success : callback
			});
		};
		
		let copyFolder = self.copyFolder = (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: params.from
			//REQUIRED: params.to
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let from = params.from;
			let to = params.to;
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.copyFolder({
				from : from,
				to : to
			}, {
				error : errorHandler,
				success : callback
			});
		};
		
		let copyFile = self.copyFile = (params, handlers) => {
			//REQUIRED: params
			//REQUIRED: params.from
			//REQUIRED: params.to
			//REQUIRED: handlers
			//REQUIRED: handlers.error
			//REQUIRED: handlers.suceess
			
			let from = params.from;
			let to = params.to;
			
			let errorHandler = handlers.error;
			let callback = handlers.success;
			
			ftp.copyFile({
				from : from,
				to : to
			}, {
				error : errorHandler,
				success : callback
			});
		};
		
		let disconnect = self.disconnect = () => {
			ftp.disconnect();
		};
	}
});