const btoa = require('btoa');
const request = require('request');
require('dotenv').config();

const apiPredict = (model, payload) => {
    return new Promise(resolve => {
        request.post(model.url, {
            method: 'POST',
            body: {
                fields: ["GVA_PUBLIC", "GVA_INDUSTRY", "GVA_SERVICES"],
                values: [[payload.gvap, payload.gvai, payload.gvas]]
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

const setCredentials = async (credentials) => {
    return new Promise(resolve => {

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
            const mockPayload = { gvap: 200000, gvai: 1000000, gvas: 500000 };
            const result = await apiPredict(wml, mockPayload);
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

// Criação do modelo inicial
const initialCredentials = {
    apikey: process.env.WML_APIKEY,
    url: process.env.WML_URL
};

let model;
setCredentials(initialCredentials)
    .then(res => {
        model = res;
    });

module.exports = {
    credentials: async (req, res) => {
        newModel = await setCredentials(req.body);
        let response;
        if (newModel.err === true) {
            response = newModel;
        } else {
            model = newModel;
            response = {
                err: false,
                msg: 'Modelo alterado com sucesso.'
            };
        };
        return res.json(response);
    },
    predict: async (req, res) => {
        if (model.err === true) {
            return res.json({
                err: true,
                msg: "As credenciais do modelo estão inválidas. Por favor, altere-as clicando no botão de configuração."
            });
        } else {
            const result = await apiPredict(model, req.body);
            if (result.err === true) {
                return res.json({
                    err: true,
                    msg: "Houve um erro durante a requisição. Pode ser que seu token de acesso tenha expirado, por favor recarregue a página."
                });
            } else if (result.prediction === undefined) {
                return res.json({
                    err: true,
                    msg: "Houve um erro durante a requisição, verifique se os parâmetros foram enviados corretamente."
                });
            } else {
                return res.json({
                    err: false,
                    value: parseInt(result.prediction[0][0])
                });
            };
        };
    },
    model: (_, res) => {
        const response = (model.err === true) ? { err: true, msg: 'Modelo inválido' } : { err: false, msg: 'OK' };
        return res.json(response);
    }
};
