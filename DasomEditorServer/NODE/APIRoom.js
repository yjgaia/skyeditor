DasomEditorServer.APIRoom = OBJECT({

	init : (inner, self) => {
		
		const FS = require('fs');
		
		let workspacePath = NODE_CONFIG.DasomEditorServer.workspacePath;
		
		DasomEditorServer.ROOM('API', (clientInfo, on, off, send, broadcastExceptMe) => {
			
			let isAuthed;
			
			// 인증하기
			on('auth', (password, ret) => {
				if (NODE_CONFIG.DasomEditorServer.password === password) {
					isAuthed = true;
					ret(true);
				} else {
					ret(false);
				}
			});
			
			// 파일 목록을 로드합니다.
			on('loadFiles', (path, ret) => {
				if (isAuthed === true && path !== undefined) {
					path = workspacePath + '/' + path;
					
					let folderNames = [];
					let fileNames = [];
					
					FS.readdir(path, (error, names) => {
						
						if (error !== TO_DELETE) {
							ret({
								errorMsg : error.toString()
							});
						} else {
							
							PARALLEL(names, [
							(name, done) => {
		
								if (name !== '.' && name !== '..' && name !== '.git') {
		
									FS.stat(path + '/' + name, (error, stats) => {
		
										if (error !== TO_DELETE) {
											ret({
												errorMsg : error.toString()
											});
										} else {
		
											if (stats.isDirectory() === true) {
												folderNames.push(name);
											} else {
												fileNames.push(name);
											}
		
											done();
										}
									});
		
								} else {
									done();
								}
							},
		
							() => {
								ret({
									folderNames : folderNames,
									fileNames : fileNames
								});
							}]);
						}
					});
				}
			});
			
			// 파일 내용을 불러옵니다.
			on('load', (path, ret) => {
				if (isAuthed === true && path !== undefined) {
					path = workspacePath + '/' + path;
					
					READ_FILE(path, {
						notExists : () => {
							ret({
								errorMsg : 'NOT EXISTS'
							});
						},
						error : (error) => {
							ret({
								errorMsg : error.toString()
							});
						},
						success : (buffer) => {
							ret({
								content : buffer.toString()
							});
						}
					});
				}
			});
			
			// 파일이 존재하는지 확인합니다.
			on('checkExists', (path, ret) => {
				if (isAuthed === true && path !== undefined) {
					path = workspacePath + '/' + path;
					
					CHECK_FILE_EXISTS(path, ret);
				}
			});
			
			// 파일의 정보를 가져옵니다.
			on('getInfo', (path, ret) => {
				if (isAuthed === true && path !== undefined) {
					path = workspacePath + '/' + path;
					
					GET_FILE_INFO(path, {
						notExists : () => {
							ret({
								errorMsg : 'NOT EXISTS'
							});
						},
						error : (error) => {
							ret({
								errorMsg : error.toString()
							});
						},
						success : (info) => {
							ret({
								info : info
							});
						}
					});
				}
			});
			
			// 파일의 내용을 저장합니다.
			on('save', (params, ret) => {
				if (isAuthed === true && params !== undefined && params.path !== undefined && params.content !== undefined) {
					let path = workspacePath + '/' + params.path;
					let content = params.content;
					
					WRITE_FILE({
						path : path,
						content : content
					}, {
						error : (error) => {
							ret({
								errorMsg : error.toString()
							});
						},
						success : () => {
							ret({});
						}
					});
				}
			});
		});
	}
});
