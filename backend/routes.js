const { Router } = require('express');
const wmlController = require('./controllers/wmlController');

const routes = Router();

routes.post('/credenciais', async (req, res) => {
    console.log('POST @ /credenciais');
    return await wmlController.credentials(req, res);
});
routes.post('/predicao', async (req, res) => {
    console.log('POST @ /predicao', req.body);
    return await wmlController.predict(req, res);
});

routes.get('/modelo', async (req, res) => {
    console.log('POST @ /modelo');
    return await wmlController.model(req, res);
});

module.exports = routes;
