# Font Awesome BOX
[Font Awesome](http://fontawesome.io/) 아이콘들을 UPPERCASE 기반 프로젝트에서 사용할 수 있도록 만든 BOX 입니다.

## 설치하기
1. 프로젝트의 `DEPENDENCY` 파일에 `Hanul/FontAwesome`를 추가합니다.
2. [`ubm`](https://www.npmjs.com/package/ubm)을 이용해 설치합니다.
    ```
    ubm install
    ```

## 사용방법
```javascript
DIV({
	style : {
		padding : 20,
		fontSize : 100
	},
	c : FontAwesome.GetIcon('flag')
}).appendTo(BODY);
```

아이콘에 직접 스타일을 지정 할 수 있습니다.
```javascript
DIV({
	style : {
		padding : 20
	},
	c : FontAwesome.GetIcon({
		style : {
			fontSize : 100
		},
		key : 'flag'
	})
}).appendTo(BODY);
```

## 소스코드
https://github.com/Hanul/FontAwesomeBOX

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)