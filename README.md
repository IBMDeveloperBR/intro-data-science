# Introdução a Data Science com IBM Cloud - Predição de número de habitantes com base em GVA's de uma cidade

## Rodando o app localmente

Para rodar o app localmente, clone o git, insira suas credenciais do Watson Machine Learning no arquivo `env.sample` e execute os seguintes comandos:
```
cp env.sample .env
npm i --only=prod
npm start
```

Acesse o app no seu navegador, pelo endereço http://localhost:7000.

## Rodando o app na nuvem

Apenas clique no botão abaixo, configure suas credenciais, confirme e aguarde em torno de 5 minutos para que o deploy finalize. 

<div align="center">
<a href="https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/IBMDeveloperBR/intro-data-science" target="_blank">
<img src="https://cloud.ibm.com/devops/setup/deploy/button.png" />
</a>
</div>

Para acompanhar o processo de deploy, clique em `Delivery Pipeline` e aguarde a passagem dos estágios `Build` e `Deploy`. Após ambos estarem finalizados, acesse o app clicando em `Ver console` e depois em `Visitar URL do App`.