require('uppercase-core');

RUN(() => {
	
	let Path = require('path');
	
	let rootPath = __dirname;
	
	let boxNamesInBOXFolder = [];
	
	let checkIsAllowedFolderName = (name) => {

		return (

			// BOX folder
			name !== 'BOX' &&

			// node.js module
			name !== 'node_modules' &&

			// not load
			name !== '__NOT_LOAD' &&

			// deprecated
			name !== '__OLD'
		);
	};
	
	// create UPPERCASE box.
	BOX('UPPERCASE');
	
	// init boxes in root folder.
	FIND_FOLDER_NAMES({
		path : rootPath,
		isSync : true
	}, (folderNames) => {

		EACH(folderNames, (folderName) => {

			if (checkIsAllowedFolderName(folderName) === true) {

				// create box.
				BOX(folderName);
			}
		});
	});

	if (CHECK_FILE_EXISTS({
		path : rootPath + '/BOX',
		isSync : true
	}) === true) {

		// init boxes is BOX folder.
		FIND_FOLDER_NAMES({
			path : rootPath + '/BOX',
			isSync : true
		}, (folderNames) => {

			EACH(folderNames, (folderName) => {

				if (checkIsAllowedFolderName(folderName) === true) {

					// create box.
					BOX(folderName);
					
					// save box name.
					boxNamesInBOXFolder.push(folderName);
				}
			});
		});
	}
	
	let scanAllBoxFolders = (folderName) => {

		let scanFolder = (folderPath, boxName) => {

			FIND_FILE_NAMES({
				path : folderPath,
				isSync : true
			}, {

				notExists : () => {
					// ignore.
				},

				success : (fileNames) => {

					EACH(fileNames, (fileName) => {

						let fullPath = folderPath + '/' + fileName;
						
						let extname = Path.extname(fileName).toLowerCase();

						if (extname === '.js') {
							require(fullPath, boxName);
						}
					});
				}
			});

			FIND_FOLDER_NAMES({
				path : folderPath,
				isSync : true
			}, {

				notExists : () => {
					// ignore.
				},

				success : (folderNames) => {

					EACH(folderNames, (folderName) => {
						if (checkIsAllowedFolderName(folderName) === true) {
							scanFolder(folderPath + '/' + folderName, boxName);
						}
					});
				}
			});
		};

		FOR_BOX((box) => {

			let boxRootPath = CHECK_IS_IN({
				array : boxNamesInBOXFolder,
				value : box.boxName
			}) === true ? rootPath + '/BOX' : rootPath;

			scanFolder(boxRootPath + '/' + box.boxName + '/' + folderName, box.boxName);
		});
	};
	
	scanAllBoxFolders('COMMON');
	scanAllBoxFolders('BROWSER');
	
	FOR_BOX((box) => {
		
		let boxRootPath = CHECK_IS_IN({
			array : boxNamesInBOXFolder,
			value : box.boxName
		}) === true ? rootPath + '/BOX' : rootPath;
		
		FIND_FILE_NAMES({
			path : boxRootPath + '/' + box.boxName,
			isSync : true
		}, {

			notExists : () => {
				// ignore.
			},

			success : (fileNames) => {

				EACH(fileNames, (fileName) => {

					let fullPath = boxRootPath + '/' + box.boxName + '/' + fileName;
					
					let extname = Path.extname(fileName).toLowerCase();

					if (fileName === 'BROWSER' + extname) {
						if (extname === '.js') {
							require(fullPath, box.boxName);
						}
					}
				});
			}
		});
	});
});
