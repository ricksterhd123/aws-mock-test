const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

test('Can read file from S3', async () => {
    AWSMock.setSDK('../aws-sdk');
    AWSMock.mock('S3', 'getObject', (params, callback) => {
        callback(null, {
            Body: 'hello world',
        })
    });

    const { readFileFromS3 } = require('../src');
    const result = await readFileFromS3('test', 'test.json');

    expect(result).toBe('hello world');
    AWSMock.restore('S3');
});