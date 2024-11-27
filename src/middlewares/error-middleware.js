function errorHandler(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send({error: 'Internal server error'});
};

module.exports = errorHandler;
