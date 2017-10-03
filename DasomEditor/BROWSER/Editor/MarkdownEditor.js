DasomEditor.MarkdownEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.MarkdownEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/markdown.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'markdown',
				icon : getIcon()
			}
		},
		
		init : (inner, self) => {
			
			let editor = inner.getEditor();
			
			editor.addStyle({
				width : '50%'
			});
			
			let preview;
			
			self.append(preview = DIV({
				style : {
					width : '50%'
				}
			}));
		}
	};
});
