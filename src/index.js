const { S3 } = require('aws-sdk');
const fetch = require('node-fetch');

async function createArticle(url, authToken, article) {
    const response = await fetch(url, {
        method: 'post',
        headers: {
            Authorization: authToken,
        },
        body: JSON.stringify(article),
    });

    if (!response.ok) {
        console.error(`Failed to POST ${response.url}`);
        console.error('Status', response.status);
        console.error('Response', await response.text());
        return false;
    }

    return true;
}

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
    readFileFromS3,
    createArticle,
};
