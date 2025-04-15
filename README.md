# ProfitKey Web

## Commit Convention

| Tag Name | Description                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| feat     | 새로운 기능 추가                                                               |
| design   | CSS 등 사용자 UI 디자인 변경                                                   |
| style    | 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는 경우                           |
| fix      | 버그 수정                                                                      |
| refactor | 프로덕션 코드 리팩토링, 새로운 기능이나 버그 수정 없이 현재 구현을 개선한 경우 |
| docs     | README.md 수정                                                                 |
| remove   | 파일을 삭제하는 작업만 수행한 경우                                             |
| chore    | 빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트             |

## 개발환경 및 설정

- node: v22.12.0
- pnpm: v9.15.2

### 프론트 서버 실행
```bash
pnpm prepare # husky 설정
pnpm install # 의존성 설치
pnpm dev # 개발서버 구동
```
- 로컬 주소 : `http://localhost:5173/`

### 벡엔드 서버 실행
```bash
# 도커 설치 필요
docker run -p 80:80 {도커_이미지_이름:태그} # 태그에는 *_local로 되어있는 버전 사용
```
- swagger 문서 확인 : `http://localhost/swagger-ui/index.html`

> 프론트에서 `.env.local` 파일 생성 후, `VITE_API_URL=백엔드주소` 기입 !!필수!!

### 배포주소
- https://profitkey-inky.vercel.app/
- 서버 : https://dev-server.profitkey.click
> 무료 호스팅이라 응답 속도가 느릴 수 있습니다.

## 폴더 구조
```
├── app/
│   ├── providers/
│   └── routers/
├── entities/
├── pages/
│   ├── announcement-detail/
│   ├── auth/
│   ├── favorite-stocks/
│   ├── help/
│   ├── home/
│   ├── login/
│   ├── my/
│   ├── my-comment/
│   ├── news/
│   └── stock-detail/
├── shared/
│   ├── api/
│   ├── lib/
│   ├── providers/
│   └── ui/
└── widgets/
    └── layout/
```