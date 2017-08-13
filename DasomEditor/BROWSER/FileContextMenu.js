DasomEditor.FileContextMenu = CLASS({

	preset : () => {
		return SkyDesktop.ContextMenu;
	},

	params : () => {
		
		return {
			c : [SkyDesktop.ContextMenuItem({
				title : '새 파일'
			}), SkyDesktop.ContextMenuItem({
				title : '복사'
			}), SkyDesktop.ContextMenuItem({
				title : '붙여넣기'
			}), SkyDesktop.ContextMenuItem({
				title : '삭제'
			}), SkyDesktop.ContextMenuItem({
				title : '이름 변경'
			})]
		};
	}
});
