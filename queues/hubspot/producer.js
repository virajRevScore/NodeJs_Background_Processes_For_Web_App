
const {Queue} = require('bullmq')

const jobOptions = {
    // jobId, uncoment this line if your want unique jobid
    removeOnComplete: false, // remove job if complete
    delay: 600, // 1 = 60000 min in ms
    attempts: 3 // attempt if job is error retry 3 times
};

const queueName = 'hubspotCRMQueue'


const  hubspotCRMQueueStage1 = new Queue("hubspotCRMQueueStage1" , {
    connection : { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
  })
const  hubspotCRMQueueStage2 = new Queue("hubspotCRMQueueStage2" , {
    connection : { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
  })


const addJobsToHubspotCRMQueueStage1 =  async (urls , userId, authToken , refreshToken ) => {
    let countJobs = 0
    const totalJobs = urls.length
    console.log(totalJobs)
    for (const url of urls) {
        const urlName = Object.keys(url)[0]
        const urlValue = Object.values(url)[0]
        const payload = {
            userId: userId,
            authToken: authToken,
            refreshToken: refreshToken,
            urlValue: urlValue,
            urlName: urlName
        };
        console.log("--payload" , payload)
        hubspotCRMQueueStage1.add("fetchCRMData&LoadToMongoDB" , payload , jobOptions).then(() => {
            countJobs++;
            console.log("``````count------" , countJobs)
            
        })
    }
    return countJobs
  
}

const addJobsToHubspotCRMQueueStage2 = async ( userId , collectionAndTableName) => {

    let payload = {
        userId : userId,
        collectionAndTableName : collectionAndTableName
    }

    return await hubspotCRMQueueStage2.add("etlFromMongoDBToPostgreSQL" , payload , jobOptions ).then(() => {
        console.log("Job Added to Stage 2. Look out for worker performace and data accuracy in postgres")
    })
}

module.exports = { addJobsToHubspotCRMQueueStage1 , addJobsToHubspotCRMQueueStage2 }