import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: Handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.COFFEE_ORDERS_TABLE
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not retrieve orders: ${error.message}` })
    };
  }
};