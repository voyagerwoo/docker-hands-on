# Docker Images & Containers

## 목차

- 도커란?
    - 도커 엔진
- 도커 아키텍처
    - 도커 데몬
    - 도커 클라이언트
    - 도커 레지스트리
    - 도커 오브젝트
        - 도커 이미지
        - 도커 컨테이너
- 도커 설치
- 도커 허브 회원 가입
- 도커 이미지와 컨테이너 실습
    - hello-world
    - tomcat
    - MySql & Wordpress
    - 연습문제 1 : 도커 볼륨을 이용하여 tomcat에 war 배포
    - 연습문제 2 : 도커를 이용하여 master-slave 구조의 jenkins 구축
- 정리


## 도커란?
Docker는 응용 프로그램을 개발, 배포 및 실행하기 위한 개방형 플랫폼입니다.

Docker는 응용 프로그램을 격리된 컨테이너 단위로 관리하여 인프라 의존성에 대한 걱정없이 실행하고 제거할 수 있습니다. 

또한 기존에 쓰이던 가상화 방법인 하이퍼바이저 기반의 가상 머신과는 달리 도커 컨테이너는 리눅스 자체기능을 이용해서 프로세스 단위의 격리된 환경을 만들기 때문에 성능의 손실이 거의 없습니다. 

<img src="https://docs.docker.com/images/Container%402x.png" width="400">
<img src="https://docs.docker.com/images/VM%402x.png" width="400"> 

정리하면, 격리되어서 실행가능하지만 성능 손실이 거의 없기 때문에 도커만 설치되어 있다면 현재 주어진 컴퓨팅 자원 위에서 깔끔하고, 효율적인 운영이 가능해집니다. 

### 도커 엔진
우리가 흔히 말하는 도커는 일반적으로 도커 엔진을 의미합니다. 도커를 설치하고 실행하면 `dockerd`라는 데몬 프로그램이 서버로서 실행되며, REST API, CLI(`docker`)도구들이 클라이언트가 되어서 도커 데몬에게 작업을 지시합니다.

