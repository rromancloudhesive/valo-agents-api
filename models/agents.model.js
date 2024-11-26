const { createUpdateExpressions } = require('../utils/dynamodb');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

class AgentModel {
  AGENTS_TABLE = process.env.AGENTS_TABLE;
  client = new DynamoDBClient();
  docClient = DynamoDBDocumentClient.from(this.client);

  constructor() {
  }

  async getAll() {
    const command = new ScanCommand(params);
    const response = await this.docClient.send(command);

    return response.Items;
  }

  async getById(id) {
    const params = {
      TableName: this.AGENTS_TABLE,
      Key: { id, },
    };
  
    const command = new GetCommand(params);
    const { Item } = await this.docClient.send(command);

    return Item;
  }

  async create(newAgent) {
    const params = {
      TableName: this.AGENTS_TABLE,
      Item: {
        id: randomUUID(), 
        ...newAgent 
      },
    };
  
    const command = new PutCommand(params);
    return this.docClient.send(command);
  }

  async update(id, updatedAgentFields) {
    const { updateExpression, expressionAttribute, expressionAttributeNames } = createUpdateExpressions(updatedAgentFields);

    const params = {
      TableName: this.AGENTS_TABLE,
      Key: { id },
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttribute,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW'
    };
  
    const command = new UpdateCommand(params);
    const { Attributes } = await this.docClient.send(command);
    
    return Attributes;
  }

  async delete(id) {
    const params = {
      TableName: this.AGENTS_TABLE,
      Key: { id, }
    };
  
    const command = new DeleteCommand(params);
    return this.docClient.send(command);
  }
};

module.exports = { 
  AgentModel 
};