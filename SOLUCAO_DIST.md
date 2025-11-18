# 🔧 Solução para o Problema do `dist/` na Vercel

## ❌ Problema Identificado

O erro mostra que o `dist/` não existe no ambiente da função serverless:
```json
{
  "distExists": false,
  "cwd": "/var/task",
  "__dirname": "/var/task/api"
}
```

## 🔍 Causa Raiz

Na Vercel, quando usamos `builds` com `@vercel/node`, cada função serverless é **empacotada separadamente**. O `buildCommand` executa o build e cria o `dist/`, mas o `dist/` **não é automaticamente incluído** no bundle da função `api/index.js`.

## ✅ Soluções Aplicadas

### 1. Handler Melhorado (`api/index.js`)
- ✅ Adicionado endpoint `/debug` para diagnóstico
- ✅ Logs mais detalhados com prefixo `[VERCEL]`
- ✅ Validação se o app carregado é um Express válido
- ✅ Mais caminhos testados

### 2. Verificações na Vercel

**IMPORTANTE:** Verifique se o build está sendo executado:

1. **Build Logs:**
   - Vá em Deployments → Seu deployment → Build Logs
   - Deve mostrar: `npm run build` executando
   - Deve mostrar: `tsc` compilando com sucesso
   - Deve mostrar: Arquivos sendo criados em `dist/`

2. **Se o build não executar:**
   - Verifique se `buildCommand` está configurado no painel Vercel
   - Ou confie no `buildCommand` do `vercel.json` (já configurado)

## 🎯 Próximos Passos

### Opção 1: Verificar Build (Recomendado)

1. **Acesse `/debug` após o deploy:**
   ```
   https://seu-projeto.vercel.app/debug
   ```
   
   Isso mostrará:
   - Quais caminhos foram testados
   - Se o `dist/` existe
   - Quais arquivos estão no `cwd`
   - Informações do ambiente

2. **Verifique os Build Logs na Vercel:**
   - O build deve executar ANTES do handler
   - O `dist/` deve ser criado durante o build

### Opção 2: Solução Alternativa (Se necessário)

Se o `dist/` ainda não estiver disponível, podemos:

1. **Mover o servidor para dentro do handler** (compilar inline)
2. **Usar `ts-node` para compilar em runtime** (não recomendado para produção)
3. **Garantir que `dist/` seja commitado** (não recomendado)

## 📋 Checklist

Após fazer commit e push:

- [ ] Build executou com sucesso (verificar Build Logs)
- [ ] `dist/server.js` foi criado (verificar Build Logs)
- [ ] Acessar `/debug` para ver diagnóstico
- [ ] Verificar logs de runtime para mensagens `[VERCEL]`
- [ ] Testar endpoint `/health`

## 🔍 Diagnóstico

Após o próximo deploy, acesse:
```
https://seu-projeto.vercel.app/debug
```

Isso mostrará exatamente o que está acontecendo e onde o `dist/` deveria estar.

## 💡 Explicação Técnica

Na Vercel:
1. `buildCommand` executa → cria `dist/`
2. `builds` empacota `api/index.js` → **pode não incluir `dist/`**
3. Handler tenta carregar `dist/server.js` → **não encontra**

A solução é garantir que o `dist/` seja incluído no bundle ou que o build seja executado de forma que o `dist/` esteja disponível.

