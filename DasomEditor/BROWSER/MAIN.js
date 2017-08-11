DasomEditor.MAIN = METHOD({

	run : (params) => {

		DasomEditor.IDE.addEditor({
			extname : 'txt',
			editor : DasomEditor.TextEditor
		});
		
		DasomEditor.IDE.addEditor({
			extname : 'js',
			editor : DasomEditor.JavaScriptEditor
		});
		
		DasomEditor.IDE.addEditor({
			extname : 'html',
			editor : DasomEditor.HTMLEditor
		});
	}
});
