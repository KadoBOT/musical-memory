import AWS from 'aws-sdk'

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8000"
})

const docClient = new AWS.DynamoDB.DocumentClient()

class DynamoConnector {
	constructor(tableName){
  	this.tableName = tableName
  }

  create = (obj) => this.dynamoFunc('put', obj)
  get = (obj) => this.dynamoFunc('get', obj)
  query = (obj) => this.dynamoFunc('query', obj)
  update = (obj) => this.dynamoFunc('update', obj)
  delete = (obj) => this.dynamoFunc('delete', obj)
  scan = (obj) => this.dynamoFunc('scan', obj)

  dynamoFunc = (type, params) => {
    const obj = ({ TableName: this.tableName, ...params })

    return docClient[type](obj).promise()
  }
}

const posts = new DynamoConnector('Posts')
const users = new DynamoConnector('Users')

export default { posts, users }
