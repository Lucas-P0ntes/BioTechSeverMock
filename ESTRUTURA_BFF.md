# 🏗️ Estrutura BFF - Backend for Frontend

A API foi reorganizada seguindo o padrão **BFF (Backend for Frontend)**, onde cada feature do app iOS tem sua própria estrutura na API.

## 📂 Nova Estrutura

```
BiotriagemAPI/
└── src/
    ├── features/                    # ✨ NOVA: Organização por features
    │   ├── login/
    │   │   ├── login.controller.ts
    │   │   ├── login.model.ts
    │   │   └── login.routes.ts
    │   ├── forgotPassword/
    │   │   ├── forgotPassword.controller.ts
    │   │   └── forgotPassword.routes.ts
    │   ├── home/
    │   │   ├── home.routes.ts       # Agrupa rotas da feature Home
    │   │   ├── user/
    │   │   │   ├── user.controller.ts
    │   │   │   ├── user.model.ts
    │   │   │   └── user.routes.ts
    │   │   └── patient/
    │   │       ├── patient.controller.ts
    │   │       ├── patient.model.ts
    │   │       └── patient.routes.ts
    │   └── patientDetail/
    │       ├── patientDetail.routes.ts
    │       └── exam/
    │           ├── exam.controller.ts
    │           ├── exam.model.ts
    │           └── exam.routes.ts
    ├── routes/
    │   └── index.ts                 # Importa todas as features
    └── server.ts
```

## 🎯 Mapeamento App iOS ↔ API

| Feature iOS | Feature API | Endpoints |
|------------|-------------|-----------|
| `Features/Login/` | `features/login/` | `POST /api/login` |
| `Features/ForgotPassword/` | `features/forgotPassword/` | `POST /api/forgot-password` |
| `Features/Home/` | `features/home/` | `GET /api/user`<br>`GET /api/patients` |
| `Features/PatientDetail/` | `features/patientDetail/` | `GET /api/patients/:cpf/exams`<br>`POST /api/patients/:cpf/exams` |
| `Features/Scan/` | `features/patientDetail/exam/` | (usa exam endpoints) |
| `Features/User/` | `features/home/user/` | (usa user endpoints) |

## ✅ Benefícios

1. **Organização Clara**: Código agrupado por feature, fácil de encontrar
2. **Manutenibilidade**: Mudanças em uma feature não afetam outras
3. **Escalabilidade**: Fácil adicionar novas features
4. **Alinhamento**: Estrutura espelha o app iOS
5. **Testabilidade**: Features isoladas são mais fáceis de testar
6. **Colaboração**: Diferentes desenvolvedores podem trabalhar em features diferentes

## 📝 Convenções

### Nomenclatura
- Controllers: `*.controller.ts`
- Models: `*.model.ts`
- Routes: `*.routes.ts`
- Feature Index: `{feature}.routes.ts`

### Logging
Use prefixos de feature nos logs:
- `[LOGIN]` - Login feature
- `[FORGOT PASSWORD]` - ForgotPassword feature
- `[HOME - USER]` - Home/User feature
- `[HOME - PATIENT]` - Home/Patient feature
- `[PATIENT DETAIL - EXAM]` - PatientDetail/Exam feature

## 🔄 Migração Completa

✅ Controllers movidos para features
✅ Models movidos para features
✅ Routes reorganizadas por feature
✅ Router principal atualizado
✅ TypeScript compilando sem erros
✅ Servidor funcionando corretamente

## 📚 Próximos Passos

- [ ] Adicionar testes por feature
- [ ] Implementar middleware de autenticação por feature
- [ ] Adicionar validação de dados por feature
- [ ] Criar serviços compartilhados (se necessário)

