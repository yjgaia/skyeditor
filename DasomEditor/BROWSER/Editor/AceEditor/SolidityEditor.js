DasomEditor.SolidityEditor = CLASS((cls) => {
	
	let getName = cls.getName = () => {
		return 'DasomEditor.SolidityEditor';
	};
	
	let getIcon = cls.getIcon = () => {
		return IMG({
			src : DasomEditor.R('icon/solidity.png')
		});
	};
	
	return {
		
		preset : () => {
			return DasomEditor.AceEditor;
		},
		
		params : () => {
			return {
				mode : 'solidity',
				icon : getIcon()
			}
		},
		
		init : (inner, self, params) => {
			
			let worker = new Worker(DasomEditor.R('js/solc-worker.js'));
			
			self.on('save', () => {
				worker.postMessage(self.getContent());
			});
			
			worker.onmessage = (e) => {
				console.log(e.data);
			};
			
			// 메타마스크 연동이 되어있는 경우
			if (global.web3 !== undefined) {
				
				//TODO: 배포하기 버튼 추가
				
				/*
				let compileButton;
				
				self.on('active', () => {
					
					// 도구 메뉴 추가
					DasomEditor.IDE.addToolbarButton(button = SkyDesktop.ToolbarButton({
						icon : IMG({
							src : DasomEditor.R('icon/devtool.png')
						}),
						title : '개발자 도구',
						on : {
							tap : () => {
							}
						}
					}));
				});
				
				self.on('deactive', () => {
					
					// 도구 메뉴 추가
					DasomEditor.IDE.removeToolbarButton(button);
				});
				
				self.on('remove', () => {
					
					// 도구 메뉴 추가
					DasomEditor.IDE.removeToolbarButton(button);
				});*/
			}
		}
	};
});
