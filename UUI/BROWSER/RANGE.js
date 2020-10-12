/*
 * Range input class
 */
UUI.RANGE = CLASS({

	preset : () => {
		return NODE;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.name
		//OPTIONAL: params.min
		//OPTIONAL: params.max
		//OPTIONAL: params.step
		//OPTIONAL: params.value
		//OPTIONAL: params.style
		//OPTIONAL: params.thumbStyle
		//OPTIONAL: params.trackStyle
		//OPTIONAL: params.scale

		let name = params.name;
		let min = params.min;
		let max = params.max;
		let step = params.step;
		let value = params.value;
		let style = params.style;
		let thumbStyle = params.thumbStyle;
		let trackStyle = params.trackStyle;
		let scale = params.scale;
		
		if (min === undefined) {
			min = 0;
		}
		if (max === undefined) {
			max = 100;
		}
		if (step === undefined) {
			step = 1;
		}
		if (value === undefined) {
			value = min;
		}
		if (scale === undefined) {
			scale = 1;
		}
		
		if (value > max) {
			value = max;
		}
		if (value < min) {
			value = min;
		}
		
		if (style === undefined) {
			style = {};
		}
		
		let beforeValue = value;

		let track;
		let thumb;
		let wrapper = DIV({
			style : COMBINE([{
				padding : '10px 5px'
			}, style]),
			c : track = DIV({
				style : EXTEND({
					origin : {
						position : 'relative'
					},
					extend : trackStyle
				}),
				c : thumb = DIV({
					style : EXTEND({
						origin : {
							position : 'absolute',
							cursor : 'pointer'
						},
						extend : thumbStyle
					})
				})
			})
		});
		
		self.on('show', () => {
			
			thumb.addStyle({
				left : (value - min) / (max - min) * track.getWidth(),
				marginLeft : -thumb.getWidth() / 2,
				top : (track.getHeight() - thumb.getHeight()) / 2
			});
			
			DELAY(() => {
				
				thumb.addStyle({
					left : (value - min) / (max - min) * track.getWidth(),
					marginLeft : -thumb.getWidth() / 2,
					top : (track.getHeight() - thumb.getHeight()) / 2
				});
			});
			
			thumb.on('touchstart', (e) => {
				
				let startTouchLeft = e.getLeft();
				let startThumbLeft = thumb.getLeft() + thumb.getWidth() / 2 - track.getLeft();
				
				let touchmoveEvent = EVENT('touchmove', (e) => {
					
					let trackWidth = track.getWidth();
					
					let left = startThumbLeft + (e.getLeft() - startTouchLeft) / scale;
					if (left < 0) {
						left = 0;
					}
					if (left > trackWidth) {
						left = trackWidth;
					}
					
					value = (left / trackWidth) * (max - min) + min;
					value = Math.round(value / step) * step;
					
					left = (value - min) / (max - min) * trackWidth;
					
					thumb.addStyle({
						left : left
					});
					
					if (beforeValue !== value) {
						self.fireEvent('change');
						beforeValue = value;
					}
					
					e.stopDefault();
				});
				
				let touchendEvent = EVENT('touchend', (e) => {
					touchmoveEvent.remove();
					touchendEvent.remove();
					
					self.fireEvent('touchend');
					
					e.stop();
				});
				
				e.stopDefault();
			});
		});

		inner.setWrapperDom(wrapper);

		let getName = self.getName = () => {
			return name;
		};

		let getValue = self.getValue = () => {
			return value;
		};

		let setValue = self.setValue = (_value) => {
			//REQUIRED: _value

			value = _value;
			
			if (value > max) {
				value = max;
			}
			
			if (value < min) {
				value = min;
			}
			
			if (beforeValue !== value) {
				
				self.fireEvent('change');
				
				beforeValue = value;
				
				thumb.addStyle({
					left : (value - min) / (max - min) * track.getWidth(),
					marginLeft : -thumb.getWidth() / 2,
					top : (track.getHeight() - thumb.getHeight()) / 2
				});
			}
		};

		let on = self.on = (eventName, eventHandler) => {
			//REQUIRED: eventName
			//REQUIRED: eventHandler

			EVENT({
				node : self,
				lowNode : wrapper,
				name : eventName
			}, eventHandler);
		};
	}
});
