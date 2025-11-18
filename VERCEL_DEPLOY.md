# Guia de Deploy na Vercel

Este projeto está configurado para fazer deploy na Vercel como uma aplicação serverless.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Vercel CLI instalado (opcional, para deploy via CLI):
   ```bash
   npm i -g vercel
   ```

## 🚀 Deploy

### Opção 1: Deploy via Dashboard da Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
4. A Vercel detectará automaticamente as configurações do projeto
5. Clique em "Deploy"

### Opção 2: Deploy via CLI

1. Instale a Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. No diretório do projeto, execute:
   ```bash
   vercel
   ```

3. Siga as instruções no terminal

4. Para fazer deploy em produção:
   ```bash
   vercel --prod
   ```

## ⚙️ Configuração

### Variáveis de Ambiente

Configure as variáveis de ambiente no dashboard da Vercel:

1. Acesse o projeto na Vercel
2. Vá em "Settings" > "Environment Variables"
3. Adicione as variáveis necessárias:
   - `NODE_ENV=production`
   - `PORT` (opcional, a Vercel define automaticamente)

### Arquivos de Configuração

- `vercel.json`: Configuração do projeto para a Vercel
- `api/index.ts`: Handler serverless que exporta o app Express
- `.vercelignore`: Arquivos e pastas ignorados no deploy

## 📁 Estrutura para Vercel

```
/
├── api/
│   └── index.ts          # Handler serverless
├── src/
│   └── server.ts         # App Express (não inicia servidor na Vercel)
├── vercel.json           # Configuração da Vercel
└── package.json
```

## 🔍 Como Funciona

1. A Vercel detecta o arquivo `api/index.ts` como uma função serverless
2. O `api/index.ts` importa e exporta o app Express de `src/server.ts`
3. O `server.ts` verifica se está rodando na Vercel e não inicia o servidor HTTP
4. A Vercel gerencia o servidor automaticamente

## 🧪 Testar Localmente

Para testar o comportamento serverless localmente:

```bash
vercel dev
```

Isso iniciará um servidor local que simula o ambiente da Vercel.

## 📝 Notas Importantes

- A Vercel compila automaticamente o TypeScript
- O limite de tamanho de request body é de 4.5MB por padrão na Vercel
- Para aumentar o limite, você pode precisar usar Vercel Pro ou configurar no `vercel.json`
- O endpoint `/logs` pode não funcionar corretamente em ambiente serverless devido à natureza stateless das funções

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm install` antes do deploy

### Erro: "Function exceeded maximum duration"
- A Vercel tem um limite de tempo de execução (10s no plano Hobby)
- Considere otimizar rotas lentas ou usar Vercel Pro

### Rotas não funcionam
- Verifique se o `vercel.json` está configurado corretamente
- Certifique-se de que `api/index.ts` está exportando o app corretamente

## 🔗 Links Úteis

- [Documentação da Vercel](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [Express na Vercel](https://vercel.com/guides/using-express-with-vercel)

