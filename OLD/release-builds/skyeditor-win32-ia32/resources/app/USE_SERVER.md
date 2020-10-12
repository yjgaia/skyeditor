# Sky Editor를 서버에 설치하여 사용하기
샘플 에디터: http://hanul.co:8731/ (비밀번호는 `test123` 입니다.)

1. [UPPERCASE를 설치](https://github.com/Hanul/UPPERCASE/blob/master/DOC/INSTALL.md)합니다.
2. 아래 `git clone` 명령어를 사용하여 원하는 곳에 프로젝트를 복제합니다.
	```
	git clone https://github.com/Hanul/SkyEditor.git
	```
3. `SkyEditorServer.js` 파일을 원하는대로 수정합니다.
	```js
	require(process.env.UPPERCASE_PATH + '/LOAD.js');
	
	BOOT({
		CONFIG : {
			isDevMode : true,
			
			defaultBoxName : 'SkyEditorServer',
			
			title : 'Sky Editor',
			
			webServerPort : 8731
		},
		BROWSER_CONFIG : {
			SkyDesktop : {
				theme : 'dark'
			},
			SkyEditor : {
				homepage : 'http://skyeditor.hanul.co'
			}
		},
		NODE_CONFIG : {
			isNotUsingCPUClustering : true,
			
			dbName : 'SkyEditorServer-test',
			
			SkyEditorServer : {
				workspacePath : './workspace',
				password : 'test123'
			}
		}
	});
	```
4. [`forever`](https://www.npmjs.com/package/forever)를 사용하여 실행합니다.
	```
	forever start SkyEditorServer.js
	```
5. 웹 브라우저에서 `http://localhost:8731`로 접속합니다.