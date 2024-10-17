import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: Handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request, no body found' })
    };
  }
  
  const requestBody = JSON.parse(event.body);
  const { order_id, customer_name } = requestBody;

  const params = {
    TableName: process.env.COFFEE_ORDERS_TABLE,
    Key: {
      OrderId: order_id,
      CustomerName: customer_name
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order deleted successfully!', OrderId: order_id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not delete order: ${error.message}` })
    };
  }
};