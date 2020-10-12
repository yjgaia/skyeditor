/*
 * Confirm class
 */
UUI.CONFIRM = CLASS((cls) => {
	
	let confirmCount = 0;
	
	let getCount = cls.getCount = () => {
		return confirmCount;
	};
	
	return {
		
		init : (inner, self, params, callbackOrhandlers) => {
			//REQUIRED: params
			//OPTIONAL: params.style
			//OPTIONAL: params.contentStyle
			//OPTIONAL: params.okButtonStyle
			//OPTIONAL: params.okButtonTitle
			//OPTIONAL: params.cancelButtonStyle
			//OPTIONAL: params.on
			//REQUIRED: params.msg
			//OPTIONAL: params.target
			//OPTIONAL: params.href
			//REQUIRED: callbackOrhandlers
			//OPTIONAL: callbackOrhandlers.ok
			//OPTIONAL: callbackOrhandlers.cancel
	
			let style = params.style;
			let contentStyle = params.contentStyle;
			let okButtonStyle = params.okButtonStyle;
			let okButtonTitle = params.okButtonTitle;
			let cancelButtonStyle = params.cancelButtonStyle;
			let on = params.on;
			let msg = params.msg;
			let target = params.target;
			let href = params.href;
			
			let okHandler;
			let cancelHandler;
			
			if (CHECK_IS_DATA(callbackOrhandlers) !== true) {
				okHandler = callbackOrhandlers;
			} else {
				okHandler = callbackOrhandlers.ok;
				cancelHandler = callbackOrhandlers.cancel;
			}
			
			let content;
			let okButton;
			let cancelButton;
			let modal = UUI.MODAL({
				style : COMBINE([{
					textAlign : 'center'
				}, style]),
				on : on,
				c : [content = P({
					style : contentStyle,
					c : msg
				}), okButton = UUI.BUTTON({
					style : okButtonStyle,
					target : target,
					href : href,
					title : okButtonTitle !== undefined ? okButtonTitle : MSG({
						en : 'Ok',
						ko : '확인'
					}),
					on : {
						tap : (e) => {
							if (okHandler !== undefined && okHandler(e.getLeft(), e.getTop()) !== false) {
								e.stop();
								remove();
							}
						}
					}
				}), cancelButton = UUI.BUTTON({
					style : cancelButtonStyle,
					title : MSG({
						en : 'Close',
						ko : '닫기'
					}),
					on : {
						tap : () => {
							if (cancelHandler !== undefined) {
								cancelHandler();
							}
							remove();
						}
					}
				}), CLEAR_BOTH()]
			});
			
			let keydownEvent = EVENT('keydown', (e) => {
			    if (e.getKey() === 'Enter' || (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT' && e.getKey() === ' ')) {
					okButton.fireEvent('tap');
					e.stop();
				}
			});
			
			confirmCount += 1;
			
			modal.on('remove', () => {
				keydownEvent.remove();
				confirmCount -= 1;
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
			
			let getOkButton = self.getOkButton = () => {
				return okButton;
			};
			
			let getCancelButton = self.getCancelButton = () => {
				return cancelButton;
			};
	
			let addContentStyle = self.addContentStyle = (style) => {
				//REQUIRED: style
	
				content.addContentStyle(style);
			};
			
			let addOkButtonStyle = self.addOkButtonStyle = (style) => {
				//REQUIRED: style
				
				okButton.addStyle(style);
			};
			
			let addCancelButtonStyle = self.addCancelButtonStyle = (style) => {
				//REQUIRED: style
				
				cancelButton.addStyle(style);
			};
		}
	};
});
