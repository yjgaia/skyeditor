SkyEditor.MarkdownEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'SkyEditor.MarkdownEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : SkyEditor.R('icon/markdown.png')
		});
	};
	
	return {
		
		preset : () => {
			return SkyEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'markdown',
				icon : getIcon(),
				style : {
					position : 'relative',
					backgroundColor : '#fff'
				}
			};
		},
		
		init : (inner, self) => {
			
			let editor = inner.getEditor();
			let aceEditor = inner.getAceEditor();
			
			let markdownGenerateWorker = new Worker(SkyEditor.R('js/markdown-generate-worker.js'));
			
			aceEditor.getSession().setUseWrapMode(true);
			
			editor.addStyle({
				flt : 'left',
				width : '50%'
			});
			
			let _editor;
			let preview;
			
			self.append(_editor = DIV({
				style : {
					position : 'absolute',
					right : 0,
					top : 0,
					color : '#000',
					height : '100%',
					overflowX : 'auto',
					overflowY : 'scroll',
					onDisplayResize : () => {
						return {
							width : editor.getWidth()
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
					width : editor.getWidth()
				});
			});
			
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
