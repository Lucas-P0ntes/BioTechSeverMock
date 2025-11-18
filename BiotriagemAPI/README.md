# Biotriagem API

API REST desenvolvida em Node.js com TypeScript e Express, baseada nos repositórios Swift do projeto Biotriagem.

## 📋 Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (opcional):
```bash
# Crie um arquivo .env na raiz do projeto
PORT=3000
NODE_ENV=development
```

## 🏃 Executando a API

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada no `.env`).

## 📡 Endpoints

### Autenticação

#### POST `/api/login`
Realiza login do usuário.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "professionalId": 1,
  "companyName": "Dev Company",
  "email": "usuario@email.com",
  "authToken": "dev-token-{uuid}"
}
```

### Usuário

#### GET `/api/user`
Retorna informações do usuário autenticado.

**Response:**
```json
{
  "uid": "1",
  "name": "João",
  "lastName": "Silva",
  "email": "joao.silva@dev.com"
}
```

### Pacientes

#### GET `/api/patients`
Retorna lista de pacientes.

**Response:**
```json
{
  "patients": [
    {
      "id": 1,
      "name": "Maria Santos",
      "cpf": "123.456.789-00",
      "email": "maria.santos@email.com",
      ...
    }
  ]
}
```

### Exames

#### GET `/api/patients/:cpf/exams`
Retorna lista de exames de um paciente específico.

**Parâmetros:**
- `cpf`: CPF do paciente

**Response:**
```json
{
  "exams": [
    {
      "id": "exam_1",
      "picture": "OBJ_FILES/Scan_do_Pe_Direito.obj",
      "type": "scan",
      "name": "Scan do Pé Direito",
      "date": "2024-01-15T10:30:00.000Z",
      "measures": [
        {
          "name": "Comprimento",
          "distance": 0.255,
          "firstPoint": null,
          "lastPoint": null
        }
      ]
    }
  ]
}
```

#### POST `/api/patients/:cpf/exams`
Cria um novo exame para um paciente.

**Parâmetros:**
- `cpf`: CPF do paciente

**Request Body:**
```json
{
  "picture": "OBJ_FILES/Scan_do_Pe_Direito.obj",
  "type": "scan",
  "name": "Scan do Pé Direito",
  "measures": [
    {
      "name": "Comprimento",
      "distance": 0.255,
      "firstPoint": null,
      "lastPoint": null
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

### Health Check

#### GET `/health`
Verifica o status da API.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🏗️ Estrutura do Projeto

```
BiotriagemAPI/
├── src/
│   ├── controllers/      # Lógica de negócio
│   │   ├── LoginController.ts
│   │   ├── UserController.ts
│   │   ├── PatientController.ts
│   │   └── ExamController.ts
│   ├── models/          # Modelos de dados
│   │   ├── LoginResponse.ts
│   │   ├── User.ts
│   │   ├── Patient.ts
│   │   └── Exam.ts
│   ├── routes/          # Definição de rotas
│   │   ├── loginRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── patientRoutes.ts
│   │   └── index.ts
│   └── server.ts        # Servidor Express
├── dist/                # Código compilado (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo produção
- `npm run type-check` - Verifica tipos sem compilar

## 📝 Notas

- A API atualmente retorna dados mock em modo desenvolvimento
- Os endpoints estão prontos para integração com banco de dados
- Todos os endpoints seguem o padrão REST
- CORS está habilitado para permitir requisições de diferentes origens

## 🔐 Próximos Passos

Para produção, considere implementar:
- Autenticação JWT real
- Integração com banco de dados
- Validação de dados mais robusta
- Rate limiting
- Logging estruturado
- Testes automatizados

