
const {Queue} = require('bullmq')

const jobOptions = {
    // jobId, uncoment this line if your want unique jobid
    removeOnComplete: true, // remove job if complete
    delay: 600, // 1 = 60000 min in ms
    attempts: 3 // attempt if job is error retry 3 times
};

const queueName = 'hubspotCRMQueue'


const hubspotCRMQueue = new Queue("hubspotCRMQueue" , {
    connection : { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
  })


const addJobsToHubspotCRMQueue =  async (urls , userId, authToken , refreshToken ) => {
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
        hubspotCRMQueue.add("fetchCRMData&LoadToMongoDB" , payload , jobOptions).then(() => {
            countJobs++;
            console.log("``````count------" , countJobs)
            
        })
    }
    return countJobs
  
}

module.exports = { addJobsToHubspotCRMQueue }