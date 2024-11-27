// agents.model.test.js
const request = require('supertest');
const { AgentModel } = require('../../models/agents.model');
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand,
  UpdateCommand,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const ddbMock = mockClient(DynamoDBDocumentClient);
const agentModel = new AgentModel();

const mockItem = {
  "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
  "name": "John",
  "role": "initiator",
  "description": "a black cat that kills with his bazooka"
};

const mockItems = [
  {
    "id": "c1e9a777-134e-44c7-b6b6-7c47389028d0",
    "name": "John",
    "role": "initiator",
    "description": "a black cat that kills with his bazooka"
  }
];

describe('[getAll]', () => {

  beforeEach(() => {
    ddbMock.reset();
  }); 

  it('Should return an array of agents', async() => {
    ddbMock.on(ScanCommand).resolves({
        Items: mockItems,
    });

    const res = await agentModel.getAll();
    console.log('res', res);
    expect(res).toEqual(mockItems);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(ScanCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentModel.getAll()).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[getById]', () => {
  it('Should return an agent', async() => {
    ddbMock.on(GetCommand).resolves({ Item: mockItem, });

    const res = await agentModel.getById(mockItem.id);
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(GetCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentModel.getById()).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[create]', () => {
  it('Should create a new agent and return it', async() => {
    ddbMock.on(PutCommand).resolves({ Item: mockItem, });
    const res = await agentModel.create(mockItem);
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(PutCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentModel.create(mockItem)).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[update]', () => {
  it('Should update an agent and return it', async() => {
    ddbMock.on(UpdateCommand).resolves({ Attributes: mockItem, });
    const res = await agentModel.update(mockItem.id, { name: mockItem.name });
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(UpdateCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentModel.update(mockItem.id, { name: mockItem.name })).rejects.toThrow('Error from DynamoDB');
  });
});