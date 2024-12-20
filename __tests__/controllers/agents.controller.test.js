const { app } = require('../../handler');
const request = require('supertest');

const { AgentService } = require('../../src/services/agents.service');
jest.mock('../../src/services/agents.service');

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

describe('[CONTROLLER] getAll endpoint', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return 200 and an array of agents', async () => {
    AgentService.prototype.getAll.mockResolvedValueOnce(mockItems);

    const res = await request(app).get('/api/agents');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockItems);
  });

  it('Should return 500', async () => {
    AgentService.prototype.getAll.mockRejectedValueOnce('error');

    const res = await request(app).get('/api/agents');
    expect(res.status).toBe(500);
  });
});

describe('[CONTROLLER] getById endpoint', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return 200 and an agent', async () => {
    AgentService.prototype.getById.mockResolvedValueOnce(mockItem);

    const res = await request(app).get('/api/agents/' + mockItem.id);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItem);
  });

  it('Should return 404 if there is no agent with given id', async () => {
    AgentService.prototype.getById.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/agents/' + mockItem.id);
    expect(res.status).toBe(404);
  });

  it('Should return 500 if there is any error while getting agent', async () => {
    AgentService.prototype.getById.mockRejectedValueOnce(new Error('Error'));

    const res = await request(app).get('/api/agents/' + mockItem.id);

    expect(res.status).toBe(500);
  });
});


describe('[CONTROLLER] create endpoint', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return 200 and the new agent', async () => {
    AgentService.prototype.create.mockResolvedValueOnce(mockItem);

    const res = await request(app)
      .post('/api/agents/')
      .send(mockItem);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockItem);
  });

  it('Should return 400 if a required parameter is missing', async () => {
    AgentService.prototype.create.mockResolvedValueOnce(mockItem);

    const itemWithoutNameField = {
      description: mockItem.description,
      role: mockItem.role
    };

    const res = await request(app)
      .post('/api/agents/')
      .send(itemWithoutNameField);

    expect(res.status).toBe(400);
  });

  it('Should return 400 if given  role is invalid ', async () => {
    AgentService.prototype.create.mockResolvedValueOnce(mockItem);

    const itemWithInvalidRole = {
      description: mockItem.description,
      role: 'asd',
      name: mockItem.name,
    };

    const res = await request(app)
      .post('/api/agents/')
      .send(itemWithInvalidRole);

    expect(res.status).toBe(400);
  });

  it('Should return 500 if there is any error while creating agent', async () => {
    AgentService.prototype.create.mockRejectedValueOnce(new Error('Error'));

    const res = await request(app)
      .post('/api/agents')
      .send(mockItem);

    expect(res.status).toBe(500);
  });
});

describe('[CONTROLLER] update endpoint', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return 200 and the updated agent', async () => {
    AgentService.prototype.update.mockResolvedValueOnce(mockItem);

    const res = await request(app)
      .patch('/api/agents/' + mockItem.id)
      .send({ name: 'hey' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockItem);
  });

  it('Should return 400 if given role is invalid ', async () => {
    AgentService.prototype.update.mockResolvedValueOnce(mockItem);

    const res = await request(app)
      .patch('/api/agents/' + mockItem.id)
      .send({ role: 'asdsj' });

    expect(res.status).toBe(400);
  });

  it('Should return 500 if there is any error while updating agent', async () => {
    AgentService.prototype.update.mockRejectedValueOnce('error');

    const res = await request(app)
      .patch('/api/agents/' + mockItem.id)
      .send({ name: 'hey' });

    expect(res.status).toBe(500);
  });
});


describe('[CONTROLLER] delete endpoint', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return 200 and deleted agent message', async () => {
    AgentService.prototype.delete.mockResolvedValueOnce({ message: 'Deleted successfully' });

    const res = await request(app)
      .delete('/api/agents/' + mockItem.id)
      .send();

    expect(res.status).toBe(200);
  });

  it('Should return 500 if there is any error while deleting agent', async () => {
    AgentService.prototype.delete.mockRejectedValueOnce('error');

    const res = await request(app)
      .delete('/api/agents/' + mockItem.id)
      .send();

    expect(res.status).toBe(500);
  });
});