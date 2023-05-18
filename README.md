------PROCESS FLOW FOR THIS PROJECT-----------

\\\\\-----  PART 1  -----/////
>> OAuth 2.0 flow for Hubspot so accounts can connect to our public app.
>> Utilize analytics API to figure out total records of differents objects in the CRM
>> Try and explore to breakdown the entire data extraction process into as small jobs as possible , ideally create a seperate job for each API call (yet to figure out its viability)
>> Use task queues to process jobs for extraction and loading of data from api calls to MongoDB
>> Set up WebHook consumption URLs to maintain sync across CRM and our DB
>> Set up Cron jobs for services that do not have webhook subscriptions

\\\\\-----  PART 2 -----/////
>> Set up similar processes for product analytics tools
>> Create SQL DB schemas and migrations
>> Resolve the format of data storage in SQL DB
>> Perform transformations and complete the pipline flow from source to MongoDB to SQL DB
>> Integrate solutions for accomodation of user defined configurations
>> Solve the problem of calculating Scores


\\\\\----- PART 3   -----/////
>> Optimize for speed 
>> Optimize for Fault Tolerance and Error Handling
>> Optimize for Data Synchronization across services