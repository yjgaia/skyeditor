/*
 * DOM이 위에서 아래로 사라지도록 슬라이드 애니메이션을 추가합니다.
 */
UANI.HIDE_SLIDE_DOWN = METHOD((m) => {
	
	let savedHeights = {};

	let getSavedHeights = m.getSavedHeights = () => {
		return savedHeights;
	};

	return {

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

			let originHeight = node.getInnerHeight();

			params = COPY(params);

			savedHeights[node.id] = originHeight;

			params.keyframes = {
				from : {
					marginTop : 0,
					height : originHeight,
					overflow : node.getStyle('overflow')
				},
				to : {
					marginTop : originHeight,
					height : 0,
					overflow : 'hidden'
				}
			};

			ANIMATE(params, callback);
		}
	};
});
