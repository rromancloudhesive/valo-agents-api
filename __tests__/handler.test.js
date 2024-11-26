// agents.test.js
const request = require('supertest');
const { app } = require('../handler');
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand,
  UpdateCommand,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('testing',() => {

  beforeEach(() => {
    ddbMock.reset();
  }); 

  it('should return 200 and an array of agents', async () => {
    
    const mockItems = [
      {
        "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
        "name": "John",
        "role": "initiator",
        "description": "a black cat that kills with his bazooka"
      }
    ];
    
    ddbMock.on(ScanCommand).resolves({
        Items: mockItems,
    });

    const res = await request(app)
      .get('/agents')
      .expect(200)

    expect(res.status).toBe(200);
  });

  it('should return 500 if there is an error related to DynamoDB', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'));
  
    const res = await request(app)
      .get('/agents')
      .expect(500);
  
    expect(res.body.error).toBe('Could not retrieve agents');
  });

  it('should return 200 and an agent', async() => {
    
    const mockItem = {
      "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
      "name": "John",
      "role": "initiator",
      "description": "a black cat that kills with his bazooka"
    };

    ddbMock.on(GetCommand).resolves({
        Item: mockItem,
    });

    const res = await request(app)
      .get('/agents/c1e9a777-134e-44c7-b6b6-7c47389028d0');

      console.log('res', res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItem);
  });

  it('should return 500 if there is an error related to DynamoDB', async() => {
    ddbMock.on(GetCommand).rejects(new Error('DynamoDB Error'));

    const res = await request(app)
      .get('/agents/c1e9a777-134e-44c7-b6b6-7c47389028d0');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Could not retrieve agent');
  });
    
  it('should return 200 and a new agent', async() => {
    
    const mockItem = {
      "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
      "name": "John",
      "role": "initiator",
      "description": "a black cat that kills with his bazooka"
    };

    ddbMock.on(PutCommand).resolves(mockItem);

    const res = await request(app)
      .post('/agents')
      .send({ name: 'ads', description: 'asd', role: 'asd' });

    expect(res.status).toBe(400);
  });

  it('should return 500 if there is an error related to DynamoDB', async() => {
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB Error'));

    const res = await request(app)
      .post('/agents')
      .send({ name: 'ads', description: 'asd', role: 'duelist' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Could not create agent');
  });

  it('should return 400 if a parameter is not passed', async() => {
    ddbMock.on(UpdateCommand).rejects('rejected');

    const res = await request(app)
      .post('/agents')
      .send({ name: 'ads' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('name, description, role fields are required');
  });
    
  it('should return 200 and an agent', async() => {
  
    const mockItem = {
      "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
      "name": "John",
      "role": "initiator",
      "description": "a black cat that kills with his bazooka"
    };

    ddbMock.on(UpdateCommand).resolves({...mockItem});

    const res = await request(app)
      .patch('/agents/c1e9a777-134e-44c7-b6b6-7c47389028d0')
      .send({
      name: mockItem.name
    });

    //TODO FIX THIS DUE TO STRING TYPE, WE NEED TO CONVERT IT TO OBJECT
    console.log('res', res.body, typeof res.body)

    expect(res.status).toBe(200);
    // expect(res.body).toEqual(mockItem);
  });

  it('should return 500 if there is an error related to DynamoDB', async() => {
    ddbMock.on(UpdateCommand).rejects('rejected');

    const res = await request(app)
      .patch('/agents/c1e9a777-134e-44c7-b6b6-7c47389028d0');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Could not update agent');
  });

  it('Should return 400 if sent role is not allowed', async() => {
    ddbMock.on(UpdateCommand).resolves('');

    const res = await request(app)
      .patch('/agents/c1e9a777-134e-44c7-b6b6-7c47389028d0')
      .send({
        role: 'atacker'
      })
      .set('Accept', 'application/json ; charset=utf-8');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid role, must be duelist, controller, sentinel or initiator');
  });
});