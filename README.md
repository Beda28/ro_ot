## ro_ot 프로젝트 ~

## 도커 실행 명령어 모음 ##


```js
docker compose up --build
// 도커 빌드 및 시작 (로그 O)

docker compose up --build -d
// 도커 빌드 및 시작 (로그 X)

docker compose stop
// 실행중인 도커 종료

docker compose down --volumes
// 로그기록까지 포함해서 전부 지우기
```