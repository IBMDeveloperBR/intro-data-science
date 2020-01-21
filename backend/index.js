const express = require('express');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes');

// Iniciando app e configurando
const app = express();
app.use(helmet());
app.use(express.json());

// Renderizar pasta build
app.use(express.static(path.join(__dirname, "/build")));

// Rotas
app.use(routes);
app.get('*', (_, res) => {
    res.redirect('/');
});

const port = process.env.PORT || 7000,
    host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(`App rodando no PORT ${port}`);
});