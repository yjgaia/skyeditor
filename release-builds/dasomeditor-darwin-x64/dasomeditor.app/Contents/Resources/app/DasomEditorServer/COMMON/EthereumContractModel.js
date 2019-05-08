DasomEditorServer.EthereumContractModel = OBJECT({
	
	preset : () => {
		return DasomEditorServer.MODEL;
	},
	
	params : () => {

		let validDataSet = {
			path : true,
			name : true,
			address : true,
			abi : true,
			args : true
		};
		
		return {
			name : 'EthereumContract',
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
