DasomEditorServer.MAIN = METHOD({

	run : () => {
		
		DasomEditorServer.MATCH_VIEW({
			uri : '**',
			target : DasomEditorServer.Home
		});
		
		DasomEditor.IDE.addEditor({
			extname : 'sol',
			editor : DasomEditorServer.SolidityEditor
		});
	}
});
