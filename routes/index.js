const express = require('express');
const agentsRoutes = require('../routes/agents.routes.js');

const router = express();

router.use(agentsRoutes);

module.exports = router;