// agents.service.test.js
const { AgentService } = require('../../src/services/agents.service');
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand,
  UpdateCommand,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const ddbMock = mockClient(DynamoDBDocumentClient);
const agentService = new AgentService();

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

    const res = await agentService.getAll();
    console.log('res', res);
    expect(res).toEqual(mockItems);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(ScanCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentService.getAll()).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[getById]', () => {
  it('Should return an agent', async() => {
    ddbMock.on(GetCommand).resolves({ Item: mockItem, });

    const res = await agentService.getById(mockItem.id);
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(GetCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentService.getById()).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[create]', () => {
  it('Should create a new agent and return it', async() => {
    ddbMock.on(PutCommand).resolves({ Item: mockItem, });
    const res = await agentService.create(mockItem);
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(PutCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentService.create(mockItem)).rejects.toThrow('Error from DynamoDB');
  });
});

describe('[update]', () => {
  it('Should update an agent and return it', async() => {
    ddbMock.on(UpdateCommand).resolves({ Attributes: mockItem, });
    const res = await agentService.update(mockItem.id, { name: mockItem.name });
    expect(res).toEqual(mockItem);
  });

  it('Should return an error if something from DynamoDB fails', async() => {
    ddbMock.on(UpdateCommand).rejects(new Error('Error from DynamoDB'));

    await expect(agentService.update(mockItem.id, { name: mockItem.name })).rejects.toThrow('Error from DynamoDB');
  });
});