const AWS = require('aws-sdk'),
    s3 = new AWS.S3();
exports.handler = async (event) => {

    let response = { statusCode: 200 };
    const s3_bucket_name = event['detail']['requestParameters']['bucketName'];
    const eventName = event['detail']['eventName'];
    console.log(`bucket name: ${s3_bucket_name} event name: ${eventName}`);
    response = await s3.getBucketEncryption({ Bucket: s3_bucket_name }).promise().then((d) => { console.log(d); return d; }).catch((e) => {
        if (e.code === 'ServerSideEncryptionConfigurationNotFoundError')
            return setSSEConfiguration(s3_bucket_name);
    });
    return response;
};

async function setSSEConfiguration(bucketname) {
    const params = {
        Bucket: bucketname, /* required */
        ServerSideEncryptionConfiguration: { /* required */
            Rules: [ /* required */
                {
                    ApplyServerSideEncryptionByDefault: {
                        SSEAlgorithm: "AES256"
                    }
                }
            ]
        }
    }
    return s3.putBucketEncryption(params).promise().then((d) => { console.log(d); return d; }).catch((e) => console.log(e));
}
