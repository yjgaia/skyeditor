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
		});
	}
});
