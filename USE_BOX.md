# Sky Editor를 [BOX](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/BOX.md)로 사용하기

`DEPENDENCY` 파일에 `Hanul/SkyEditor`를 추가합니다.

```
SkyEditor.IDE.init({
	
	// 홈 화면 띄우기
	showHome : () => {
		//TODO:
	},
	
	// 파일 목록을 불러옵니다.
	loadFiles : (path, errorHandler, callback) => {
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 단일 파일의 내용을 불러옵니다.
	load : (path, errorHandler, callback) => {
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일이 존재하는지 확인합니다.
	checkExists : (path, callback) => {
		//REQUIRED: path
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일의 정보를 가져옵니다.
	getInfo : (path, errorHandler, callback) => {
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일의 내용을 저장합니다.
	save : (path, content, errorHandler, callback, isFindAndReplace) => {
		//OPTIONAL: path
		//REQUIRED: content
		//REQUIRED: errorHandler
		//OPTIONAL: callback
		//OPTIONAL: isFindAndReplace
		
		//TODO:
	},
	
	// 폴더를 생성합니다.
	createFolder : (path, errorHandler, callback) => {
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일의 위치를 변경합니다.
	move : (from, to, errorHandler, callback) => {
		//REQUIRED: from
		//REQUIRED: to
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일을 복사합니다.
	clone : (from, to, errorHandler, callback) => {
		//REQUIRED: from
		//REQUIRED: to
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일을 삭제합니다.
	remove : (path, errorHandler, callback) => {
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 새 FTP 정보를 생성합니다.
	ftpNew : (ftpInfo, errorHandler, existedHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: errorHandler
		//REQUIRED: existedHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP 정보를 파기합니다.
	ftpDestroy : (ftpInfo, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에 연결합니다.
	ftpConnect : (ftpInfo, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP로부터 파일 목록을 가져옵니다.
	ftpLoadFiles : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP로부터 파일의 내용을 불러옵니다.
	ftpLoad : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP로부터 파일의 정보를 가져옵니다.
	ftpGetInfo : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에 파일이 존재하는지 확인합니다.
	ftpCheckExists : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에 파일을 저장합니다.
	ftpSave : (ftpInfo, path, content, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: content
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에 폴더를 생성합니다.
	ftpCreateFolder : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에서 파일을 이동합니다.
	ftpMove : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
		//REQUIRED: fromFTPInfo
		//REQUIRED: toFTPInfo
		//REQUIRED: from
		//REQUIRED: to
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에서 파일을 복사합니다.
	ftpClone : (fromFTPInfo, toFTPInfo, from, to, errorHandler, callback) => {
		//REQUIRED: fromFTPInfo
		//REQUIRED: toFTPInfo
		//REQUIRED: from
		//REQUIRED: to
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// FTP에서 파일을 삭제합니다.
	ftpRemove : (ftpInfo, path, errorHandler, callback) => {
		//REQUIRED: ftpInfo
		//REQUIRED: path
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 경로를 클립보드에 복사합니다.
	copy : (pathInfos) => {
		//REQUIRED: pathInfos
		
		//TODO:
	},
	
	// 클립보드에서 복사한 경로를 붙혀넣기합니다.
	paste : (ftpInfo, folderPath, errorHandler, callback) => {
		//OPTIONAL: ftpInfo
		//REQUIRED: folderPath
		//REQUIRED: errorHandler
		//REQUIRED: callback
		
		//TODO:
	},
	
	// 파일의 크기가 너무 클 때
	overFileSize : (path) => {
		//REQUIRED: path
		
		//TODO:
	},
	
	// Git으로부터 저장소를 복사합니다.
	gitClone : (params, handlers) => {
		//REQUIRED: params
		//REQUIRED: handlers
		
		//TODO:
	},
	
	// 원격 저장소와의 차이를 가져옵니다.
	gitDiff : (params, handlers) => {
		//REQUIRED: params
		//REQUIRED: handlers
		
		//TODO:
	},
	
	// Git으로부터 Pull 합니다.
	gitPull : (params, handlers) => {
		//REQUIRED: params
		//REQUIRED: handlers
		
		//TODO:
	},
	
	// Git에 Push 합니다.
	gitPush : (params, handlers) => {
		//REQUIRED: params
		//REQUIRED: handlers
		
		//TODO:
	}
});
```