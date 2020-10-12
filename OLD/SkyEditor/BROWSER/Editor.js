SkyEditor.Editor = CLASS({

	preset : () => {
		return SkyDesktop.Tab;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.ftpInfo
		//OPTIONAL: params.path
		//OPTIONAL: params.content
		
		let ftpInfo = params.ftpInfo;
		let path = params.path;
		let content = params.content;
		
		let originContent = content;
		
		let title = self.getTitle();
		
		let getFTPInfo = self.getFTPInfo = () => {
			return ftpInfo;
		};
		
		let setFTPInfo = self.setFTPInfo = (_ftpInfo) => {
			//REQUIRED: ftpInfo
			
			ftpInfo = _ftpInfo;
		};
		
		let getPath = self.getPath = () => {
			return path;
		};
		
		let setPath = self.setPath = (_path) => {
			//REQUIRED: path
			
			if (ftpInfo === undefined) {
			
				let editorOpenedStore = SkyEditor.IDE.getEditorOpenedStore();
				
				editorOpenedStore.remove(path);
				
				editorOpenedStore.save({
					name : _path,
					value : true
				});
			}
			
			path = _path;
		};
		
		let getContent = self.getContent = () => {
			return content;
		};
		
		let setContent = self.setContent = (_content) => {
			//REQUIRED: content
			
			content = _content;
			
			self.fireEvent('change');
		};
		
		let setOriginContent = self.setOriginContent = (_originContent) => {
			//REQUIRED: originContent
			
			originContent = _originContent;
			
			self.fireEvent('change');
		};
		
		let setScrollTop = self.setScrollTop = (scrollTop) => {
			//REQUIRED: scrollTop
		};
		
		let setFindText = self.setFindText = (findText) => {
			//REQUIRED: findText
		};
		
		let setTitle;
		OVERRIDE(self.setTitle, (origin) => {
			
			setTitle = self.setTitle = (_title) => {
				//REQUIRED: title
				
				title = _title;
				
				self.fireEvent('titlechange');
			};
			
			self.on('change', () => {
				if (self.getContent() !== originContent) {
					origin('* ' + title);
				} else {
					origin(title);
				}
			});
		});
		
		let getTitle;
		OVERRIDE(self.getTitle, (origin) => {
			
			getTitle = self.getTitle = () => {
				return title;
			};
		});
		
		self.on('close', () => {
			
			if (self.getContent() !== originContent && (
				self.getContent() !== '' ||
				originContent !== undefined
			)) {
				
				SkyDesktop.Confirm({
					msg : '저장하지 않았습니다. 정말 종료 하시겠습니까?'
				}, () => {
					
					self.remove();
				});
				
				return false;
			}
		});
		
		let isFirst = true;
		
		// 에디터가 활성화되면 파일 내용 새로 불러와서 비교합니다.
		self.on('active', () => {
			
			if (path !== undefined) {
				
				if (isFirst !== true) {
					
					SkyEditor.IDE.load({
						ftpInfo : ftpInfo,
						path : path,
						isReload : true
					}, (newContent) => {
						
						// 수정한 바가 없으면 새 내용으로 변경
						if (self.getContent() !== newContent && self.getContent() === originContent) {
							self.setContent(newContent);
							self.setOriginContent(newContent);
						}
					});
				}
				
				isFirst = false;
			}
		});
	}
});
