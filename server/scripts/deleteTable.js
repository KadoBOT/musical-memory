const AWS = require('aws-sdk')

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000"
})

// AWS.config.update({endpoint: "https://dynamodb.eu-west-1.amazonaws.com"});

const dynamodb = new AWS.DynamoDB()

const tables = ['Posts', 'Users']

tables.map(TableName =>
  dynamodb.deleteTable({ TableName }, (err, data) => {
    if (err) {
      console.error("🚫  Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("👌  Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
  })
)
