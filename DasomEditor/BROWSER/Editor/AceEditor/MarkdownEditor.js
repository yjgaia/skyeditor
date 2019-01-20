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
			};
		},
		
		init : (inner, self) => {
			
			let editor = inner.getEditor();
			let aceEditor = inner.getAceEditor();
			
			let markdownGenerateWorker = new Worker(DasomEditor.R('js/markdown-generate-worker.js'));
			
			aceEditor.getSession().setUseWrapMode(true);
			
			editor.addStyle({
				flt : 'left',
				width : '50%'
			});
			
			let _editor;
			let preview;
			
			self.append(_editor = DIV({
				style : {
					flt : 'left',
					backgroundColor : '#fff',
					color : '#000',
					height : '100%',
					overflow : 'scroll',
					onDisplayResize : () => {
						return {
							width : editor.getWidth() - 1,
							height : editor.getHeight()
						};
					}
				},
				c : preview = DIV({
					style : {
						padding : 10,
						fontSize : 14
					}
				})
			}));
			
			self.on('active', () => {
				_editor.addStyle({
					width : editor.getWidth() - 1
				});
			});
			
			self.append(CLEAR_BOTH());
			
			markdownGenerateWorker.addEventListener('message', (e) => {
				preview.getEl().innerHTML = e.data;
			}, false);
			
			preview.getEl().setAttribute('class', 'markdown-body');
			
			let keydownTimeout;
			let beforeContent;
				
			aceEditor.getSession().on('change', RAR(() => {
					
				let content = aceEditor.getValue();
				
				if (keydownTimeout !== undefined) {
					clearTimeout(keydownTimeout);
				}
				
				keydownTimeout = setTimeout(() => {
					
					if (beforeContent !== content) {
						markdownGenerateWorker.postMessage(content);
						beforeContent = content;
					}
					
					keydownTimeout = undefined;
					
				}, 500);
			}));
		}
	};
});
