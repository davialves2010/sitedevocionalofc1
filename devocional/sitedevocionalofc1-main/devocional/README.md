# Devocional Diário — Deploy na Vercel (com API gratuita da Groq)

## Estrutura
```
index.html
style.css
script.js
api/
  devotional.js   <- serverless function (roda no servidor, não no navegador)
```

## 1. Pegue sua chave gratuita da Groq

1. Acesse **console.groq.com/keys**.
2. Faça login (dá pra usar conta Google, GitHub ou e-mail — sem cartão
   de crédito e sem verificação de idade).
3. Clique em **"Create API Key"**.
4. Copie a chave gerada (algo como `gsk_...`) — ela só aparece uma vez,
   então guarde num lugar seguro.

O plano gratuito da Groq dá bastante margem pro seu caso (o front-end
só chama a API 1x por dia por visitante, graças ao cache). A Groq roda
modelos open-source (como o Llama da Meta) em hardware próprio deles,
o que deixa as respostas bem rápidas.

## 2. Deploy na Vercel

1. Crie uma conta na Vercel (vercel.com) e conecte seu GitHub.
2. Suba essa pasta inteira para um repositório no GitHub.
3. Na Vercel, clique em "Add New Project" e selecione o repositório.
   A Vercel detecta a pasta `api/` automaticamente e transforma
   `devotional.js` numa serverless function acessível em `/api/devotional`.
4. Antes de finalizar o deploy (ou depois, em Project → Settings →
   Environment Variables), adicione:
   - **Nome:** `GROQ_API_KEY`
   - **Valor:** a chave que você copiou do console da Groq
   - **Environments:** marque Production, Preview e Development
5. Deploy (ou "Redeploy" se o projeto já existia antes de adicionar a
   variável — variáveis de ambiente só entram em vigor em deploys novos).

Pronto — seu site estará em algo como `https://seu-projeto.vercel.app`,
e o devocional do dia vai carregar automaticamente na tela "Hoje".

## Como funciona o devocional

- Existem 24 temas bíblicos pré-definidos (fé, esperança, paz, amor...),
  cada um ligado a uma referência específica da Bíblia.
- O tema do dia é escolhido pelo dia do ano (`dia % 24`), então muda
  todo dia e se repete a cada ~24 dias.
- A função busca o texto do versículo na abibliadigital e manda pra
  API da Groq (modelo Llama 3.3 70B) gerar uma citação reflexiva + um
  texto devocional curto (estilo Glorify) conectados ao tema e ao
  versículo.
- O navegador guarda o resultado em `localStorage` pelo dia, então o
  mesmo usuário não gera de novo a cada recarregamento da página
  (economiza chamadas de API, mesmo sendo gratuita).

## Possível melhoria futura

Hoje, cada visitante pode receber uma redação ligeiramente diferente
do mesmo devocional (a resposta da IA não é 100% idêntica a cada
chamada). Se quiser que **todos os usuários vejam o texto exatamente
igual no mesmo dia**, o próximo passo é gerar o devocional uma vez por
dia via cron job (ex: Vercel Cron) e salvar o resultado num banco tipo
Vercel KV ou Upstash Redis — aí o endpoint só lê o valor já pronto.
Posso te ajudar a montar isso quando quiser.
