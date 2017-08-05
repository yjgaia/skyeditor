DasomEditor.JavaScriptEditor = CLASS({

	preset : () => {
		return DasomEditor.Editor;
	},

	init : (inner, self, params) => {
		//OPTIONAL: params
		//OPTIONAL: params.content
		
		let content;
		
		if (params !== undefined) {
			content = params.content;
		}
		
		let editor;
		
		self.setIcon(IMG({
			src : DasomEditor.R('icon/js.png')
		}));
		
		self.append(editor = DIV({
			style : {
				height : '100%'
			},
			c : content
		}));
		
		let aceEditor = ace.edit(editor.getEl());
		aceEditor.setTheme('ace/theme/twilight');
		aceEditor.setFontSize(14);
		aceEditor.getSession().setMode('ace/mode/javascript');
		aceEditor.getSession().setUseWrapMode(true);
		aceEditor.renderer.setScrollMargin(0, 300);
		aceEditor.commands.addCommand({
			name : 'replace2',
			bindKey : {
				win : 'Ctrl-R',
				mac : 'Command-Option-F'
			},
			exec : (editor) => {
				
				require('ace/config').loadModule('ace/ext/searchbox', (e) => {
					
					e.Search(editor, true);
					
					let kb = editor.searchBox.$searchBarKb;
					
					let command = kb.commands['Ctrl-f|Command-f|Ctrl-H|Command-Option-F'];
					
					if (command.bindKey.indexOf('Ctrl-R') === -1) {
						command.bindKey += '|Ctrl-R';
						kb.addCommand(command);
					}
				});
			}
		});
	}
});
