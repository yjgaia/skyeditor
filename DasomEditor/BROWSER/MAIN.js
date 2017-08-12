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
		
		DasomEditor.IDE.addEditor({
			extname : 'hx',
			editor : DasomEditor.HaxeEditor
		});
		
		DasomEditor.IDE.addEditor({
			extname : 'as',
			editor : DasomEditor.ActionScriptEditor
		});
	}
});
