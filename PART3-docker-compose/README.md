# Docker Compose

## 목차
- 여러 컨테이너로 구성된 EFK 스택 실행하기
- 도커 컴포즈를 이용해서 EFK 스택 실행하기
- 도커 컴포즈 읽어보기
- 도커 컴포즈 유의사항
  - 컨테이너간 의존관계 이슈
- 기타 유의사항
  - 도커 커뮤니티 에디션에서는 멀티 컨테이너 로깅 드라이버를 지원하지 않음
- 도커 컴포즈 유스케이스
    - 도커 컴포즈를 이용하여 통합 테스트 환경 구축하기 
    - 단일 호스트 배포
    - 도커 컴포즈를 이용하여 개발환경 구축하기

## 준비
```bash
git clone https://github.com/voyagerwoo/docker-hands-on.git
cd docker-hands-on/PART3-docker-compose
```

## 여러 컨테이너로 구성된 EFK 스택 실행하기

### 네트워크 만들기
```bash
docker network create es-net
```

### ElasticSearch

```bash
docker run -d --name elasticsearch --net es-net -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.2.0
docker logs -f elasticsearch
```

### Kibana
```bash
docker run -d --rm --name kibana --net es-net -p 5601:5601 kibana:7.2.0
docker logs -f kibana
```

### Fluentd

```bash
docker run -d --name fluentd --net es-net \
    -p 24224:24224 -p 24224:24224/udp \
    -v `pwd`/fluentd/etc:/fluentd/etc voyagerwoo/fluentd-es:v1.6-1
docker logs -f fluentd
```


- 참고: fluentd with elasticsearch pluging Dockerfile
```
FROM fluent/fluentd:v1.6-1

USER root

RUN apk add --no-cache --update --virtual .build-deps \
        sudo build-base ruby-dev \
 && sudo gem install fluent-plugin-elasticsearch \
 && sudo gem sources --clear-all \
 && apk del .build-deps \
 && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem


USER fluent
```

- 참고: fluent.conf
```
<source>
type forward
port 24224
bind 0.0.0.0
</source>


<match *.**>
  @type copy
  <store>
    @type elasticsearch
    host elasticsearch
    port 9200
    logstash_format true
    logstash_prefix fluentd
    logstash_dateformat %Y%m%d
    include_tag_key true
    type_name access_log
    tag_key @log_name
    flush_interval 1s
  </store>
  <store>
    @type stdout
  </store>
</match>
```


### Application
```
docker run -d --rm --name hello-world --net es-net -p 8080:8080 \
    --log-driver=fluentd \
    --log-opt fluentd-address=localhost:24224 \
    --log-opt tag="hello.{.ID}}" \
    voyagerwoo/hello-world:v1
```
- 참고링크 : https://github.com/voyagerwoo/springboot-hello-world


## 도커 컴포즈를 이용해서 EFK 스택 실행하기

### 이전에 실습했던 컨테이너 삭제
```
docker rm -f elasticsearch kibana fluentd hello-world
```

### 도커 컴포즈 설치
- https://docs.docker.com/compose/install/

### 도커 컴포즈 실행
```bash
cd efk-stack
docker-compose up
```

- 백그라운드 실행
```bash
docker-compose up -d

```

### 컨테이너 및 네트워크 확인하기

```bash
docker ps
```

```
CONTAINER ID        IMAGE                          COMMAND                  NAMES
76cf4c05b6fe        voyagerwoo/hello-world:v1      "/usr/bin/java -jar …"   efk-stack_hello-world_1
207cf17f9fb8        kibana:7.2.0                   "/usr/local/bin/kiba…"   efk-stack_kibana_1
f71bb590490f        voyagerwoo/fluentd-es:v1.6-1   "tini -- /bin/entryp…"   efk-stack_fluentd_1
4cdc7b69d65b        elasticsearch:7.2.0            "/usr/local/bin/dock…"   efk-stack_elasticsearch_1
```

```bash
docker network ls
```

```
NETWORK ID          NAME                DRIVER              SCOPE
9c00163c245a        efk-stack_es-net    bridge              local
e360a555901b        es-net              bridge              local
```

- 네이밍 규칙

  {폴더명}\_{서비스명}\_{번호}

### 로그 보기
```bash
docker-compose logs -f
```

- 서비스별 로그보기
```bash
# docker-compose logs -f {서비스명}
docker-compose logs -f elasticsearch
```

### 도커 컴포즈 종료 및 삭제
- 컨테이너 정지 및 재시작
```bash
docker-compose stop
docker-compose start
```

- 컨테이너 및 스택 삭제
```bash
docker-compose down
```



## 도커 컴포즈 읽어보기

- docker-compose.yml
```
version: '3'
services:
  elasticsearch:
    image: elasticsearch:7.2.0
    environment:
      discovery.type: single-node
    networks:
      - es-net
    ports:
      - "9200:9200" 
      - "9300:9300"
  kibana:
    image: kibana:7.2.0
    networks:
      - es-net
    ports:
      - 5601:5601
    depends_on:
      - elasticsearch
  fluentd:
    image: voyagerwoo/fluentd-es:v1.6-1
    networks:
      - es-net
    ports:
      - "24224:24224"
      - "24224:24224/udp"
    volumes:
      - ./fluentd/etc:/fluentd/etc
    depends_on:
      - elasticsearch
  hello-world:
    image: voyagerwoo/hello-world:v1
    networks:
      - es-net
    ports:
      - 8080:8080
    logging:
      driver: "fluentd"
      options:
        fluentd-address: localhost:24224
        tag: "hello.{.ID}}"
    depends_on:
      - fluentd

networks:
  es-net:
    driver: bridge
    
```

- 참고: https://docs.docker.com/compose/compose-file

## 도커 컴포즈 유의사항
### 컨테이너 간의 의존관계에 대한 이슈
> ***depends_on***:
>
> - depends_on does not wait for db and redis to be “ready” before starting web - only until they have been started. If you need to wait for a service to be ready, see Controlling startup order for more on this problem and strategies for solving it.
>
> - Version 3 no longer supports the condition form of depends_on.

> - The depends_on option is ignored when deploying a stack in swarm mode with a version 3 Compose file.

## 기타 유의사항
### 도커 커뮤니티 에디션에서는 멀티 컨테이너 로깅 드라이버를 지원하지 않음
- 로그 드라이버를 fluentd로 바꾸면 호스트 머신에서 표준 출력되는 로그를 볼 수 없음

### 관련 링크
- https://stackoverflow.com/questions/45055434/can-docker-have-multiple-logging-drivers
- https://github.com/moby/moby/issues/17910
- https://docs.docker.com/engine/release-notes/#18031-ee-1

## 도커 컴포즈 유스케이스
- 도커 컴포즈를 이용하여 통합 테스트 환경 구축하기 
- 단일 호스트 배포
- 도커 컴포즈를 이용하여 개발환경 구축하기

## 참고 자료 
- https://blog.jonnung.dev/system/2018/04/06/fluentd-log-collector-part1