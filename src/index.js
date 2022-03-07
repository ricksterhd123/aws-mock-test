const { S3 } = require('aws-sdk');

async function readFileFromS3(bucket, key) {
    const s3Client = new S3();
    try {
        const result = await s3Client.getObject({
            Bucket: bucket,
            Key: key
        }).promise();
        return result.Body;
    } catch (error) {
        return false;
    }
}

module.exports = {
    readFileFromS3
};
