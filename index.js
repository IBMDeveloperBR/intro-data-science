const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const btoa = require('btoa');
const request = require('request');
require('dotenv').config();

// Iniciando app e configurando
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Renderizar pasta build
app.use(express.static(path.join(__dirname, "/build")));

const initialCredentials = {
    apikey: process.env.WML_APIKEY,
    url: process.env.WML_URL
};

// Trocar credenciais do modelo
const setCredentials = async (credentials) => {
    return new Promise((resolve, reject) => {

        if (!credentials.apikey || !credentials.url) {
            resolve({
                err: true,
                msg: "Credenciais faltando. Por favor, preencha os três campos."
            });
        };
        const IBM_Cloud_IAM_uid = "bx";
        const IBM_Cloud_IAM_pwd = "bx";
        const options = {
            url: "https://iam.bluemix.net/oidc/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd)
            },
            body: "apikey=" + credentials.apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey"
        };

        // Garantir um token de acesso da IBM Cloud REST API
        request.post(options, async (error, _, body) => {
            const iam_token = JSON.parse(body)["access_token"];
            if (error) {
                resolve({
                    err: true,
                    msg: "Credenciais inválidas."
                });
            };

            const wml = {
                err: false,
                url: credentials.url,
                token: iam_token
            };

            // Chamada teste para o modelo
            const payload = [5000, 3000, 2, "Superior Completo"];
            const result = await apiPredict(wml, payload);
            if (result.err === true) {
                resolve(result);
            } else if (result.prediction === undefined) {
                resolve({
                    err: true,
                    msg: "Credenciais inválidas."
                })
            } else {
                resolve(wml);
            };
        });
    });
};

// Modelo inicial
let model;
setCredentials(initialCredentials)
    .then(res => {
        model = res;
        console.log(model);
    });

const apiPredict = (model, payload) => {
    return new Promise((resolve) => {
        request.post(model.url, {
            method: 'POST',
            body: {
                fields: ["salario", "gasto_mensal", "filhos", "escolaridade"],
                values: [payload]
            },
            json: true,
            headers: {
                Authorization: "Bearer " + model.token,
                "Content-Type": "application/json"
            }
        }, (err, _, body) => {
            if (err) {
                console.log(err);
                resolve({
                    err: true,
                    msg: "Erro na requisição."
                });
            } else {
                resolve({
                    err: false,
                    prediction: body.values
                });
            };
        });
    });
};

// POST /predicao
app.post('/predicao', async (req, res) => {
    console.log('POST @ /predicao', req.body);
    if (model.err === true) {
        res.send({
            err: true,
            msg: "As credenciais do modelo estão inválidas. Por favor, altere-as clicando no botão de configuração."
        });
    } else {
        const result = await apiPredict(model, req.body.values);
        if (result.err === true) {
            res.send({
                err: true,
                msg: "Seu token de acesso expirou, por favor recarregue a página."
            });
        } else if (result.prediction === undefined) {
            res.send({
                err: true,
                msg: "Houve um erro durante a requisição, verifique se os parâmetros foram enviados corretamente."
            });
        } else {
            res.send({
                err: false,
                msg: "Predição: " + result.prediction[0][0]
            });
        };
    };
});

// GET /*
app.get('*', (_, res) => {
    res.redirect('/');
});

const port = process.env.PORT || 7000,
    host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(`App rodando no PORT ${port}`);
});