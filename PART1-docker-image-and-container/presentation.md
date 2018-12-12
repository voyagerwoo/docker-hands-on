# Docker Images & Containers
## 아이스크림에듀 기반개발팀 우여명
---

## 목차

- 도커란?
- 도커 아키텍처
- 도커 설치
- 도커 허브 회원 가입
- 도커 이미지와 컨테이너 실습
- 정리

---


## 도커란?
도커는 응용 프로그램을 개발, 배포 및 실행하기 위한 
개방형 플랫폼입니다.

도커는 응용 프로그램을 격리된 컨테이너 단위로 관리하여 
인프라 의존성에 대한 걱정없이 실행하고 제거할 수 있습니다. 

---
## 가상머신과 비교

기존에 쓰이던 가상화 방법인 하이퍼바이저 기반의 가상 머신과는 달리 도커 컨테이너는 리눅스 자체기능을 이용해서 프로세스 단위의 격리된 환경을 만들기 때문에 성능의 손실이 거의 없습니다. 

<img src="https://docs.docker.com/images/Container%402x.png" width="350">
<img src="https://docs.docker.com/images/VM%402x.png" width="350"> 

---
## 도커란?

정리하면, 격리되어서 실행가능하지만, 
성능 손실이 거의 없기 때문에 도커만 설치되어 있다면 
현재 주어진 컴퓨팅 자원 위에서 깔끔하고, 
효율적인 운영이 가능해집니다. 

---

### 도커 엔진
우리가 흔히 말하는 도커는 일반적으로 도커 엔진을 의미합니다. 
도커를 설치하고 실행하면 `dockerd`라는 데몬 프로그램이 서버로서 실행되며, REST API, CLI(`docker`)도구들이 클라이언트가 되어서
도커 데몬에게 작업을 지시합니다.

![](https://docs.docker.com/engine/images/engine-components-flow.png)

---

## 도커 아키텍처
좀더 자세히 도커 아키텍처에 대해서 알아보겠습니다. 

<img src="https://docs.docker.com/engine/images/architecture.svg" width="600">

---

### 도커 데몬
도커 데몬 (`dockerd`)은 도커 API 요청을 수신하고 이미지, 컨테이너, 네트워크 및 볼륨과 같은 도커 객체를 관리합니다. 

데몬은 도커 서비스를 관리하기 위해 다른 데몬과 통신 가능합니다.

--- 

### 도커 클라이언트
도커 클라이언트 (`docker`)는 많은 도커 사용자가 Docker와 상호 작용하는 주요 방법입니다. 와 같은 명령을 사용 `docker run`하면 클라이언트가 이 명령을 전송하여 `dockerd`를 수행합니다. 이 `docker`명령은 도커 API를 사용합니다. 도커 클라이언트는 둘 이상의 데몬과 통신 할 수 있습니다.

---

### 도커 레지스트리
도커 레지스트리는 도커 이미지를 저장합니다. 도커 허브는 누구나 사용할 수있는 공용 레지스트리이며 도커는 기본적으로 도커 허브에서 이미지를 찾도록 구성되어 있습니다. 자신의 개인 레지스트리를 실행할 수도 있습니다. DDC(Docker Datacenter)을 사용하는 경우 DTR(Docker Trusted Registry)이 포함됩니다.

`docker pull` 또는 `docker run` 명령을 사용하면 구성된 레지스트리에서 필요한 이미지를 가져옵니다. `docker push` 명령을 사용하면 이미지가 구성된 레지스트리로 푸시됩니다.

---

#### 도커 오브젝트 - 도커 이미지
도커 컨테이너를 만들기(실행하기) 위한 읽기 전용 템플릿입니다. 
가상머신을 생성할 때 사용하는 iso 파일과 비슷한 개념입니다. 

이미지는 여러개의 계층으로 된 바이너리 파일로 존재하며, 
컨테이너를 생성하고 실행할 때 읽기 전용으로 사용됩니다. 
이미지는 쉽게 내려받을 수 있고, 내려받은 이미지에 계층을 
덧 씌워서 새로운 이미지를 만들 수도 있습니다.

---

#### 도커 이미지 구성

<small>
  
```
# 일반 이미지
{REPOSITORY_NAME}/{IMAGE_NAME}:{IMAGE_TAG}
jenkins/jenkins:lts
957582603404.dkr.ecr.ap-northeast-2.amazonaws.com/my-service:1.1.0

# 도커 허브 공식 이미지
{IMAGE_NAME}:{IMAGE_TAG}
openjdk:8-alpine
```



- REPOSITORY_NAME : 레파지토리 이름은 이미지가 저정된 장소로 레파지토리 이름이 명시되지 않은 경우에는 도커 허브의 공식(Official) 이미지를 의미
- IMAGE_NAME : 도커 이미지의 이름 
- IMAGE_TAG : 이미지의 버전 관리 혹은 Revision 관리에 사용, 생략하게 되면 latest 태그로 인식

</small>

--- 

##### 도커 레지스트리 vs 도커 레파지토리
- 도커 레지스트리(Docker Registry) : 도커 이미지를 저장하는 서비스, 에를 들어 도커 허브, Quay, ECR 등 실제 이미지를 저장하고 관리하는 서비스.
- 도커 레파지토리(Docker Repository) : 이름이 같지만 태그가 다른 도커 이미지의 논리적 모음

--- 

#### 도커 컨테이너
도커 컨테이너는 도커 이미지의 실행가능한 인스턴스 입니다. 컨테이너를 생성하게 되면 해당 이미지의 이미지에서 정의한 파일 시스템과 파일들, 그리고 격리된 시스템 자원 및 네트워크를 사용할 수 있는 독립된 공간이 생성됩니다. 

컨테이너는 이미지를 읽기 전용으로 사용하되 이미지에서 변경된 사항만 컨테이너 계층에 저장하므로 컨테이너에서의 변경은 이미지에 영향을 주지 않습니다. 

---

## 도커 설치
- Windows : https://docs.docker.com/docker-for-windows/install/
- Mac : https://docs.docker.com/docker-for-mac/install/
- centOS : https://docs.docker.com/install/linux/docker-ce/centos/

---

## 도커 허브 회원가입
- https://hub.docker.com/

도커 허브(Docker Hub)는 클라우드 기반의 도커 레지스트리 서비스입니다. 코드 저장소에 연결하고, 이미지를 빌드하고 테스트할 수 있습니다. 

기본적으로 도커의 공식(Official) 이미지들이 여기에 저장되어 있습니다. 퍼블릭 레파지토리의 경우에는 무료이고 프라이빗 레파지토리의 경우에는 과금을 합니다.

---

## 도커 이미지와 컨테이너 실습

[실습 링크](https://github.com/voyagerwoo/docker-hands-on/tree/master/PART1-docker-image-and-container#%EB%8F%84%EC%BB%A4-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%99%80-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%8B%A4%EC%8A%B5)