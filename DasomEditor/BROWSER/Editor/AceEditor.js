DasomEditor.AceEditor = CLASS({

	preset : () => {
		return DasomEditor.Editor;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.mode
		//OPTIONAL: params.content
		
		let mode = params.mode;
		let content = params.content;
		
		let editor;
		
		self.append(editor = DIV({
			style : {
				height : '100%'
			},
			c : content
		}));
		
		let aceEditor = ace.edit(editor.getEl());
		aceEditor.setTheme('ace/theme/twilight');
		aceEditor.setFontSize(14);
		if (mode !== undefined) {
			aceEditor.getSession().setMode('ace/mode/' + mode);
		}
		aceEditor.getSession().setUseSoftTabs(false);
		aceEditor.getSession().on('changeScrollTop', () => {
			self.fireEvent('scroll');
		});
		aceEditor.getSession().on('change', () => {
			self.fireEvent('change');
		});
		aceEditor.renderer.setScrollMargin(0, 300);
		aceEditor.commands.addCommand({
			name : 'replace2',
			bindKey : {
				win : 'Ctrl-R',
				mac : 'Command-Option-F'
			},
			exec : (editor) => {
				
				ace.config.loadModule('ace/ext/searchbox', (e) => {
					
					e.Search(editor, true);
					
					let kb = editor.searchBox.$searchBarKb;
					
					let command = kb.commands['Ctrl-f|Commasnd-f|Ctrl-H|Command-Option-F'];
					
					if (command !== undefined && command.bindKey.indexOf('Ctrl-R') === -1) {
						command.bindKey += '|Ctrl-R';
						kb.addCommand(command);
					}
				});
			}
		});
		aceEditor.$blockScrolling = Infinity;
		
		self.on('active', () => {
		    aceEditor.focus();
		});
		
		if (content !== undefined) {
			aceEditor.setValue(content, -1);
		}
		
		let getScrollTop;
		OVERRIDE(self.getScrollTop, (origin) => {
			
			getScrollTop = self.getScrollTop = () => {
				return aceEditor.getSession().getScrollTop();
			};
		});
		
		let setScrollTop;
		OVERRIDE(self.setScrollTop, (origin) => {
			
			setScrollTop = self.setScrollTop = (scrollTop) => {
				//REQUIRED: scrollTop
				
				aceEditor.getSession().setScrollTop(scrollTop);
			};
		});
		
		let getContent;
		OVERRIDE(self.getContent, (origin) => {
			
			getContent = self.getContent = () => {
				return aceEditor.getValue();
			};
		});
		
		let getEditor = inner.getEditor = () => {
			return editor;
		};
		
		let getAceEditor = inner.getAceEditor = () => {
			return aceEditor;
		};
	}
});
