# Docker Compose

## 목차
- 여러 컨테이너로 구성된 Elastic 스택 실행하기
- docker-compose를 이용해서 Elastic 스택 실행하기
- 도커 브릿지 네트워크
- 도커 볼륨
- docker-compose를 이용하여 통합 테스트 환경 구축하기
- 그 밖의 유스케이스
    - 단일 호스트 배포
    - docker-compose를 이용하여 개발환경 구축하기

## 여러 컨테이너로 구성된 Elastic 스택 실행하기

### 네트워크 만들기
```
docker network create es-net
```

### ElasticSearch


```
docker run -d --rm --name elasticsearch --net es-net -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.2.0
```

```
docker logs -f elasticsearch
```

### Kibana
```
docker run -d --rm --name kibana --net es-net -p 5601:5601 kibana:7.2.0
```

### Fluentd
```
mkdir fluentd
mkdir fluentd/etc
```

fluentd with elasticsearch pluging Dockerfile
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


fluent.conf
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

```
docker run -d --name fluentd --net es-net \
    -p 24224:24224 -p 24224:24224/udp \
    -v `pwd`/log:/fluentd/log -v \
    `pwd`/etc:/fluentd/etc voyagerwoo/fluentd-es:v1.6-1
```

### Application
```
docker run -d --rm --name hello-world --net es-net -p 8080:8080 \
    --log-driver=fluentd \
    --log-opt fluentd-address=localhost:24224 \
    --log-opt tag="hello.{.ID}}" \
    voyagerwoo/hello-world:v1
```

## docker-compose를 이용해서 Elastic 스택 실행하기

## 참고 자료 
- https://blog.jonnung.dev/system/2018/04/06/fluentd-log-collector-part1