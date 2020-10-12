SkyEditorServer.FTPModel = OBJECT({
	
	preset : () => {
		return SkyEditorServer.MODEL;
	},
	
	params : () => {

		let validDataSet = {
			id : true,
			title : true,
			host : true,
			port : true,
			protocol : true,
			username : true,
			password : true,
			privateKey : true
		};
		
		return {
			name : 'FTP',
			isNotUsingObjectId : true,
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : 'user'
				},
				update : {
					valid : VALID(validDataSet),
					role : 'user'
				},
				remove : {
					role : 'user'
				},
				get : {
					role : 'user'
				},
				find : {
					role : 'user'
				},
				count : {
					role : 'user'
				}
			}
		};
	}
});
