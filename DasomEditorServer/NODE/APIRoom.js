DasomEditorServer.APIRoom = OBJECT({

	init : (inner, self) => {
		
		DasomEditorServer.ROOM('API', (clientInfo, on, off, send, broadcastExceptMe) => {
			
			on('loadFiles', (userId, ret) => {
				
			});
		});
	}
});
