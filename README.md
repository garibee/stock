# 도커 이미지 만들겸 명령어 연습
docker stop $(docker ps -a -q) 모든 도커 컨테이너 중지
docker rm $(docker ps -a -q)  모든 도커 컨테이너 삭제
docker rmi $(docker images -q) 모든 이미지 삭제

docker ps 동작중인 컨테이너 확인 
docker ps -a 정지된 컨테이너 확인
docker rm [컨테이너id], [컨테이너id(복수개 삭제시 추가)]

docker images 현재 이미지 확인
docker rmi [이미지ID]

docker rmi -f [이미지ID]

docker build -t [앱 명] .  도커 파일을 만든 디렉토리에서 빌드
docker build -t stock-app .

docker run -d -p 포트:포트 [앱 명] 
docker run -d -p 5000:8089 stock-app

# stock
/주가 [종목명]
