# Guia de Deploy na Vercel

## Configuração Atual

O projeto está configurado para funcionar na Vercel com as seguintes alterações:

### Arquivos Criados/Modificados:

1. **`vercel.json`** - Configuração do deploy
2. **`api/index.js`** - Handler serverless para Vercel
3. **`src/server.ts`** - Modificado para detectar ambiente Vercel

## Configurações na Vercel

### 1. Build Settings

No painel da Vercel, configure:

- **Build Command**: `npm run build`
- **Output Directory**: (deixe vazio)
- **Install Command**: `npm install` (padrão)

### 2. Environment Variables

Configure as variáveis de ambiente necessárias no painel da Vercel (se houver).

### 3. Root Directory

Se o projeto estiver em um subdiretório (ex: `BiotriagemAPI/`), configure:

- **Root Directory**: `BiotriagemAPI`

## Estrutura do Projeto

```
BiotriagemAPI/
├── api/
│   └── index.js          # Handler serverless para Vercel
├── src/
│   └── server.ts         # Servidor Express
├── dist/                 # Build output (gerado pelo npm run build)
├── vercel.json           # Configuração Vercel
└── package.json
```

## Como Funciona

1. A Vercel executa `npm run build` que compila o TypeScript para `dist/`
2. Todas as requisições são redirecionadas para `/api/index.js` via `vercel.json`
3. O handler em `api/index.js` carrega o app Express de `dist/server.js`
4. O servidor detecta que está na Vercel e não inicia `app.listen()`

## Troubleshooting

### Erro 404 Persistente

1. **Verifique os logs de build na Vercel**:
   - Vá em "Deployments" > Seu deployment > "Build Logs"
   - Certifique-se de que `npm run build` executou com sucesso
   - Verifique se a pasta `dist/` foi criada

2. **Verifique os logs de runtime**:
   - Vá em "Logs" no painel da Vercel
   - Procure por erros ao carregar o servidor
   - O handler deve mostrar "Server loaded successfully"

3. **Verifique o Root Directory**:
   - Se o projeto está em `BiotriagemAPI/`, configure o Root Directory
   - Caso contrário, a Vercel não encontrará os arquivos

4. **Teste localmente**:
   ```bash
   npm run build
   node api/index.js
   ```

### Erro "Cannot find module"

- Certifique-se de que todas as dependências estão em `dependencies` (não `devDependencies`)
- Execute `npm install` antes do build

### Build falha

- Verifique se o TypeScript está compilando corretamente
- Execute `npm run build` localmente para ver erros

## Testando Localmente

Para testar se o handler funciona:

```bash
cd BiotriagemAPI
npm run build
node api/index.js
```

Ou use o servidor normal:

```bash
npm run dev
```

## Próximos Passos

1. Faça commit das alterações
2. Faça push para o repositório
3. A Vercel fará o deploy automaticamente
4. Verifique os logs se ainda houver erro 404

