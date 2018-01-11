DasomEditor.HomeTab = CLASS({

	preset : () => {
		return SkyDesktop.Tab;
	},

	params : () => {
		return {
			icon : IMG({
				src : DasomEditor.R('icon/home.png')
			}),
			title : '홈'
		};
	}
});
