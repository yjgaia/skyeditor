require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		
		defaultBoxName : 'DasomEditor',
		
		title : '다솜 에디터',
		
		webServerPort : 8731
	},
	NODE_CONFIG : {
		isNotUsingCPUClustering : true
	}
});
