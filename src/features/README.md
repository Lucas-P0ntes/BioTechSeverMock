# Features - Backend for Frontend (BFF)

Esta API está organizada seguindo o padrão **BFF (Backend for Frontend)**, onde cada feature do app iOS tem sua própria estrutura na API.

## 📁 Estrutura de Features

```
features/
├── login/
│   ├── login.controller.ts
│   ├── login.model.ts
│   └── login.routes.ts
├── forgotPassword/
│   ├── forgotPassword.controller.ts
│   └── forgotPassword.routes.ts
├── home/
│   ├── home.routes.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   └── user.routes.ts
│   └── patient/
│       ├── patient.controller.ts
│       ├── patient.model.ts
│       └── patient.routes.ts
└── patientDetail/
    ├── patientDetail.routes.ts
    └── exam/
        ├── exam.controller.ts
        ├── exam.model.ts
        └── exam.routes.ts
```

## 🎯 Mapeamento App iOS ↔ API

| Feature iOS | Feature API | Endpoints |
|------------|-------------|-----------|
| `Login/` | `features/login/` | `POST /api/login` |
| `ForgotPassword/` | `features/forgotPassword/` | `POST /api/forgot-password` |
| `Home/` | `features/home/` | `GET /api/user`, `GET /api/patients` |
| `PatientDetail/` | `features/patientDetail/` | `GET /api/patients/:cpf/exams`, `POST /api/patients/:cpf/exams` |
| `Scan/` | `features/patientDetail/exam/` | (usa exam endpoints) |
| `User/` | `features/home/user/` | (usa user endpoints) |

## 📝 Convenções

### Nomenclatura
- **Controllers**: `*.controller.ts`
- **Models**: `*.model.ts`
- **Routes**: `*.routes.ts`
- **Feature Index**: `{feature}.routes.ts` (agrupa sub-rotas)

### Estrutura de Arquivo

Cada feature deve conter:
- `*.controller.ts` - Lógica de negócio e handlers
- `*.model.ts` - Interfaces TypeScript
- `*.routes.ts` - Definição de rotas

### Logging

Use prefixos de feature nos logs:
- `[LOGIN]` - Login feature
- `[FORGOT PASSWORD]` - ForgotPassword feature
- `[HOME - USER]` - Home/User feature
- `[HOME - PATIENT]` - Home/Patient feature
- `[PATIENT DETAIL - EXAM]` - PatientDetail/Exam feature

## 🔄 Adicionando Nova Feature

1. Criar pasta em `features/{featureName}/`
2. Criar `{featureName}.controller.ts`
3. Criar `{featureName}.model.ts`
4. Criar `{featureName}.routes.ts`
5. Importar em `routes/index.ts`

## 📚 Benefícios do BFF

✅ **Organização**: Código agrupado por feature, fácil de encontrar
✅ **Manutenibilidade**: Mudanças em uma feature não afetam outras
✅ **Escalabilidade**: Fácil adicionar novas features
✅ **Alinhamento**: Estrutura espelha o app iOS
✅ **Testabilidade**: Features isoladas são mais fáceis de testar

