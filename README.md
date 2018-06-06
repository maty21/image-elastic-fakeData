
## instruction 
--------------------


![Demo showing mocha menu operation](https://raw.githubusercontent.com/maty21/image-elastic-fakeData/master/elasticConfig/screenshot.png)

##### 1.  run docker  for elastic
```
docker run -e ELASTIC_PASSWORD=MagicWord -p 9200:9200  -v /home/matyz/dev/OpenSource/elastic-fake-data/elasticConfig/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml docker.elastic.co/elasticsearch/elasticsearch:6.2.4 

```

#### 2. generate date 

```js
node app.js ${data Amount params}  // example node app.js 100

````
