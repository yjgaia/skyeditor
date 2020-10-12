/*
 * DOM이 아래에서 위로 사라지도록 슬라이드 애니메이션을 추가합니다.
 */
UANI.HIDE_SLIDE_UP = METHOD((m) => {
	
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
					height : originHeight,
					overflow : node.getStyle('overflow')
				},
				to : {
					height : 0,
					overflow : 'hidden'
				}
			};

			ANIMATE(params, callback);
		}
	};
});
