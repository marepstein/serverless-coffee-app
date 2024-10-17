import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const handler: Handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request, no body found' })
    };
  }

  const requestBody = JSON.parse(event.body);
  const { customer_name, coffee_blend } = requestBody;
  const orderId = uuidv4();

  const params = {
    TableName: process.env.COFFEE_ORDERS_TABLE,
    Item: {
      OrderId: orderId,
      CustomerName: customer_name,
      CoffeeBlend: coffee_blend,
      OrderStatus: 'Pending'
    }
  };

  try {
    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully!', OrderId: orderId })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create order: ${error.message}' })
    }
  }
  
};