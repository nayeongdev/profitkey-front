# ProfitKey Web

## Commit Convention

| Tag Name | Description                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| feat     | 새로운 기능 추가                                                               |
| design   | CSS 등 사용자 UI 디자인 변경                                                   |
| style    | 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는 경우                           |
| comment  | 필요한 주석 추가, 변경 및 삭제                                                 |
| fix      | 버그 수정                                                                      |
| refactor | 프로덕션 코드 리팩토링, 새로운 기능이나 버그 수정 없이 현재 구현을 개선한 경우 |
| docs     | README.md 수정                                                                 |
| rename   | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우                             |
| remove   | 파일을 삭제하는 작업만 수행한 경우                                             |
| test     | 테스트 코드, 리팩토링 테스트코드 추가                                          |
| chore    | 빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트             |

## 개발환경 및 설정

- node: v22.12.0
- pnpm: v9.15.2

```bash
pnpm prepare # husky 설정
pnpm install # 의존성 설치
pnpm dev # 개발서버 구동
```
