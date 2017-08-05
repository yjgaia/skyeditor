require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		
		defaultBoxName : 'DasomEditor',
		
		title : '다솜 에디터',
		
		webServerPort : 8731
	},
	BROWSER_CONFIG : {
		SkyDesktop : {
			theme : 'dark'
		}
	},
	NODE_CONFIG : {
		isNotUsingCPUClustering : true
	}
});
