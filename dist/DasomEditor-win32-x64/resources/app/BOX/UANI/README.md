# UANI
[UPPERCASE의 DOM](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/UPPERCASE-CORE-BROWSER.md#dom-객체-생성)에 애니메이션을 추가할 수 있도록 하는 BOX입니다.

## 설치하기
1. 프로젝트의 `DEPENDENCY` 파일에 `Hanul/UANI`를 추가합니다.
2. [`ubm`](https://www.npmjs.com/package/ubm)을 이용해 설치합니다.
    ```
    ubm install
    ```

## FADE_IN
DOM이 페이드 인 효과와 함께 나타나도록 애니메이션을 추가합니다.
```javascript
UANI.FADE_IN({
	node : node,
	duration : 1
});
```

## FADE_OUT
DOM이 페이드 아웃 효과와 함께 사라지도록 애니메이션을 추가합니다.
```javascript
UANI.FADE_OUT({
	node : node,
	duration : 1
});
```

## SHOW_SLIDE_DOWN
DOM이 위에서 아래로 나타나도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.SHOW_SLIDE_DOWN({
	node : node,
	duration : 1
});
```

## SHOW_SLIDE_UP
DOM이 아래에서 위로 나타나도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.SHOW_SLIDE_UP({
	node : node,
	duration : 1
});
```

## SHOW_SLIDE_RIGHT
DOM이 왼쪽에서 오른쪽으로 나타나도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.SHOW_SLIDE_RIGHT({
	node : node,
	duration : 1
});
```

## SHOW_SLIDE_LEFT
DOM이 오른쪽에서 왼쪽으로 나타나도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.SHOW_SLIDE_LEFT({
	node : node,
	duration : 1
});
```

## HIDE_SLIDE_DOWN
DOM이 위에서 아래로 사라지도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.HIDE_SLIDE_DOWN({
	node : node,
	duration : 1
});
```

## HIDE_SLIDE_UP
DOM이 아래에서 위로 사라지도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.HIDE_SLIDE_UP({
	node : node,
	duration : 1
});
```

## HIDE_SLIDE_RIGHT
DOM이 왼쪽에서 오른쪽으로 사라지도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.HIDE_SLIDE_RIGHT({
	node : node,
	duration : 1
});
```

## HIDE_SLIDE_LEFT
DOM이 오른쪽에서 왼쪽으로 사라지도록 슬라이드 애니메이션을 추가합니다.
```javascript
UANI.HIDE_SLIDE_LEFT({
	node : node,
	duration : 1
});
```

## API 문서
[API](API/README.md)

## 소스코드
https://github.com/Hanul/UANI

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)