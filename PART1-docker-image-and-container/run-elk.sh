#!/bin/sh

docker run -d --rm -p 5601:5601 -p 9200:9200 -p 5044:5044 -e ES_CONNECT_RETRY=400 -m 3g --name elk sebp/elk
