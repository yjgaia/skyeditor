DasomEditor.CompareEditor = CLASS({

	preset : () => {
		return DasomEditor.Editor;
	},
	
	params : () => {
		return {
			icon : IMG({
				src : DasomEditor.R('icon/compare.png')
			})
		}
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.path1
		//REQUIRED: params.content1
		//REQUIRED: params.path2
		//REQUIRED: params.content2
		
		let path1 = params.path1;
		let content1 = params.content1;
		
		let path2 = params.path2;
		let content2 = params.content2;
		
		let editor1;
		let gutter;
		let editor2;
		
		let now = Date.now();
		
		let editor1Id = '__COMPARE_LEFT_' + now;
		let gutterId = '__COMPARE_GUTTER_' + now;
		let editor2Id = '__COMPARE_RIGHT_' + now;
		
		self.append(editor1 = DIV({
			style : {
				flt : 'left',
				width : '45%',
				height : '100%'
			}
		}));
		
		editor1.getEl().setAttribute('id', editor1Id);
		
		self.append(gutter = DIV({
			style : {
				flt : 'left',
				width : '10%',
				height : '100%',
				overflow : 'hidden'
			}
		}));
		
		gutter.getEl().setAttribute('id', gutterId);
		
		self.append(editor2 = DIV({
			style : {
				flt : 'left',
				width : '45%',
				height : '100%'
			}
		}));
		
		editor2.getEl().setAttribute('id', editor2Id);
		
		self.append(CLEAR_BOTH());
		
		self.on('show', () => {
			
			let differ = new AceDiff({
				theme : 'ace/theme/twilight',
				left : {
					id : editor1Id,
					content : content1
				},
				right : {
					id : editor2Id,
					content : content2
				},
				classes : {
					gutterID : gutterId
				}
			});
		});
		
		let getPath1 = self.getPath1 = () => {
			return path1;
		};
		
		let getContent1 = self.getContent1 = () => {
			return content1;
		};
		
		let getPath2 = self.getPath2 = () => {
			return path1;
		};
		
		let getContent2 = self.getContent2 = () => {
			return content2;
		};
	}
});
