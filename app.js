//docker run -e ELASTIC_PASSWORD=MagicWord -p 9200:9200 -v /home/matyz/dev/OpenSource/elastic-fake-data/elasticConfig/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml docker.elastic.co/elasticsearch/elasticsearch:6.2.4 

const elasticsearch = require('elasticsearch');
const faker = require('faker');
const data = {}
const client = new elasticsearch.Client({
    host: 'elastic:MagicWord@localhost:9200',
    log: 'trace'
});
const args = process.argv.slice(2);
// sensor,date,image,geoPoint

const generateDataForIndex = () => {
    generateDataFaker('sensor', 8, faker.company.companyName)
    generateDataFaker('location', 8, faker.address.city)
    generateData('sensorKind', ['IR', 'REGULAR', 'CBG'])
    generateData('resolutionWidth', [1024, 2048, 768])
    generateData('resolutionHeight', [248, 12, 768])
}
const fakedata = async (amount = 100) => {
 if(await client.indices.exists({index:'image'})){
   await client.indices.delete({
        index:'image'
    })
 }
 await client.indices.create({
    index:'image'
})
await mapping();
 Array(amount).fill().forEach(async n => {
    try {
       let data =  await client.index({
            index: 'image',
            type: 'imageType',
            body: {
                sensor: getRandomByType('sensor'),
                location: getRandomByType('location'),
                image: faker.image.avatar(),
                date: faker.date.past(),
                sensorKind: getRandomByType('sensorKind'),
                resolutionWidth: getRandomByType('resolutionWidth'),
                resolutionHeight: getRandomByType('resolutionHeight'),
                point:getRandomPoint()
                

            }
        })
       
    } catch (error) {
        console.log(error);
    }
   
})

}


const mapping =async ()=>{
    try {
     
       await client.indices.putMapping({
            index: 'image',
            type: 'imageType',
            body: {
                properties: {
                    point: {
                      type: "geo_point"
                    }
                   
            }  
        }
        })   
        
    } catch (e) {
        console.log(e);
    } 
}
const generateData = (type, arr) => data[type] = { data: arr, size: arr.length }
const generateDataFaker = (fakerType, size, fakerFunction) => {
    data[fakerType] = {
        data: [],
        size
    }
    Array(size).fill().forEach(() => {
        data[fakerType].data.push(fakerFunction());
    })

}

const getRandomByType = (fakerType) => data[fakerType].data[Math.round(Math.random() * data[fakerType].size - 1)]
const getRandomPoint= ()=> ({lat: getPointHelper("39.83"),lon: getPointHelper("-74.87")}) 
//cli

const getPointHelper = (point)=> point+Math.floor(Math.random() * 10);

generateDataForIndex();
if (args.length == 2) {
    fakedata(args[2])
}
else {
    fakedata()
}