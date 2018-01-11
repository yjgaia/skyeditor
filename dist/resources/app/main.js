require('uppercase-core');

const {app, BrowserWindow} = require('electron');
const ipcMain = require('electron').ipcMain;

const Path = require('path');
const URL = require('url');

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면 자바스크립트 GC가 일어날 때 창이 멋대로 닫혀버립니다.
let win;

createWindow = () => {
	
	let winConfig = {};
	
	// 새로운 브라우저 창을 생성합니다.
	win = new BrowserWindow({
		icon : __dirname + '/DasomEditor/R/favicon.ico'
	});
	win.webContents.openDevTools();
	ipcMain.on('toggleDevTool', () => {
		if (win.webContents.isDevToolsOpened() !== true) {
			win.webContents.openDevTools();
		} else {
			win.webContents.closeDevTools();
		}
	});
	
	ipcMain.on('winConfig', (e, _winConfig) => {
		
		if (_winConfig !== undefined && _winConfig !== null) {
			winConfig = _winConfig;
			
			if (winConfig.isMaximized === true) {
				win.maximize();
			}
			
			else {
				
				if (winConfig.width !== undefined && winConfig.height !== undefined) {
					win.setSize(winConfig.width, winConfig.height);
				}
				
				if (winConfig.x !== undefined && winConfig.y !== undefined) {
					win.setPosition(winConfig.x, winConfig.y);
				}
			}
		}
		
		else {
			win.maximize();
		}
	});

	// 그리고 현재 디렉터리의 index.html을 로드합니다.
	win.loadURL(URL.format({
		pathname : Path.join(__dirname, 'index.html'),
		protocol : 'file:',
		slashes : true
	}));
	
	win.setMenu(null);
	
	let setConfig = () => {
		
		let bounds = win.getBounds();
		
		winConfig.isMaximized = win.isMaximized();
		
		if (winConfig.isMaximized !== true) {
			winConfig.x = bounds.x;
			winConfig.y = bounds.y;
			winConfig.width = bounds.width;
			winConfig.height = bounds.height;
		}
	};
	
	win.on('move', () => {
		setConfig();
	});

	// save window size and position
	win.on('close', () => {
		
		setConfig();
		
		win.webContents.send('winConfig', winConfig);
	});

	// 창이 닫히면 호출됩니다.
	win.on('closed', () => {
		// 윈도우 객체의 참조를 삭제합니다. 보통 멀티 윈도우 지원을 위해 윈도우 객체를 배열에 저장하는 경우가 있는데 이 경우 해당하는 모든 윈도우 객체의 참조를 삭제해 주어야 합니다.
		win = undefined;
	});
};

// 이 메서드는 Electron의 초기화가 끝나면 실행되며 브라우저 윈도우를 생성할 수 있습니다. 몇몇 API는 이 이벤트 이후에만 사용할 수 있습니다.
app.on('ready', createWindow);

// 모든 창이 닫히면 애플리케이션 종료.
app.on('window-all-closed', () => {
	// macOS의 대부분의 애플리케이션은 유저가 Cmd + Q 커맨드로 확실하게 종료하기 전까지 메뉴바에 남아 계속 실행됩니다.
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// macOS에선 보통 독 아이콘이 클릭되고 나서도
	// 열린 윈도우가 없으면, 새로운 윈도우를 다시 만듭니다.
	if (win === null) {
		createWindow();
	}
});