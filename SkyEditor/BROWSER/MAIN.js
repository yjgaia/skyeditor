SkyEditor.MAIN = METHOD({

	run : () => {
		
		SkyEditor.IDE.addEditor({
			extname : 'txt',
			editor : SkyEditor.TextEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'js',
			editor : SkyEditor.JavaScriptEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'json',
			editor : SkyEditor.JSONEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'babelrc',
			editor : SkyEditor.JSONEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'html',
			editor : SkyEditor.HTMLEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'css',
			editor : SkyEditor.CSSEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'hx',
			editor : SkyEditor.HaxeEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'as',
			editor : SkyEditor.ActionScriptEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'erl',
			editor : SkyEditor.ErlangEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'md',
			editor : SkyEditor.MarkdownEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'gml',
			editor : SkyEditor.GMLEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'php',
			editor : SkyEditor.PHPEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'xml',
			editor : SkyEditor.XMLEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'java',
			editor : SkyEditor.JavaEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'nsp',
			editor : SkyEditor.NSPEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'less',
			editor : SkyEditor.LessEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'csv',
			editor : SkyEditor.CSVEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'ts',
			editor : SkyEditor.TypeScriptEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'jsx',
			editor : SkyEditor.JSXEditor
		});
		
		SkyEditor.IDE.addEditor({
			extname : 'tsx',
			editor : SkyEditor.TSXEditor
		});
	}
});
