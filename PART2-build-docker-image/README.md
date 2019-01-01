# Build Docker Image

## 목차
- `docker commit` 명령어로 사용자 정의 이미지 만들기
- 도커 이미지 구조
- 도커 파일이란
    - 기본 명령어
    - 이미지 빌드
- 도커 이미지 배포
    - 도커허브에 이미지 배포
    - Private Docker Registry에 이미지 배포
- 도커이미지 만들기 실습
    - express 웹서버 이미지
    - 스프링 웹서버 이미지
        - JAR
        - WAR

## `docker commit` 명령어로 사용자 정의 이미지 만들기
당연하게도 우리는 우리의 입맛에 맞는 사용자 정의 이미지가 필요합니다. 이번에는 간단한 방식으로 우리가 원하는 도커 이미지를 만들어보면서 도커 이미지의 구조에 대해서 살펴보겠습니다. 
(이번 파트에서 다룰 내용은 사실 사용자 정의 이미지를 만들때 일반적으로 사용하는 방식이 아니며 권장되는 방식도 아닙니다. 
그러나 도커 이미지의 레이어가 어떻게 쌓이는 지 확인하기에는 좋습니다.)

ubuntu 이미지에 apache2를 설치한 사용자 정의 이미지를 만들고, 그 이미지 기반으로 간단한 웹서버 역할을 하는 사용자 정의 이미지를 만들어 보겠습니다. 

우선 아래의 명령어를 통해서 ubuntu 이미지를 실행합니다.
```bash
docker run -it --rm ubuntu:18:04 
```

컨테이너에 들어오게 되면 아래 명령어로 apache2를 설치합니다.
```bash
apt-get update
apt-get install -y apache2
```

그리고 나서 `ctrl` + `p` + `q`를 눌러 컨테이너를 중지시키지 않고 빠져나옵니다. 

현재 컨테이너의 상태를 그대로 이미지로 정의할 수 있는 명령어가 있습니다. 바로 `docker commit`입니다. 
이 명령어를 통해서 apache2를 설치한 컨테이너의 현재 상태를 그대로 이미지로 만들어 보겠습니다.

```bash
docker commit -a "voyagerwoo" -m "install apache2" ${container_ID_or_name} ubuntu_apache:latest
```
`-a`는 이미지를 만든 사람의 정보를 추가하는 옵션이고, `-m`은 커밋 메시지를 기술하는 옵션입니다. 
그 뒤에는 컨테이너 ID 또는 이름을 입력하고 마지막으로 우리가 정의한 이미지 이름과 태그를 적습니다. 

아래 명령어로 진짜로 사용자 정의 이미지가 만들어졌는지 확인해봅시다.
```bash
docker images
```
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu_apache       latest              50e25f3f033d        14 minutes ago      207MB
ubuntu              18.04               1d9c17228a9e        3 days ago          86.7MB
```
사이즈가 많이 커진것을 확인할 수 있습니다. 이번에는 `ubuntu_apache` 이미지를 실행해서 apache2가 잘 동작하는지 확인해보겠습니다.
다음 명령어로 컨테이너를 실행합니다.
```bash
docker run -it --rm -p 8080:80 ubuntu_apache:latest
``` 
그리고 다음 명령어로 apache2를 실행합니다.
```bash
service apache2 start
```
문제가 없다면 브라우저에서 http://localhost:8080 주소를 입력하면 아파치 기본 웹 페이지를 확인할 수 있을것입니다. 

이번에는 새로운 웹페이지를 추가하고 그 추가한 컨테이너의 상태를 그대로 이미지로 만들어보겠습니다. 
아래 명령어로 `edu.html`이라는 웹 페이지를 apache2에 추가해보겠습니다.

```bash
cd /var/www/html/
echo "<h1>I-scream Edu</h1>" > edu.html
```
브라우저에서 http://localhost:8080/edu.html 주소에 접속해서 확인해봅니다. 이 웹페이지를 제공하는 웹서버를 그대로 도커 이미지로 만들어보겠습니다.
`ctrl` + `p` + `q`를 눌러 컨테이너를 중지시키지 않고 빠져나옵니다. 

```bash
docker commit -a "voyagerwoo" -m "add iscream-edu webpage" ${container_ID_or_name}  iscreamedu_apache:latest
```  
그럼 이제 실행중인 모든 컨테이너를 종료하고 `iscreamedu_apache` 이미지로 컨테이너를 실행하여 추가한 웹페이지가 잘 동작하는 지 확인해보겠습니다.

```bash
docker run -it --rm -p 8080:80 iscreamedu_apache:latest
```
```bash
service apache2 start
```
## 도커 이미지 구조
위에서 정의한 `ubuntu_apache`와 `ubuntu_apache`이미지를 통해서 도커 이미지가 어떤 구조인지 살펴보겠습니다. 

## 도커 파일이란
### 기본 명령어
### 이미지 빌드
## 도커 이미지 배포
### 도커허브에 이미지 배포
### Private Docker Registry에 이미지 배포
## 도커이미지 만들기 실습
### express 웹서버 이미지
### 스프링 웹서버 이미지
#### JAR
#### WAR

## 참고자료 
https://medium.com/@jessgreb01/digging-into-docker-layers-c22f948ed612
https://rampart81.github.io/post/docker_image/
