const { Router } = require('express');
const { create, deleteAgent, getAll, getById, update } = require('../controllers/agents.controller.js');

const router = Router();

router.get('/agents', getAll);
router.get('/agents/:id', getById);
router.post('/agents', create);
router.patch('/agents/:id', update);
router.delete('/agents/:id', deleteAgent);

module.exports = router;