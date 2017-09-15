DasomEditorServer.MAIN = METHOD({

	run : () => {
		
		BROWSER_CONFIG.beforeUnloadMessage = MSG({
			ko : '페이지를 이동하려 합니다.\n\n서버가 재시작 되었거나 인터넷이 끊어졌을 수 있습니다. 작성중인 내용을 다른곳에 저장하고 새로고침해 주시기 바랍니다.'
		});
		
		DasomEditorServer.MATCH_VIEW({
			uri : '',
			target : DasomEditorServer.Home
		});
	}
});
