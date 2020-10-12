SkyEditor.MonacoEditor = CLASS({

	preset : () => {
		return SkyEditor.Editor;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.lang
		//OPTIONAL: params.content
		
		let lang = params.lang;
		let content = params.content;
		
		require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
		require(['vs/editor/editor.main'], () => {
			let editor = monaco.editor.create(document.getElementById('container'), {
				value: content,
				language: lang
			});
		});
	}
});
