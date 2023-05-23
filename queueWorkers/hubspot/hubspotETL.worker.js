const { Queue, Worker, Job } = require("bullmq");
const Redis = require("ioredis");
const { con, connect } = require("../../database/mongoDB/connection");
const {
    getAccessToken,
} = require("../../services/hubspot/hubspot.OAuth.helper");

const redis = new Redis();

const hubspotETLWorker = new Worker(
    "hubspotCRMQueue",
    hubspotCRMDataExtractandLoadToMongoDb,

    { connection : { host : "localhost" , port : 6379} }
);

const hubspotCRMDataExtractandLoadToMongoDb = async (job) => {
    console.log("here")
    const dbCLient = await connect();
    const db = dbCLient.db(job.data.userId);
    console.log("here")
    const collection = db.collection(job.data.urlName);
    console.log("not here")
    const apiUrl = job.data.urlValue;

    let apiTrigger = true;

    while (apiTrigger) {
        try {
            while_count++;
            const response = await axios({
                url: apiUrl,
                method: "get",
                headers: { Authorization: `Bearer ${job.data.authToken}` },
            });

            if (response.status === 200) {
                const data = response["data"]["results"];
                console.log(data.length);
                console.log("keys of result", Object.keys(response));
                await dataLoadCollection.insertMany(data);
                if (Object.keys(response["data"]).includes("paging")) {
                    apiUrl = response["data"]["paging"]["next"]["link"];
                    console.log("apiurl>>>>>", apiUrl);
                } else if (!Object.keys(response["data"]).includes("paging")) {
                    apiTrigger = false;
                }
            }
        } catch (error) {
            if (
                JSON.stringify(error.response.status) &&
                JSON.stringify(error.response.status) == "401"
            ) {
                const newTokens = await getAccessToken(job.data.userId, job.data.refreshToken);
                console.log("------refreshing tokens --------------");
                console.log("////////NEW TOKENS||||||||||||", newTokens);

                authToken = newTokens["access_token"];
                await collection.updateOne(
                    { userId: userId },
                    { $set: { userId: userId, Hubspot: newTokens } },
                    { upsert: true }
                );
            }
        }
    }
};

hubspotETLWorker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
});

hubspotETLWorker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});
