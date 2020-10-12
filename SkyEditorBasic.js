require(process.env.UPPERCASE_PATH + '/node.index.js');

BOOT({
	CONFIG: {
		isDevMode: true,
		defaultBoxName: 'SkyEditorBasic',
		title: 'Sky Editor',
		webServerPort: 8731
	},
	BROWSER_CONFIG: {
		SkyDesktop: {
			theme: 'dark'
		},
		SkyEditor: {
			homepage: 'http://skyeditor.hanul.co'
		}
	},
	NODE_CONFIG: {
		dbName: 'SkyEditorBasic',
		SkyEditor: {
			workspacePath: '../../',
			password: 'test123'
		}
	}
});
