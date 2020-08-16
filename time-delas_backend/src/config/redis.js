const redis = require("redis");

const redisClient = redis.createClient(6379, 'redis')

async function closeInstance() { 
    await new Promise((resolve) => {
        redis.quit(() => {
            resolve();
        });
    });
    // redis.quit() creates a thread to close the connection.
    // We wait until all threads have been run once to ensure the connection closes.
    await new Promise(resolve => setImmediate(resolve));
}

redisClient.on("connect", function () {
    console.log("Redis plugged in.");
})

redisClient.on('error', console.error)

module.exports = { closeInstance, redisClient } 