DasomEditor.FTPConnector = CLASS({

	init : (inner, self, info, callback) => {
		//REQUIRED: info
		//REQUIRED: info.title
		//REQUIRED: info.host
		//REQUIRED: info.port
		//REQUIRED: info.protocol
		//REQUIRED: info.username
		//REQUIRED: info.password
		//REQUIRED: info.privateKey
		//REQUIRED: callback
		
		let title = info.title;
		let protocol = info.protocol;
		let ftp;
		
		let loadingBar = SkyDesktop.LoadingBar('lime');
		
		let connectionErrorHandler = () => {
			
			loadingBar.done();
			
			SkyDesktop.Alert({
				msg : title + ' 접속에 실패하였습니다.'
			});
		};
		
		if (protocol === 'sftp') {
			ftp = UFTP.SFTP(info, {
				error : connectionErrorHandler,
				success : () => {
					loadingBar.done();
					callback();
				}
			});
		}
		
		else {
			ftp = UFTP.FTP(info, {
				error : connectionErrorHandler,
				success : () => {
					loadingBar.done();
					callback();
				}
			});
		}
		
		let loadErrorHandler = (path) => {
			
			SkyDesktop.Alert({
				msg : path + '를 불러오는데 실패하였습니다.'
			});
		};
		
		let loadFiles = self.loadFiles = (path, callback) => {
			
			let loadingBar = SkyDesktop.LoadingBar('lime');
			
			ftp.findFolderNames(path, {
				error : () => {
					loadingBar.done();
					loadErrorHandler();
				},
				success : (folderNames) => {
					
					ftp.findFileNames(path, {
						error : () => {
							loadingBar.done();
							loadErrorHandler();
						},
						success : (fileNames) => {
							callback(folderNames, fileNames);
						}
					});
				}
			});
		};
		
		let disconnect = self.disconnect = () => {
			ftp.disconnect();
		};
	}
});