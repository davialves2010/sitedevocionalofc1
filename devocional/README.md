# Devocional Diário — Deploy na Vercel (com API gratuita da Groq)

## Estrutura

index.html
style.css
script.js
api/
devotional.js <- serverless function (roda no servidor, não no navegador)


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

1. **Crie um repositório** com estes arquivos.
2. **Vá para vercel.com** e conecte seu repositório.
3. Durante o setup, vá em **Settings** → **Environment Variables**.
4. Adicione: `GROQ_API_KEY` = (sua chave da Groq)
5. Clique em **Deploy**.

É isso! Seu site agora gera devocionais diários usando a API da Groq.

## Como funciona

- **Frontend**: `index.html`, `style.css`, `script.js`
  - Interface amigável
  - Integração com [A Bíblia Digital API](https://abibliadigital.com.br/api)
  - LocalStorage para favoritos, reflexões e cache do devocional

- **Backend**: `api/devotional.js`
  - Roda **só no servidor** (Vercel)
  - Busca um versículo temático em A Bíblia Digital
  - Chama a API da Groq (llama-3.1-70b) para gerar citação + reflexão
  - Retorna tudo em JSON
  - Cacheia por 1 hora (depois 24h em stale-while-revalidate)

## Temas rotativos

24 temas bíblicos que rotacionam diariamente:
Fé, Esperança, Paz, Amor, Perseverança, Gratidão, Confiança, Coragem,
Humildade, Sabedoria, Perdão, Alegria, Descanso, Propósito, Cura,
Provisão, Proteção, Renovação, Serviço, Gentileza, Paciência,
Fidelidade, Liberdade, Consolo.

## Recursos

✅ Devocional diário gerado por IA  
✅ Bíblia completa (versão NVI)  
✅ Busca por versículos  
✅ Favoritos  
✅ Diário de reflexões  
✅ Modo escuro  
✅ Totalmente offline (localStorage)  
✅ Sem anúncios  
✅ Código aberto  

## Troubleshooting

- **Erro 500 no devocional?**
  - Verifique se `GROQ_API_KEY` está configurada no Vercel
  - Teste sua chave em console.groq.com/docs

- **Versículos não carregam?**
  - A Bíblia Digital pode estar fora do ar (raro)
  - Tente F5 depois de alguns minutos

- **Quer mudar os temas?**
  - Edite `DAILY_THEMES` em `api/devotional.js`

## Licença

MIT — use livremente! 🙏

---

Feito com ❤️ e ⚡ tecnologia
