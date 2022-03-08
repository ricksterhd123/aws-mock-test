const AWSMock = require('aws-sdk-mock');
const fetch = require('node-fetch');

jest.mock('node-fetch', ()=>jest.fn());

AWSMock.setSDK('../aws-sdk');

test('Succesfully read file from S3', async () => {
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

test('Fail to read file from S3', async () => {
    AWSMock.mock('S3', 'getObject', (params, callback) => {
        callback(new Error('Failed to read file'), null);
    });

    const { readFileFromS3 } = require('../src');
    const result = await readFileFromS3('test', 'test.json');

    expect(result).toBe(false);
    AWSMock.restore('S3');
});

test('Succesfully create an article', async () => {
    const { createArticle } = require('../src');
    
    fetch.mockImplementation(() => Promise.resolve({
        ok: true
    }));

    const result = await createArticle('https://localhost:8080', 'password123', {
        author: 'test',
        title: 'hello',
        body: 'world',
    });

    expect(result).toBe(true);
});

test('Fail to create an article', async () => {
    const { createArticle } = require('../src');
    
    fetch.mockImplementation(() => Promise.resolve({
        ok: false,
        status: 400,
        text: () => {
            return JSON.stringify({ error: 'Invalid schema' })
        }
    }));

    const result = await createArticle('https://localhost:8080', 'password123', {
        author: 'test',
        title: 'hello',
        body: 'world',
    });

    expect(result).toBe(false);
});