![](https://docs.docker.com/engine/images/engine-components-flow.png)

## 도커 아키텍처
좀더 자세히 도커 아키텍처에 대해서 알아보겠습니다. 

<img src="https://docs.docker.com/engine/images/architecture.svg" width="600">

### 도커 데몬
도커 데몬 (`dockerd`)은 도커 API 요청을 수신하고 이미지, 컨테이너, 네트워크 및 볼륨과 같은 도커 객체를 관리합니다. 데몬은 도커 서비스를 관리하기 위해 다른 데몬과 통신 할 수도 있습니다.

### 도커 클라이언트
도커 클라이언트 (`docker`)는 많은 도커 사용자가 Docker와 상호 작용하는 주요 방법입니다. 와 같은 명령을 사용 `docker run`하면 클라이언트가 이 명령을 전송하여 `dockerd`를 수행합니다. 이 `docker`명령은 도커 API를 사용합니다. 도커 클라이언트는 둘 이상의 데몬과 통신 할 수 있습니다.

### 도커 레지스트리
도커 레지스트리 는 도커 이미지를 저장합니다. 도커 허브는 누구나 사용할 수 있는 공용 레지스트리이며 도커는 기본적으로 도커 허브에서 이미지를 찾도록 구성되어 있습니다. 자신의 개인 레지스트리를 실행할 수도 있습니다. DDC(Docker Datacenter)을 사용하는 경우 DTR(Docker Trusted Registry)이 포함됩니다.

`docker pull` 또는 `docker run` 명령을 사용하면 구성된 레지스트리에서 필요한 이미지를 가져옵니다. `docker push` 명령을 사용하면 이미지가 구성된 레지스트리로 푸시됩니다.

### 도커 오브젝트

#### 도커 이미지
도커 컨테이너를 만들기 위한(실행하기 위한) 읽기 전용 템플릿입니다. 가상머신을 생성할 때 사용하는 iso 파일과 비슷한 개념입니다. 이미지는 여러개의 계층으로 된 바이너리 파일로 존재하며, 컨테이너를 생성하고 실행할 때 읽기 전용으로 사용됩니다. 이미지는 쉽게 내려받을 수 있고, 내려받은 이미지에 계층을 더 씌워서 새로운 이미지를 만들 수도 있습니다.

이미지 이름은 다음과 같이 구성되어있습니다.

```
# 일반 이미지
{REPOSITORY_NAME}/{IMAGE_NAME}:{IMAGE_TAG}
jenkins/jenkins:lts
957582603404.dkr.ecr.ap-northeast-2.amazonaws.com/my-service:1.1.0

# 도커 허브 공식 이미지
{IMAGE_NAME}:{IMAGE_TAG}
openjdk:8-alpine
```
- REPOSITORY_NAME : 레파지토리 이름은 이미지가 저정된 장소를 의미합니다. 레파지토리 이름이 명시되지 않은 경우에는 도커 허브의 공식(Official) 이미지를 뜻합니다.
- IMAGE_NAME : 도커 이미지의 이름입니다. 
- IMAGE_TAG : 이미지의 버전 관리 혹은 Revision 관리에 사용됩니다. 생략하게 되면 latest 태그로 인식합니다.

##### 도커 레지스트리 vs 도커 레파지토리
- 도커 레지스트리(Docker Registry) : 도커 이미지를 저장하는 서비스, 에를 들어 도커 허브, Quay, ECR 등 실제 이미지를 저장하고 관리하는 서비스.
- 도커 레파지토리(Docker Repository) : 이름이 같지만 태그가 다른 도커 이미지의 논리적 모음


#### 도커 컨테이너
도커 컨테이너는 도커 이미지의 실행가능한 인스턴스 입니다. 컨테이너를 생성하게 되면 해당 이미지의 이미지에서 정의한 파일 시스템과 파일들, 그리고 격리된 시스템 자원 및 네트워크를 사용할 수 있는 독립된 공간이 생성됩니다. 

컨테이너는 이미지를 읽기 전용으로 사용하되 이미지에서 변경된 사항만 컨테이너 계층에 저장하므로 컨테이너에서의 변경은 이미지에 영향을 주지 않습니다. 


## 도커 설치
- Windows : https://docs.docker.com/docker-for-windows/install/
- Mac : https://docs.docker.com/docker-for-mac/install/
- centOS : https://docs.docker.com/install/linux/docker-ce/centos/

## 도커 허브 회원가입
- https://hub.docker.com/

도커 허브(Docker Hub)는 클라우드 기반의 도커 레지스트리 서비스입니다. 코드 저장소에 연결하고, 이미지를 빌드하고 테스트할 수 있습니다. 

기본적으로 도커의 공식(Official) 이미지들이 여기에 저장되어 있습니다. 퍼블릭 레파지토리의 경우에는 무료이고 프라이빗 레파지토리의 경우에는 과금을 합니다. 

## 도커 이미지와 컨테이너 실습
이번에는 실제로 도커 이미지를 받아서 컨테이너로 실행하는 것을 실습합니다. 

### hello-world
`docker pull` 이란 명령어를 통해서 [`hello-world`](https://hub.docker.com/_/hello-world/)라는 이미지를 받아보겠습니다.
```
docker pull hello-world
```

`docker images` 또는 `docker image ls`라는 명령어를 통해서 확인해봅니다. `hello-world`라는 이미지는 docker 공부의 첫 시작을 알리는 도커 이미지 입니다. 표준 출력으로 간단한 인사말과 함께 어떻게 이런 내용이 출력되는지 순서를 출력합니다. 이미지로 부터 컨테이너를 실행해보겠습니다.

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

우선 브라우저에서 `http://localhost:8080` 에 접속하여 톰캣이 잘 실행되고 있는지 확인해봅니다. 톰캣 페이지를 확인할 수 있습니다. `-d` 옵션은 Background로 실행하겠다는 의미입니다. `-p`(publish)는 웹서비스를 한다면 굉장히 중요한 옵션입니다. 호스트의 포트와 컨테이너의 포트를 바인딩해줍니다. 위의 옵션은 호스트의 8080 포트를 컨테이너의 8080 포트와 연결하겠다는 의미입니다. 그래서 브라우저에서 localhost의 8080 포트에 접속이 가능한 것입니다. `--name` 옵션은 컨테이너에 이름을 부여하는 옵션입니다. 만약 이 옵션을 설정하지 않으면 도커 데몬이 자동으로 이름을 생성하여 부여합니다. `docker rename` 이라는 명령어를 통해서 컨테이너의 이름을 바꿀 수 있습니다.

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
-e WORDPRESS_DB_NAME=wp \
--link wp-db:mysql \
-p 8080:80 \
wordpress
```

이미지를 다운받고 실행이 됩니다. `--link` 옵션을 통해서 mysql 컨테이너와 연결이 되었습니다. `--link`옵션은 연결할 컨테이너 이름(wp-db)을 오른쪽에 두고 왼쪽에는 연결할 호스트 이름(mysql)을 입력하여 컨테이너간 연결합니다. 아래 명령어로 워드프레스 컨테이너에 들어가서 `hosts` 파일을 확인해 보면 다음과 같이 `172.17.0.2 mysql f00f5a500a84 wp-db` mysql 호스트가 설정된 것을 보실 수 있습니다.
```
$ docker exec -it wp bash
root@e0b4dceb74be:~# cat /etc/hosts
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.2      mysql f00f5a500a84 wp-db
172.17.0.3      e0b4dceb74be
```

현재 `--link` 옵션은 [legacy feature](https://docs.docker.com/network/links/)로 곧 삭제될 수 있는 기능이라고 합니다. 

추천하는 방식은 사용자가 bridge network를 만들고 만들어진 네트워크에 연결시키는 것입니다.

```
docker network create wp-network
docker network ls
docker network connect wp-network wp-db

docker run -d --name wp \
-e WORDPRESS_DB_PASSWORD=password1 \
-e WORDPRESS_DB_HOST=wp-db \
-e WORDPRESS_DB_NAME=wp \
--network wp-network \
-p 8080:80 \
wordpress
```

이렇게 하게 되면 `wp` 컨테이너 안에 들어가서 호스트 파일을 봐도 정보가 없습니다. 대신 아래 명령어를 통해서 새로 만든 브릿지 네트워크에 컨테이너들이 어떻게 설정되어 있는지 확인할 수 있습니다.

```
$ docker network inspect wp-network
[
    {
        "Name": "wp-network",
        "Id": "a8236461889218d9432f79bfa4f145331c565d15194f62b45a57e440f12d5e33",
        "Created": "2018-12-12T07:56:51.7711884Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.19.0.0/16",
                    "Gateway": "172.19.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "5866c3a757a25900866133380234574626b92ec4faf6c03f7f85ddec19fd6997": {
                "Name": "wp",
                "EndpointID": "4fdccfbdd36cc361991e7b12a5946c786ccbe2e9c3eadac2fbdfd313878ccbae",
                "MacAddress": "02:42:ac:13:00:03",
                "IPv4Address": "172.19.0.3/16",
                "IPv6Address": ""
            },
            "f00f5a500a8430ee8fc8068a12487ba133c7fb5fafcdfd6c350cd4898492b2db": {
                "Name": "wp-db",
                "EndpointID": "a7448536555708ce470aad1415ba2ea28f63e6d498c0fed33e73d2914ed6d663",
                "MacAddress": "02:42:ac:13:00:02",
                "IPv4Address": "172.19.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
```

브라우저에 접속해서 WordPress 설정을 해봅니다. 그리고 다시 wp-db에 접속해서 테이블을 확인해보면 WordPress가 테이블을 만든것을 확인할 수 있습니다.

#### 상태가 있는 서비스

WordPress 설정을 한 이후에 만약 MySql 컨테이너를 내리면(종료하면) 어떻게 될까요? 당연히 WordPress 서비스는 제대로 동작하지 않고 DB에 저장된 데이터들은 모두 삭제됩니다. 컨테이너의 시작과 종료같은 생명주기와 상관없이 DB의 데이터를 유지하고 싶다면 어떻게 해야할까요? 그 해답은 Volume입니다. 

컨테이너에 볼륨을 공유하는 방법은 세가지가 있습니다. 
- 호스트의 파일이나 디렉토리를 컨테이너와 공유
- 볼륨 컨테이너를 통해서 호스트와 볼륨 컨테이너간에 공유하고, 볼륨 컨테이너와 다른 컨테이너간에 공유
- 도커 볼륨을 이용한 공유

이번에는 간단하게 호스트의 디렉토리와 볼륨을 공유해보겠습니다. 

```
docker network create wp-network

docker run -d --name wp-db \
--network wp-network \
-e MYSQL_ROOT_PASSWORD=password1 \
-e MYSQL_DATABASE=wp \
-v `pwd`/wp_db:/var/lib/mysql \
mysql:5.7

docker run -d --name wp \
--network wp-network \
-e WORDPRESS_DB_PASSWORD=password1 \
-e WORDPRESS_DB_HOST=wp-db \
-e WORDPRESS_DB_NAME=wp \
-p 8080:80 \
wordpress
```

다시 한번 브라우저를 통해서 설정을 마칩니다. 이번에는 mysql 만 종료했다가 다시 실행해보겠습니다. 

```
docker rm -f wp-db

docker run -d --name wp-db \
--network wp-network \
-e MYSQL_ROOT_PASSWORD=password1 \
-e MYSQL_DATABASE=wp \
-v `pwd`/wp_db:/var/lib/mysql \
mysql:5.7
```

잘 동작하는 것을 확인했다면 볼륨이 잘 공유되고 있는 것입니다. 볼륨은 `-v` 옵션에 `{호스트 디렉토리 또는 파일}:{컨테이너 디렉토리 또는 파일}` 이렇게 설정해주면 됩니다. 만약 호스트 디렉토리가 없다면 자동으로 생성합니다. `wp-db` 컨테이너의 한번 확인해보겠습니다. 컨테이너를 실행했던 위치에서 `ls` 명령어를 통해서 볼륨에 어떤 파일들이 저장되어있나 확인해봅니다. 

```
$ ls wp_db
auto.cnf         client-key.pem  ib_logfile1         private_key.pem  sys
ca-key.pem       ib_buffer_pool  ibtmp1              public_key.pem   wordpress
ca.pem           ibdata1         mysql               server-cert.pem  wp
client-cert.pem  ib_logfile0     performance_schema  server-key.pem
```

이번에는 도커 볼륨을 생성해서 볼륨을 공유해보겠습니다. 

```
docker volume create wp-db-volume
```

아래 명령어를 통해서 생성된 볼륨을 확인합니다. 볼륨을 설정할 때 여러 종류의 스토리지 백앤드를 사용할 수 있습니다. 예컨데 아마존의 스토리지에 저장할 수도 있습니다. 그러나 여기서는 기본적으로 제공하는 드라이버인 local을 사용할 예정입니다.
```
docker volume ls
```

이제 도커 볼륨을 통해 컨테이너와 데이터를 공유하도록 해보겠습니다. 
 
 ```
docker run -d --name wp-db \
--network wp-network \
-e MYSQL_ROOT_PASSWORD=password1 \
-e MYSQL_DATABASE=wp \
-v wp-db-volume:/var/lib/mysql \
mysql:5.7

docker run -d --name wp \
--network wp-network \
-e WORDPRESS_DB_PASSWORD=password1 \
-e WORDPRESS_DB_HOST=wp-db \
-e WORDPRESS_DB_NAME=wp \
-p 8080:80 \
wordpress
```

DB를 종료했다가 다시 실행해도 잘 동작하는 것을 확인했다면 도커 볼륨으로 컨테이너와 볼륨 공유가 성공적으로 이루어졌다는 뜻입니다. 아래 명령어를 통해서 볼륨 정보를 출력해보겠습니다. 도커 볼륨도 결국엔 어떤 파일 혹은 디렉토리입니다. 실제 어디에 저장되어 있는지 확인할 수 있습니다.

```
$ docker inspect --type volume wp-db-volume
[
    {
        "CreatedAt": "2018-12-11T17:30:14Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/wp-db-volume/_data",
        "Name": "wp-db-volume",
        "Options": {},
        "Scope": "local"
    }
]

$ sudo ls /var/lib/docker/volumes/wp-db-volume/_data
auto.cnf         client-key.pem  ib_logfile1         private_key.pem  sys
ca-key.pem       ib_buffer_pool  ibtmp1              public_key.pem   wordpress
ca.pem           ibdata1         mysql               server-cert.pem  wp
client-cert.pem  ib_logfile0     performance_schema  server-key.pem
```

도커 사용하지 않는 볼륨은 다음 명령어로 삭제 가능합니다.

```
docker volume prune
```


### 연습문제 1 : 도커 볼륨을 이용하여 tomcat에 war 배포

### 연습문제 2 : 도커를 이용하여 master-slave 구조의 jenkins 구축

## 정리
이번 시간에는 도커에 대한 기본적인 소개와 실습을 통해서 도커 이미지를 다운받고 컨테이너로 실행하는 부분에 대해서 맛보기를 해보았습니다. 도커만 설치되어 있다면 프로그램을 딱히 설치할 필요 없이 실행해볼 수 있었습니다. 그리고 가상 머신을 만들고 실행시키는 것에 비해서 매우 빠른 실행 속도를 보여줬습니다. 

오늘 배운 내용은 어떤 상황에서 유용하게 써먹을 수 있을까요? 

어떤 새로운 도구를 시험해보고자 할 때 굉장히 유용하게 사용할 수 있습니다. 예컨데 흔히 ELK라고 불리우는 Elastic Stack을 POC(Proof of concept) 할 때, 컴퓨터에 설치없이 이미지를 다운받아서 테스트 해볼 수 있습니다.

다음 PART 2에서는 이미지를 직접 만들고 관리하는 내용에 대해서 살펴보겠습니다.


## 참고 자료
- [시작하세요 도커 - 용찬호 저](https://book.naver.com/bookdb/book_detail.nhn?bid=11884948)
- [Docker docs - Docker Orientation](https://docs.docker.com/get-started/part1)
- [Docker docs - Docker Overview](https://docs.docker.com/engine/docker-overview/#the-docker-platform)
