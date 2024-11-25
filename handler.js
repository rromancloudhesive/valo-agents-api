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

const express = require('express');
const serverless = require('serverless-http');
const { createUpdateExpressions } = require('./utils/dynamodb');

const app = express();

const AGENTS_TABLE = process.env.AGENTS_TABLE;
const AGENTS_ROLES = ['controller', 'initiator', 'duelist', 'sentinel'];

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

//Get all agents
app.get('/agents', async (req, res) => {
  const params = {
    TableName: AGENTS_TABLE,
  };
  console.log('')

  try {
    const command = new ScanCommand(params);
    const { Items } = await docClient.send(command);

    res.json({ data: Items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve agents' });
  }
});

//Get agent by Id
app.get('/agents/:agentId', async (req, res) => {
  const params = {
    TableName: AGENTS_TABLE,
    Key: { id: req.params.agentId, },
  };

  try {
    const command = new GetCommand(params);
    const { Item } = await docClient.send(command);
    if (Item) {
      const { id, name, description, role } = Item;
      res.json({ id, name, description, role });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find agent with provided agentId' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve agent' });
  }
});

//Create agent
app.post('/agents', async (req, res) => {
  const { name, description, role } = req.body;
  if(!name || !description || !role) {
    return res.status(400).json({ error: 'name, description, role fields are required' });
  }else if(!AGENTS_ROLES.includes(role.toLowerCase())) {
    return res.status(400).send({ error: 'Invalid role, muste be duelist, controller, sentinel or initiator' });
  }

  const id = randomUUID();
  const params = {
    TableName: AGENTS_TABLE,
    Item: { id, name, role, description },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ id, name, role, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create agent' });
  }
});

//Update agent
app.patch('/agents/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, role } = req.body; 

  if(role && !AGENTS_ROLES.includes(role.toLowerCase())) {
    return res.status(400).send({ error: 'Invalid role, must be duelist, controller, sentinel or initiator' });
  }

  const { updateExpression, expressionAttribute, expressionAttributeNames } = createUpdateExpressions({ name, description, role });

  const params = {
    TableName: AGENTS_TABLE,
    Key: { id },
    UpdateExpression: `set ${updateExpression.join(', ')}`,
    ExpressionAttributeValues: expressionAttribute,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW'
  };

  try {
    const command = new UpdateCommand(params);
    const { Attributes } = await docClient.send(command);
    
    res.json(Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update agent' });
  }
});

//Delete agent
app.delete('/agents/:id', async (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: AGENTS_TABLE,
    Key: { id, }
  };

  try {
    const command = new DeleteCommand(params);
    await docClient.send(command);
    res.json({id,}); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete agent' });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

exports.handler = serverless(app);
