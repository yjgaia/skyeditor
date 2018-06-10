DasomEditorServer.MAIN = METHOD({

	run : () => {
		
		DasomEditorServer.MATCH_VIEW({
			uri : '',
			target : DasomEditorServer.Home
		});
		
		// 솔리디티 에디터에 기능 추가
		DasomEditor.SolidityEditor.findContracts = (path, callback) => {
			//REQUIRED: path
			//REQUIRED: callback
			
			DasomEditorServer.EthereumContractModel.find({
				path : path
			}, callback);
		};
		
		DasomEditor.SolidityEditor.saveContract = (data, callback) => {
			//REQUIRED: data
			//REQUIRED: callback
			
			DasomEditorServer.EthereumContractModel.create(data, callback);
		};
	}
});
