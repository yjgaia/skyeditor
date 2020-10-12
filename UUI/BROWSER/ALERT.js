/*
 * Alert class
 */
UUI.ALERT = CLASS((cls) => {
	
	let alertCount = 0;
	
	let getCount = cls.getCount = () => {
		return alertCount;
	};
	
	return {
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.style
			//OPTIONAL: params.contentStyle
			//OPTIONAL: params.buttonStyle
			//OPTIONAL: params.on
			//REQUIRED: params.msg
			
			let style = params.style;
			let contentStyle = params.contentStyle;
			let buttonStyle = params.buttonStyle;
			let on = params.on;
			let msg = params.msg;
	
			let content;
			let button;
	
			let modal = UUI.MODAL({
				style : COMBINE([{
					textAlign : 'center'
				}, style]),
				on : on,
				c : [content = P({
					style : contentStyle,
					c : msg
				}), button = UUI.BUTTON({
					style : buttonStyle,
					title : MSG({
						en : 'Close',
						ko : '닫기'
					}),
					on : {
						tap : () => {
							remove();
						}
					}
				})]
			});
			
			let keydownEvent = EVENT('keydown', (e) => {
			    if (e.getKey() === 'Enter' || (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT' && e.getKey() === ' ')) {
					button.fireEvent('tap');
					e.stop();
				}
			});
			
			alertCount += 1;
			
			modal.on('remove', () => {
				keydownEvent.remove();
				alertCount -= 1;
			});
			
			let getNode = self.getNode = () => {
				return modal.getNode();
			};
	
			let append = self.append = (node) => {
				//REQUIRED: node
	
				content.append(node);
			};
	
			let prepend = self.prepend = (node) => {
				//REQUIRED: node
	
				content.prepend(node);
			};
	
			let after = self.after = (node) => {
				//REQUIRED: node
	
				modal.after(node);
			};
	
			let before = self.before = (node) => {
				//REQUIRED: node
	
				modal.before(node);
			};
	
			let remove = self.remove = () => {
				modal.remove();
			};
	
			let empty = self.empty = () => {
				content.empty();
			};
	
			let getChildren = self.getChildren = () => {
				return content.getChildren();
			};
	
			let getButton = self.getButton = () => {
				return button;
			};
	
			let addContentStyle = self.addContentStyle = (style) => {
				//REQUIRED: style
	
				content.addContentStyle(style);
			};
			
			let addButtonStyle = self.addButtonStyle = (style) => {
				//REQUIRED: style
				
				button.addStyle(style);
			};
		}
	};
});
