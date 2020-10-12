/*
 * DOM이 왼쪽에서 오른쪽으로 나타나도록 슬라이드 애니메이션을 추가합니다.
 */
UANI.SHOW_SLIDE_RIGHT = METHOD({

	run : (params, callback) => {
		//REQUIRED: params
		//REQUIRED: params.node
		//OPTIONAL: params.duration
		//OPTIONAL: params.timingFunction
		//OPTIONAL: params.delay
		//OPTIONAL: params.iterationCount
		//OPTIONAL: params.direction
		//OPTIONAL: params.playStateduration
		//OPTIONAL: callback

		let node = params.node;
		
		let width = node.getInnerWidth();
		let marginLeft = node.getStyle('marginLeft');
		
		params = COPY(params);

		if (width === 0) {
			width = UANI.HIDE_SLIDE_RIGHT.getSavedWidths()[node.id];
		}

		params.keyframes = {
			from : {
				width : width,
				marginLeft : marginLeft === undefined ? width : marginLeft,
				overflow : 'hidden'
			},
			to : {
				marginLeft : 0,
				overflow : node.getStyle('overflow')
			}
		};

		ANIMATE(params, callback);
	}
});
