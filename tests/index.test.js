const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
AWSMock.setSDK('../aws-sdk');

test('Can read file from S3', async () => {
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

test('Fails gracefully if failed to read file from S3', async () => {
    AWSMock.mock('S3', 'getObject', (params, callback) => {
        callback(new Error('Failed to read file'), null);
    });

    const { readFileFromS3 } = require('../src');
    const result = await readFileFromS3('test', 'test.json');

    expect(result).toBe(false);
    AWSMock.restore('S3');
});
