SkyEditorServer.MAIN = METHOD({

	run : () => {
		
		SkyEditorServer.MATCH_VIEW({
			uri : '**',
			target : SkyEditorServer.Home
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'sol',
			editor : SkyEditorServer.SolidityEditor
		});
	}
});
