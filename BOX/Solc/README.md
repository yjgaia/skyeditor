# SolcBOX
브라우저에서 Web Worker를 통해 Solidity 코드를 컴파일 하는 [BOX](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/BOX.md)

## 설치하기
프로젝트의 `DEPENDENCY` 파일에 `Hanul/Solc`를 추가합니다.

## `Solc.Compile(codes, handlers)`
Solidity 코드들을 컴파일합니다. 컴파일에서 오류가 나면 오류 메시지를 `handlers.error`로 넘기고, 성공하면 계약을 `handlers.success`로 넘깁니다.

```javascript
Solc.Compile({
	'lib.sol' : 'library L { function f() returns (uint) { return 7; } }',
	'cont.sol' : 'import "lib.sol"; contract x { function g() { L.f(); } }'
}, {
	error : (errorMsg) => {
		console.log(errorMsg);
	},
	success : (contracts) => {
		console.log(contracts);
	}
});
```

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)