const { AgentService } = require('../services/agents.service.js');

const agentService = new AgentService();

const AGENTS_ROLES = ['controller', 'initiator', 'duelist', 'sentinel'];

const getAll = async (req, res, next) => {
  try {
    const agents = await agentService.getAll();
    res.send({ data: agents });
  } catch (error) {
    next(error);
  }
}

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await agentService.getById(id);

    if (!agent) return res.status(404).send({ message: 'Agent not found' });

    return res.status(200).send(agent);
  } catch (error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  try {
    const { name, description, role, url } = req.body;

    if (!name || !description || !role) {
      return res.status(400).json({ error: 'name, description, role fields are required' });
    } else if (!AGENTS_ROLES.includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role, muste be duelist, controller, sentinel or initiator' });
    }

    const newAgent = await agentService.create({ name, description, role, url });

    return res.status(201).send(newAgent);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, role, url } = req.body;

    if (role && !AGENTS_ROLES.includes(role.toLowerCase())) {
      return res.status(400).send({ error: 'Invalid role, must be duelist, controller, sentinel or initiator' });
    }

    const updatedAgent = await agentService.update(id, { name, description, role, url });
    return res.send(updatedAgent);
  } catch (error) {
    next(error);
  }
}

const deleteAgent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await agentService.delete(id);

    return res.status(200).send({ message: `agent with id= ${id} deleted sucessfully` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteAgent,
};
