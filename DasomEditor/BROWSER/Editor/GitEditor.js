DasomEditor.GitEditor = CLASS((cls) => {
	
	let gitInfoStore = STORE('gitInfoStore');
	
	return {
	
		preset : () => {
			return DasomEditor.Editor;
		},
	
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.folderPath
			
			let folderPath = params.folderPath;
			
			self.setTitle(folderPath.substring(folderPath.lastIndexOf('/') + 1));
			
			self.setIcon(IMG({
				src : DasomEditor.R('icon/git.png')
			}));
			
			DasomEditor.IDE.gitDiff(folderPath, {
				error : (errorMsg) => {
					console.log(errorMsg);
				},
				success : (newFilePaths, updatedFilePaths, removedFilePaths) => {
					console.log(newFilePaths, updatedFilePaths, removedFilePaths);
				}
			});
		}
	};
});
