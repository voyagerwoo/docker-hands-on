# Build Docker Image

## 목차
- `docker commit` 명령어로 사용자 정의 이미지 만들기
- 도커 이미지 구조
- `Dockerfile`로 사용자 정의 이미지 만들기
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
docker run -it --rm --name ubuntu_apache ubuntu:18:04 
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
docker commit -a "voyagerwoo" -m "install apache2" ubuntu_apache ubuntu_apache:latest
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
docker run -it --rm -p 8080:80 --name iscreamedu_apache ubuntu_apache:latest
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
docker commit -a "voyagerwoo" -m "add iscream-edu webpage" iscreamedu_apache iscreamedu_apache:latest
```  
그럼 이제 실행중인 모든 컨테이너를 종료하고 `iscreamedu_apache` 이미지로 컨테이너를 실행하여 추가한 웹페이지가 잘 동작하는 지 확인해보겠습니다.

```bash
docker run -it --rm -p 8080:80 iscreamedu_apache:latest
```
```bash
service apache2 start
```

![](./images/iscreamedu_apache.png)

## 도커 이미지 구조
위에서 정의한 `ubuntu_apache`와 `ubuntu_apache`이미지를 통해서 도커 이미지가 어떤 구조인지 살펴보겠습니다. 
`docker history` 라는 명령어를 통해서 어떻게 이미지가 구성되어있는지 살펴보겠습니다. 우선은 `ubuntu` 이미지부터 살펴보겠습니다.

```bash
docker history ubuntu:18.04
```
```
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
1d9c17228a9e        4 days ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           4 days ago          /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           4 days ago          /bin/sh -c rm -rf /var/lib/apt/lists/*          0B                  
<missing>           4 days ago          /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           4 days ago          /bin/sh -c #(nop) ADD file:c0f17c7189fc11b6a…   86.7MB
```

아래에서부터 총 5개의 레이어를 통해서 도커 이미지가 만들어졌습니다. 나중에 자세히 살펴보겠지만 명령어들을 통해서 이미지 레이어가 하나하나 쌓였군요.

그럼 이번에는 ubuntu:18.04라는 이미지를 기반으로 만든 `ubuntu_apache`를 살펴보겠습니다. 
```bash
docker history ubuntu_apache
```
```
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
50e25f3f033d        23 hours ago        /bin/bash                                       120MB               install apache2
1d9c17228a9e        4 days ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           4 days ago          /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           4 days ago          /bin/sh -c rm -rf /var/lib/apt/lists/*          0B                  
<missing>           4 days ago          /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           4 days ago          /bin/sh -c #(nop) ADD file:c0f17c7189fc11b6a…   86.7MB
```
아래부터 살펴보면 (이쯤이면 당연하게도) 우분투와 동일한 레이어 위에 아파치를 설치한 레이어가 새로 생겼네요. 
어떻게 우분투와 동일한 레이어인지 확인하는 방법은 이미지의 ID를 보는 것입니다. `1d9c17228a9e` 이미지 아이디가 같네요!

그럼 마지막으로 `ubuntu_apache` 이미지위에서 `edu.html`파일을 추가한 iscreamedu_apache 이미지를 살펴보겠습니다.

```bash
docker history iscreamedu_apache
```
```
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
8cd359918f28        22 hours ago        /bin/bash                                       905B                add iscream-edu webpage
50e25f3f033d        23 hours ago        /bin/bash                                       120MB               install apache2
1d9c17228a9e        4 days ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           4 days ago          /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           4 days ago          /bin/sh -c rm -rf /var/lib/apt/lists/*          0B                  
<missing>           4 days ago          /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           4 days ago          /bin/sh -c #(nop) ADD file:c0f17c7189fc11b6a…   86.7MB  
```
웹페이지를 추가하기 전 레이어의 아이디가 `50e25f3f033d`로 ubuntu_apache 이미지와 같군요.

위의 이미지의 크기는 각각 207MB, 207MB, 86.7MB 입니다. 그럼 이 이미지들이 디스크에 207 + 207 + 86.7 = 500.7MB 용량을 차지하고 있을까요?   
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
iscreamedu_apache   latest              8cd359918f28        22 hours ago        207MB
ubuntu_apache       latest              50e25f3f033d        23 hours ago        207MB
ubuntu              18.04               1d9c17228a9e        4 days ago          86.7MB
```

(이쯤되면 당연하게도) 아닙니다. 기존 이미지에서 변경사항만 한층 한층 저장하고 새로운 이미지는 기존 레이어를 포함해서 만들게 됩니다. 
그래서 사실 207MB 만 차지하고 있습니다.


## `Dockerfile`로 사용자 정의 이미지 만들기
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
