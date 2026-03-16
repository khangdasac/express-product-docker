const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "fake",
  secretAccessKey: "fake"
});

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000"
});

module.exports = { dynamodb };