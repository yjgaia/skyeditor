require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		
		defaultBoxName : 'SkyEditorServer',
		
		title : 'Sky Editor',
		
		webServerPort : 8731
	},
	BROWSER_CONFIG : {
		SkyDesktop : {
			theme : 'dark'
		},
		SkyEditor : {
			homepage : 'http://skyeditor.hanul.co'
		}
	},
	NODE_CONFIG : {
		
		dbName : 'SkyEditorServer-test',
		
		SkyEditorServer : {
			workspacePath : './workspace',
			password : 'test123'
		}
	}
});
