// 3rd party libraries
const dynamoose = require('dynamoose');

// Create our schema 
// These are not validated since DynamoDB is schema-less
const friendSchema = new dynamoose.Schema({
  id: String,
  name: String,
  phone: String,
});

// The first argument MUST match the table name in DynamoDB
// The 2nd argument MUST be a schema
const friendModel = dynamoose.model('friends', friendSchema)

exports.handler = async (event) => {
    const { pathParameters, queryStringParameters } = event;
    console.log(pathParameters, queryStringParameters)
    const { id } = pathParameters;

    // NEVER declare response with const
    let response = { statusCode: null, body: null };
    let friendRecords = [];
    
    try {
      // perform the CRUD using our specified schema
      if(id){
        friendRecords = await friendModel.query('id').eq(id);
      } else {
        friendRecords = await friendModel.scan().exec();
      }
      response.statusCode = 200;
      response.body = JSON.stringify(friendRecords);
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify(e);
    }

    return response;
};
