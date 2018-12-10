# Docker Images & Containers

## 목차


- 도커란?
    - 도커 엔진
    - 도커 플랫폼
- 도커 아키텍처
    - 도커 데몬
    - 도커 클라이언트
    - 도커 레지스트리
    - 도커 이미지
    - 도커 컨테이너
- 도커 설치
- 도커 허브 회원 가입
- 도커 이미지와 컨테이너
    - 이미지 내려받기
    - 컨테이너 실행
    - 웹서비스 실행
    - 도커 볼륨
    - 로깅
    - 네트워크
    - 리소스 제한
- 결론


## 도커란?

## 도커 아키텍처

## 도커 설치

## 도커 허브 회원가입

## 도커 이미지와 컨테이너 실습
이번에는 실제로 도커 이미지를 받아서 컨테이너로 실행하는 것을 실습합니다. 

### hello-world
`docker pull` 이란 명령어를 통해서 [`hello-world`](https://hub.docker.com/_/hello-world/)라는 이미지를 받아보겠습니다.
```
docker pull hello-world
```

`docker images` 또는 `docker image ls`라는 명령어를 통해서 확인해봅니다. `hello-world`라는 이미지는 docker 공부의 첫 시작을 알리는 도커 이미지 입니다. 표준 출력으로 간단한 인사말과 함께 어떻게 이런 내용이 출력되는지 순서를 출력합니다. 이미지로 부터 컨테이너를 실행해보겠습니다.

```
docker run -it hello-world
```

설치 과정에 문제 없다면 그 내용을 확인할 수 있습니다. `docker run`은 이미지로부터 컨테이너를 실행하는 명령어입니다. `-it` 옵션은 Foreground로 실행할 때 거의 꼭 사용하는 옵션입니다. `-i` 옵션과 `-t` 옵션이 합쳐진 옵션으로, `-i`는 현재 호스트와 컨테이너의 상호 입출력을 맞추고 `-t`는 TTY를 활성화해서 컨테이너에 터미널로 입력이 가능하게 합니다. 마지막 위치에는 도커 이미지 이름을 적어줍니다. `control` + `c`로 컨테이너를 종료합니다.

### tomcat

이번에는 자바개발자들에게 익숙한 톰캣을 Background로 실행해보겠습니다. 

```
docker run -d -p 8080:8080 --name my-cat tomcat
```
```
Unable to find image 'tomcat:latest' locally
latest: Pulling from library/tomcat
54f7e8ac135a: Already exists 
...생략
d1786b40ed4f: Pull complete 
Digest: sha256:d6f67aacce64010880a1e9ea6f0ace9fe9e20d39aae0489c8e88b4c14effe3a0
Status: Downloaded newer image for tomcat:latest
89c9a39c74e45aa58d0f589ef89932e2092352fcee46f53f03efa473187b8f6d
```
톰캣 이미지가 없기 때문에 알아서 tomcat 이미지를 가져옵니다. 즉 `docker run` 명령어에는 `docker pull`이 포함되어 있습니다. 정확히 `docker run`이라는 명령어에는 `docker pull`, `docker create`, `docker start`, `docker attach`(`-it` 옵션을 사용했다면)이 포함되어 있습니다. 그러나 개인적인 경험상 실제로 사용할 때는 저렇게 세분화된 명령어 보다는 `docker run`을 주로 사용하게 됩니다. 저 명령어들에 대한 자세한 내용은 docker 문서에 잘 정리되어 있습니다.


이미지가 다운로드가 완료되었다는 메시지가 출력된 후, 바로 어떤 해쉬값이 나옵니다. 저 해쉬값이 컨테이너의 ID입니다.

우선 브라우저에서 'http://localhost:8080'에 접속하여 톰캣이 잘 실행되고 있는지 확인해봅니다. 톰캣 페이지를 확인할 수 있습니다. `-d` 옵션은 Background로 실행하겠다는 의미입니다. `-p`(publish)는 웹서비스를 한다면 굉장히 중요한 옵션입니다. 호스트의 포트와 컨테이너의 포트를 바인딩해줍니다. 위의 옵션은 호스트의 8080 포트를 컨테이너의 8080 포트와 연결하겠다는 의미입니다. 그래서 브라우저에서 localhost의 8080 포트에 접속이 가능한 것입니다. `--name` 옵션은 컨테이너에 이름을 부여하는 옵션입니다. 만약 이 옵션을 설정하지 않으면 도커 데몬이 자동으로 이름을 생성하여 부여합니다. `docker rename` 이라는 명령어를 통해서 컨테이너의 이름을 바꿀 수 있습니다.

톰캣의 이번에는 로그를 확인해보겠습니다. 컨테이너의 ID 또는 컨테이너의 이름으로 컨테이너를 식별하여 로그를 출력해줍니다.

```
docker logs -f 89c
docker logs -f my-cat
```

익숙한 톰캣 로그를 확인할 수 있습니다. `-f` 옵션은 `tail`의 `-f` 옵션 처럼 프로그램이 종료되지 않고 기다리다고 로그에 추가되는 내용을 계속 출력해주는 옵션입니다. 재미있는 부분은 위의 컨테이너 ID로 로그를 확인하는 명령어에서 ID를 앞 세글자만 적은 것입니다. 만약 ID의 앞 세글자, 심지어 한글자일지라도 식별이 가능하다면 저렇게만 적어줘도 잘 동작합니다.

이번에는 Background로 실행중인 컨테이너를 종료해보겠습니다. 로그와 마찬가지로 컨테이너 ID, 컨테이너 이름으로 식별가능합니다.

```
docker stop 89c
docker stop my-cat
```

다시 한번 my-cat이라는 이름으로 컨테이너를 실행하면 실행되지 않습니다. 왜냐하면 아직 그 이름을 가진 컨테이너가 삭제되지는 않았기 때문입니다. 

```
docker run -d -p 8080:8080 --name my-cat tomcat
```
```
docker: Error response from daemon: Conflict. The container name "/my-cat" is already in use by container "ab50cc931c7a7d029f477d
a5381151dcc7cb8256fc143b1f112b7ede5f9f2f11". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
```
아래 명령어로 정지해있는 컨테이너들을 확인할 수 있습니다.
```
docker ps -a
docker container ls -a
```

같은 이름으로 다시 실행하려면 다음의 명령어로 컨테이너를 지워줘야 합니다. 

```
docker rm 89c
docker rm my-cat
```

아니면  실행할 때 `--rm` 이라는 옵션을 통해서 종료(stop)되면 자동으로 컨테이너를 삭제하도록 할 수 있습니다.

```
docker run -d --rm -p 8080:8080 --name my-cat tomcat
```

### MySql + WordPress
이번에는 MySql과 WordPress를 이용하여 웹사이트를 만들어보겠습니다. 우선 MySql을 실행해보겠습니다.

```
docker run -d --name wp-db \
-e MYSQL_ROOT_PASSWORD=password1 \
-e MYSQL_DATABASE=wp \
mysql:5.7
```
`-e` 옵션은 환경변수를 입력하는 옵션입니다. [docker hub](https://hub.docker.com)에서 제공하는 이미지들은 해당 이미지 설명 페이지에 관련 설정이나 환경변수에 대한 내용을 적어둡니다. mysql의 경우에는 https://hub.docker.com/_/mysql/ 이 링크에서 환경변수 정보를 확인할 수 있습니다.

다음 명령어를 통해서 컨테이너 내부로 들어가서 mysql cli 환경에 접속해봅니다. 

```
docker exec -it wp-db bash
```
```
mysql -u root -p wp
```

```
root@a9f5b0786995:/# mysql -u root -p wp   
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 5.7.24 MySQL Community Server (GPL)

생략...

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| wp                 |
+--------------------+
5 rows in set (0.00 sec)
```

잘 되는 것을 확인할 수 있습니다. `docker exec` 명령어는 컨테이너 내부에서 명령어를 실행한 뒤 결과값을 반환받을 수 있는 명령어입니다. 그러나 주로 -it 옵션을 추가하고 bash를 실행하여 내부에 접속한 것 처럼 사용하는 경우가 많습니다. 지금도 bash를 통해서 컨테이너 내부에 접속하고 mysql cli 환경에 접속해 보았습니다. 

이번에는 WordPress를 실행해보도록 하겠습니다. 

```
docker run -d --name wp \
-e WORDPRESS_DB_PASSWORD=password1 \
--link wp-db:mysql \
-p 8080:80 \
wordpress
```

이미지를 다운받고 실행이 됩니다. `--link` 옵션을 통해서 mysql 컨테이너와 연결이 되었습니다. `--link`옵션은 연결할 컨테이너 이름(wp-db)을 오른쪽에 두고 왼쪽에는 연결할 호스트 이름(mysql)을 입력하여 컨테이너간 연결합니다. 현재 `--link` 옵션은 [legacy feature](https://docs.docker.com/network/links/)로 곧 삭제될 수 있는 기능이라고 합니다. 

추천하는 방식은 사용자가 bridge network를 만들고 거기에 연결시키는 것을 추천합니다. 

```
docker network create wp-network
docker network ls
docker network connect wp-network wp-db

docker run -d --name wp \
-e WORDPRESS_DB_PASSWORD=password1 \
-e WORDPRESS_DB_HOST=wp-db \
--network wp-network \
-p 8080:80 \
wordpress
```

브라우저에 접속해서 WordPress 설정을 해봅니다. 그리고 다시 wp-db에 접속해서 테이블을 확인해보면 WordPress가 테이블을 만든것을 확인할 수 있습니다.

#### 상태가 있는 서비스

## 결론
