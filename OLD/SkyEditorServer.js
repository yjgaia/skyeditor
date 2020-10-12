require(process.env.UPPERCASE_PATH + '/node.index.js');

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
			workspacePath : '../',
			password : 'test123'
		}
	}
});
