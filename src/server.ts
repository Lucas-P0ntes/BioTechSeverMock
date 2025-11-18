import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { requestLogger } from './utils/requestLogger';
import { requestLoggerMiddleware } from './middleware/requestLogger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Aumenta o limite de tamanho do body para aceitar arquivos OBJ grandes (até 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware (deve vir antes das rotas)
app.use(requestLoggerMiddleware(requestLogger));

// Console logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Documentation endpoint
app.get('/', (req: Request, res: Response) => {
  const acceptHeader = req.headers.accept || '';
  
  // Se o cliente aceita HTML, retorna página HTML formatada
  if (acceptHeader.includes('text/html')) {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biotriagem API - Documentação</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #e5e5e7;
            line-height: 1.6;
            padding: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: #1c1c1e;
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #0F2F65 0%, #004580 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            border-bottom: 1px solid rgba(86, 189, 247, 0.2);
        }
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 1.3em;
            opacity: 0.9;
            font-weight: 300;
        }
        .header .version {
            display: inline-block;
            background: rgba(86, 189, 247, 0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-top: 15px;
            border: 1px solid rgba(86, 189, 247, 0.3);
        }
        .content {
            padding: 40px;
        }
        .feature-section {
            margin-bottom: 50px;
            background: #2c2c2e;
            border-radius: 16px;
            padding: 30px;
            border: 1px solid rgba(86, 189, 247, 0.1);
        }
        .feature-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(86, 189, 247, 0.3);
        }
        .feature-icon {
            font-size: 2em;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(86, 189, 247, 0.15);
            border-radius: 12px;
            border: 1px solid rgba(86, 189, 247, 0.3);
        }
        .feature-title {
            font-size: 1.8em;
            color: #56BDF7;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        .feature-description {
            color: #a1a1a6;
            font-size: 0.95em;
            margin-top: 5px;
            margin-left: 62px;
        }
        .endpoint {
            background: #1c1c1e;
            border-left: 3px solid #56BDF7;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 1px solid rgba(86, 189, 247, 0.1);
        }
        .endpoint:hover {
            transform: translateX(5px);
            border-color: rgba(86, 189, 247, 0.4);
            box-shadow: 0 4px 20px rgba(86, 189, 247, 0.15);
        }
        .method {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8em;
            margin-right: 12px;
            letter-spacing: 0.5px;
        }
        .method.post {
            background: #E1312D;
            color: white;
        }
        .method.get {
            background: #56BDF7;
            color: #0F2F65;
        }
        .endpoint-path {
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
            font-size: 1.1em;
            font-weight: 600;
            color: #e5e5e7;
            margin-bottom: 12px;
        }
        .description {
            color: #a1a1a6;
            margin: 12px 0;
            font-size: 1em;
        }
        .details {
            margin-top: 18px;
        }
        .details-title {
            font-weight: 600;
            color: #56BDF7;
            margin: 15px 0 8px 0;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .code-block {
            background: #0a0a0a;
            color: #56BDF7;
            padding: 18px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            margin: 12px 0;
            border: 1px solid rgba(86, 189, 247, 0.2);
            line-height: 1.6;
        }
        .code-block .string {
            color: #56BDF7;
        }
        .code-block .number {
            color: #E1312D;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.7em;
            font-weight: 600;
            margin-left: 8px;
            letter-spacing: 0.3px;
        }
        .badge.required {
            background: #E1312D;
            color: white;
        }
        .badge.optional {
            background: rgba(86, 189, 247, 0.3);
            color: #56BDF7;
            border: 1px solid rgba(86, 189, 247, 0.5);
        }
        .data-format {
            background: #1c1c1e;
            border: 1px solid rgba(86, 189, 247, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin: 15px 0;
        }
        .data-format h4 {
            color: #56BDF7;
            margin-bottom: 15px;
            font-size: 1.2em;
            font-weight: 600;
        }
        .field {
            padding: 10px 0;
            border-bottom: 1px solid rgba(86, 189, 247, 0.1);
        }
        .field:last-child {
            border-bottom: none;
        }
        .field-name {
            font-weight: 600;
            color: #e5e5e7;
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
        }
        .field-type {
            color: #a1a1a6;
            font-size: 0.9em;
        }
        .notes {
            background: rgba(225, 49, 45, 0.1);
            border-left: 4px solid #E1312D;
            padding: 20px;
            border-radius: 12px;
            margin-top: 30px;
            border: 1px solid rgba(225, 49, 45, 0.2);
        }
        .notes h3 {
            color: #E1312D;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .notes ul {
            list-style: none;
            padding-left: 0;
        }
        .notes li {
            padding: 8px 0;
            padding-left: 30px;
            position: relative;
            color: #a1a1a6;
        }
        .notes li::before {
            content: "⚠️";
            position: absolute;
            left: 0;
        }
        .footer {
            background: #0a0a0a;
            padding: 25px;
            text-align: center;
            color: #a1a1a6;
            border-top: 1px solid rgba(86, 189, 247, 0.1);
        }
        .footer code {
            background: rgba(86, 189, 247, 0.15);
            padding: 3px 8px;
            border-radius: 4px;
            color: #56BDF7;
            font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        .sub-feature {
            margin-left: 20px;
            margin-top: 20px;
            padding-left: 20px;
            border-left: 2px solid rgba(86, 189, 247, 0.3);
        }
        .sub-feature-title {
            color: #56BDF7;
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2em;
            }
            .content {
                padding: 20px;
            }
            .feature-section {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Biotriagem API</h1>
            <p>Sistema de triagem biomédica</p>
            <span class="version">v1.0.0</span>
        </div>
        
        <div class="content">
            <!-- Feature: Login -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">🔐</div>
                    <div>
                        <div class="feature-title">Login</div>
                        <div class="feature-description">Autenticação de usuários</div>
                    </div>
                </div>
                
                <div class="endpoint">
                    <div class="endpoint-path">
                        <span class="method post">POST</span>/api/login
                    </div>
                    <div class="description">Realiza login do usuário e retorna token JWT</div>
                    <div class="details">
                        <div class="details-title">Body:</div>
                        <div class="code-block">{
  "email": "string" <span class="badge required">required</span>,
  "password": "string" <span class="badge required">required</span>
}</div>
                        <div class="details-title">Response:</div>
                        <div class="code-block">{
  "professional_id": 1,
  "company_name": "string",
  "email": "string",
  "token": "string (JWT)"
}</div>
                    </div>
                </div>
            </div>
            
            <!-- Feature: ForgotPassword -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">🔑</div>
                    <div>
                        <div class="feature-title">Forgot Password</div>
                        <div class="feature-description">Recuperação de senha</div>
                    </div>
                </div>
                
                <div class="endpoint">
                    <div class="endpoint-path">
                        <span class="method post">POST</span>/api/forgot-password
                    </div>
                    <div class="description">Solicita recuperação de senha por email</div>
                    <div class="details">
                        <div class="details-title">Body:</div>
                        <div class="code-block">{
  "email": "string" <span class="badge required">required</span>
}</div>
                        <div class="details-title">Response:</div>
                        <div class="code-block">{
  "success": true,
  "message": "Password recovery email sent"
}</div>
                    </div>
                </div>
            </div>
            
            <!-- Feature: Home -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">🏠</div>
                    <div>
                        <div class="feature-title">Home</div>
                        <div class="feature-description">Tela inicial com informações do usuário e lista de pacientes</div>
                    </div>
                </div>
                
                <div class="sub-feature">
                    <div class="sub-feature-title">👤 User</div>
                    <div class="endpoint">
                        <div class="endpoint-path">
                            <span class="method get">GET</span>/api/user
                        </div>
                        <div class="description">Retorna informações do usuário autenticado</div>
                        <div class="details">
                            <div class="details-title">Headers:</div>
                            <div class="code-block">Authorization: Bearer &lt;token&gt; <span class="badge required">required</span></div>
                            <div class="details-title">Response:</div>
                            <div class="code-block">{
  "uid": "string",
  "name": "string",
  "lastName": "string",
  "email": "string"
}</div>
                        </div>
                    </div>
                </div>
                
                <div class="sub-feature">
                    <div class="sub-feature-title">👥 Patients</div>
                    <div class="endpoint">
                        <div class="endpoint-path">
                            <span class="method get">GET</span>/api/patients
                        </div>
                        <div class="description">Retorna lista de pacientes do profissional</div>
                        <div class="details">
                            <div class="details-title">Headers:</div>
                            <div class="code-block">Authorization: Bearer &lt;token&gt; <span class="badge required">required</span></div>
                            <div class="details-title">Response:</div>
                            <div class="code-block">{
  "patients": [Patient, ...]
}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Feature: PatientDetail -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">📋</div>
                    <div>
                        <div class="feature-title">Patient Detail</div>
                        <div class="feature-description">Detalhes do paciente e gerenciamento de exames</div>
                    </div>
                </div>
                
                <div class="sub-feature">
                    <div class="sub-feature-title">🔬 Exams</div>
                    <div class="endpoint">
                        <div class="endpoint-path">
                            <span class="method get">GET</span>/api/patients/:cpf/exams
                        </div>
                        <div class="description">Retorna lista de exames de um paciente específico</div>
                        <div class="details">
                            <div class="details-title">Params:</div>
                            <div class="code-block">cpf: string <span class="badge required">required</span> - CPF do paciente</div>
                            <div class="details-title">Headers:</div>
                            <div class="code-block">Authorization: Bearer &lt;token&gt; <span class="badge required">required</span></div>
                            <div class="details-title">Response:</div>
                            <div class="code-block">{
  "exams": [Exam, ...]
}</div>
                        </div>
                    </div>
                    
                    <div class="endpoint">
                        <div class="endpoint-path">
                            <span class="method post">POST</span>/api/patients/:cpf/exams
                        </div>
                        <div class="description">Cria um novo exame para um paciente</div>
                        <div class="details">
                            <div class="details-title">Params:</div>
                            <div class="code-block">cpf: string <span class="badge required">required</span> - CPF do paciente</div>
                            <div class="details-title">Headers:</div>
                            <div class="code-block">Authorization: Bearer &lt;token&gt; <span class="badge required">required</span></div>
                            <div class="details-title">Body:</div>
                            <div class="code-block">{
  "picture": "string" <span class="badge optional">optional</span>,
  "type": "string" <span class="badge required">required</span>,
  "name": "string" <span class="badge required">required</span>,
  "measures": [Measure, ...] <span class="badge optional">optional</span>,
  "objeto": ["string (Base64)", ...] <span class="badge optional">optional</span>
}</div>
                            <div class="details-title">Response:</div>
                            <div class="code-block">{
  "success": true
}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Feature: System -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">⚙️</div>
                    <div>
                        <div class="feature-title">System</div>
                        <div class="feature-description">Endpoints do sistema</div>
                    </div>
                </div>
                
                <div class="endpoint">
                    <div class="endpoint-path">
                        <span class="method get">GET</span>/health
                    </div>
                    <div class="description">Health check - Verifica status da API</div>
                    <div class="details">
                        <div class="details-title">Response:</div>
                        <div class="code-block">{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}</div>
                    </div>
                </div>
            </div>
            
            <!-- Data Formats -->
            <div class="feature-section">
                <div class="feature-header">
                    <div class="feature-icon">📊</div>
                    <div>
                        <div class="feature-title">Data Formats</div>
                        <div class="feature-description">Estrutura dos modelos de dados</div>
                    </div>
                </div>
                
                <div class="data-format">
                    <h4>Patient</h4>
                    <div class="field"><span class="field-name">id</span> <span class="field-type">number</span></div>
                    <div class="field"><span class="field-name">name</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">cpf</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">email</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">address_complement</span> <span class="field-type">string | null</span></div>
                    <div class="field"><span class="field-name">date_born</span> <span class="field-type">string (ISO 8601)</span></div>
                    <div class="field"><span class="field-name">created_at</span> <span class="field-type">string (ISO 8601)</span></div>
                    <div class="field"><span class="field-name">professional_id</span> <span class="field-type">number</span></div>
                    <div style="margin-top: 10px; color: #a1a1a6; font-size: 0.9em;">... e mais campos</div>
                </div>
                
                <div class="data-format">
                    <h4>Exam</h4>
                    <div class="field"><span class="field-name">id</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">tipo</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">nome</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">data</span> <span class="field-type">string (ISO 8601)</span></div>
                    <div class="field"><span class="field-name">measures</span> <span class="field-type">Array&lt;Measure&gt; | null</span></div>
                    <div class="field"><span class="field-name">objeto</span> <span class="field-type">Array&lt;string (Base64)&gt; | null</span></div>
                </div>
                
                <div class="data-format">
                    <h4>Measure</h4>
                    <div class="field"><span class="field-name">name</span> <span class="field-type">string</span></div>
                    <div class="field"><span class="field-name">distance</span> <span class="field-type">number (metros)</span></div>
                    <div class="field"><span class="field-name">firstPoint</span> <span class="field-type">number[] | null</span></div>
                    <div class="field"><span class="field-name">lastPoint</span> <span class="field-type">number[] | null</span></div>
                </div>
            </div>
            
            <div class="notes">
                <h3>⚠️ Notas Importantes</h3>
                <ul>
                    <li>Todos os endpoints (exceto /health e /) requerem autenticação via Bearer token no header Authorization</li>
                    <li>As datas devem ser enviadas no formato ISO 8601 (ex: 2024-01-15T10:30:00.000Z)</li>
                    <li>Os arquivos OBJ devem ser enviados como array de strings Base64</li>
                    <li>O CPF deve ser enviado sem formatação (apenas números) ou com formatação padrão (xxx.xxx.xxx-xx)</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>Biotriagem API v1.0.0 | Base URL: ${req.protocol}://${req.get('host')}</p>
            <p style="margin-top: 8px; font-size: 0.9em;">
                Para JSON, adicione <code>Accept: application/json</code> no header | 
                <a href="/logs" style="color: #56BDF7; text-decoration: none; margin-left: 10px;">📊 Request Monitor</a>
            </p>
        </div>
    </div>
</body>
</html>
    `);
    return;
  }
  
  // Retorna JSON formatado para clientes que preferem JSON (organizado por features BFF)
  res.json({
    name: 'Biotriagem API',
    version: '1.0.0',
    description: 'API REST para Biotriagem - Sistema de triagem biomédica',
    architecture: 'BFF (Backend for Frontend) - Organizado por features',
    baseUrl: `${req.protocol}://${req.get('host')}`,
    features: {
      login: {
        name: 'Login',
        description: 'Autenticação de usuários',
        endpoints: {
          'POST /api/login': {
            description: 'Realiza login do usuário e retorna token JWT',
            body: {
              email: 'string (required)',
              password: 'string (required)'
            },
            response: {
              professional_id: 'number',
              company_name: 'string',
              email: 'string',
              token: 'string (JWT)'
            }
          }
        }
      },
      forgotPassword: {
        name: 'Forgot Password',
        description: 'Recuperação de senha',
        endpoints: {
          'POST /api/forgot-password': {
            description: 'Solicita recuperação de senha por email',
            body: {
              email: 'string (required)'
            },
            response: {
              success: 'boolean',
              message: 'string'
            }
          }
        }
      },
      home: {
        name: 'Home',
        description: 'Tela inicial com informações do usuário e lista de pacientes',
        subFeatures: {
          user: {
            name: 'User',
            endpoints: {
              'GET /api/user': {
                description: 'Retorna informações do usuário autenticado',
                headers: {
                  Authorization: 'Bearer <token> (required)'
                },
                response: {
                  uid: 'string',
                  name: 'string',
                  lastName: 'string',
                  email: 'string'
                }
              }
            }
          },
          patients: {
            name: 'Patients',
            endpoints: {
              'GET /api/patients': {
                description: 'Retorna lista de pacientes do profissional',
                headers: {
                  Authorization: 'Bearer <token> (required)'
                },
                response: {
                  patients: 'Array<Patient>'
                }
              }
            }
          }
        }
      },
      patientDetail: {
        name: 'Patient Detail',
        description: 'Detalhes do paciente e gerenciamento de exames',
        subFeatures: {
          exams: {
            name: 'Exams',
            endpoints: {
              'GET /api/patients/:cpf/exams': {
                description: 'Retorna lista de exames de um paciente específico',
                params: {
                  cpf: 'string (required) - CPF do paciente'
                },
                headers: {
                  Authorization: 'Bearer <token> (required)'
                },
                response: {
                  exams: 'Array<Exam>'
                }
              },
              'POST /api/patients/:cpf/exams': {
                description: 'Cria um novo exame para um paciente',
                params: {
                  cpf: 'string (required) - CPF do paciente'
                },
                headers: {
                  Authorization: 'Bearer <token> (required)'
                },
                body: {
                  picture: 'string (optional)',
                  type: 'string (required)',
                  name: 'string (required)',
                  measures: 'Array<Measure> (optional)',
                  objeto: 'Array<string> (optional) - Base64 encoded OBJ files'
                },
                response: {
                  success: 'boolean'
                }
              }
            }
          }
        }
      },
      system: {
        name: 'System',
        description: 'Endpoints do sistema',
        endpoints: {
          'GET /health': {
            description: 'Health check - Verifica status da API',
            response: {
              status: 'string',
              timestamp: 'string (ISO 8601)'
            }
          },
          'GET /': {
            description: 'Documentação da API - Lista todos os endpoints disponíveis'
          }
        }
      }
    },
    dataFormats: {
      Patient: {
        id: 'number',
        name: 'string',
        cpf: 'string',
        email: 'string',
        state: 'string',
        cep: 'string',
        city: 'string',
        occupation: 'string',
        phone: 'string',
        observation: 'string | null',
        ethnicity: 'string',
        address: 'string',
        address_complement: 'string | null',
        address_number: 'string',
        date_born: 'string (ISO 8601)',
        facebook_link: 'string | null',
        foreign_document: 'string | null',
        health_plan: 'string',
        instagram_link: 'string | null',
        level_physical: 'string',
        whatsapp_link: 'string',
        gender: 'string',
        created_at: 'string (ISO 8601)',
        updated_at: 'string (ISO 8601)',
        professional_id: 'number'
      },
      Exam: {
        id: 'string',
        picture: 'string | null',
        tipo: 'string',
        nome: 'string',
        data: 'string (ISO 8601)',
        measures: 'Array<Measure> | null',
        objeto: 'Array<string> | null - Base64 encoded OBJ files'
      },
      Measure: {
        name: 'string',
        distance: 'number (meters)',
        firstPoint: 'number[] | null',
        lastPoint: 'number[] | null'
      }
    },
    notes: [
      'Todos os endpoints (exceto /health e /) requerem autenticação via Bearer token no header Authorization',
      'As datas devem ser enviadas no formato ISO 8601 (ex: 2024-01-15T10:30:00.000Z)',
      'Os arquivos OBJ devem ser enviados como array de strings Base64',
      'O CPF deve ser enviado sem formatação (apenas números) ou com formatação padrão (xxx.xxx.xxx-xx)'
    ]
  });
});

// Routes
app.use(routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Request logs dashboard endpoint
app.get('/logs', (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biotriagem API - Request Monitor</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #e5e5e7;
            line-height: 1.6;
            padding: 0;
            min-height: 100vh;
        }
        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: #1c1c1e;
            min-height: 100vh;
        }
        .header {
            background: linear-gradient(135deg, #0F2F65 0%, #004580 100%);
            color: white;
            padding: 30px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(86, 189, 247, 0.2);
        }
        .header h1 {
            font-size: 2em;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
        }
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #51cf66;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 0.9em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            background: rgba(86, 189, 247, 0.2);
            color: #56BDF7;
            border: 1px solid rgba(86, 189, 247, 0.3);
        }
        .btn:hover {
            background: rgba(86, 189, 247, 0.3);
            transform: translateY(-1px);
        }
        .stats {
            background: #2c2c2e;
            padding: 20px 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            border-bottom: 1px solid rgba(86, 189, 247, 0.1);
        }
        .stat-card {
            background: #1c1c1e;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(86, 189, 247, 0.1);
        }
        .stat-label {
            color: #a1a1a6;
            font-size: 0.85em;
            margin-bottom: 5px;
        }
        .stat-value {
            color: #56BDF7;
            font-size: 1.5em;
            font-weight: 600;
        }
        .logs-container {
            padding: 20px 40px;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
        }
        .log-item {
            background: #2c2c2e;
            border-left: 3px solid #56BDF7;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            border: 1px solid rgba(86, 189, 247, 0.1);
            transition: all 0.2s;
        }
        .log-item:hover {
            border-color: rgba(86, 189, 247, 0.4);
            transform: translateX(3px);
        }
        .log-item.error {
            border-left-color: #E1312D;
        }
        .log-item.success {
            border-left-color: #51cf66;
        }
        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .log-method {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.8em;
            margin-right: 10px;
        }
        .log-method.GET { background: #56BDF7; color: #0F2F65; }
        .log-method.POST { background: #E1312D; color: white; }
        .log-method.PUT { background: #ffc107; color: #000; }
        .log-method.DELETE { background: #dc3545; color: white; }
        .log-path {
            font-family: 'SF Mono', 'Monaco', monospace;
            color: #e5e5e7;
            font-size: 0.95em;
            flex: 1;
        }
        .log-status {
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.8em;
        }
        .log-status.success { background: rgba(81, 207, 102, 0.2); color: #51cf66; }
        .log-status.error { background: rgba(225, 49, 45, 0.2); color: #E1312D; }
        .log-meta {
            display: flex;
            gap: 15px;
            font-size: 0.85em;
            color: #a1a1a6;
            margin-top: 10px;
        }
        .log-details {
            margin-top: 15px;
            display: none;
        }
        .log-details.expanded {
            display: block;
        }
        .detail-section {
            background: #1c1c1e;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        .detail-title {
            color: #56BDF7;
            font-weight: 600;
            font-size: 0.85em;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .code-block {
            background: #0a0a0a;
            color: #56BDF7;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'SF Mono', 'Monaco', monospace;
            font-size: 0.85em;
            border: 1px solid rgba(86, 189, 247, 0.2);
            max-height: 300px;
            overflow-y: auto;
        }
        .toggle-btn {
            background: rgba(86, 189, 247, 0.1);
            border: 1px solid rgba(86, 189, 247, 0.3);
            color: #56BDF7;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.8em;
            cursor: pointer;
            margin-top: 10px;
        }
        .toggle-btn:hover {
            background: rgba(86, 189, 247, 0.2);
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #a1a1a6;
        }
        .empty-state-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Request Monitor</h1>
            <div class="header-controls">
                <div class="status-indicator">
                    <div class="status-dot"></div>
                    <span>Live</span>
                </div>
                <button class="btn" onclick="clearLogs()">Clear Logs</button>
                <button class="btn" onclick="location.href='/'">← Documentation</button>
            </div>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <div class="stat-label">Total Requests</div>
                <div class="stat-value" id="stat-total">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg Response Time</div>
                <div class="stat-value" id="stat-avg">0ms</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Success Rate</div>
                <div class="stat-value" id="stat-success">0%</div>
            </div>
        </div>
        
        <div class="logs-container" id="logs-container">
            <div class="empty-state">
                <div class="empty-state-icon">📡</div>
                <p>Waiting for requests...</p>
            </div>
        </div>
    </div>

    <script>
        const logsContainer = document.getElementById('logs-container');
        let logs = [];
        let loadedInitialLogs = false;
        const logIds = new Set(); // Para evitar duplicação
        
        // Carrega logs iniciais primeiro
        fetch('/logs/api')
            .then(res => res.json())
            .then(data => {
                logs = data.logs || [];
                logs.forEach(log => logIds.add(log.id)); // Marca IDs já carregados
                loadedInitialLogs = true;
                updateStats();
                renderLogs();
                
                // Conecta ao SSE apenas após carregar logs iniciais
                connectSSE();
            });
        
        function connectSSE() {
            // Conecta ao SSE
            const eventSource = new EventSource('/logs/stream');
            
            eventSource.onmessage = function(event) {
                // Ignora pings
                if (event.data.trim() === 'ping') return;
                
                try {
                    const log = JSON.parse(event.data);
                    addLog(log);
                } catch (e) {
                    console.error('Error parsing SSE data:', e);
                }
            };
            
            eventSource.onerror = function(error) {
                console.error('SSE Error:', error);
                // Tenta reconectar após 3 segundos
                setTimeout(() => {
                    if (eventSource.readyState === EventSource.CLOSED) {
                        connectSSE();
                    }
                }, 3000);
            };
        }
        
        function addLog(log) {
            // Evita duplicação verificando o ID
            if (logIds.has(log.id)) {
                return; // Log já existe, ignora
            }
            
            logIds.add(log.id);
            logs.unshift(log);
            if (logs.length > 1000) {
                const removed = logs.pop();
                logIds.delete(removed.id);
            }
            updateStats();
            renderLogs();
        }
        
        function updateStats() {
            const total = logs.length;
            const successful = logs.filter(l => l.statusCode && l.statusCode < 400).length;
            const avgTime = logs.filter(l => l.responseTime).reduce((sum, l) => sum + l.responseTime, 0) / logs.filter(l => l.responseTime).length || 0;
            
            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-avg').textContent = Math.round(avgTime) + 'ms';
            document.getElementById('stat-success').textContent = total > 0 ? Math.round((successful / total) * 100) + '%' : '0%';
        }
        
        function renderLogs() {
            if (logs.length === 0) {
                logsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📡</div><p>Waiting for requests...</p></div>';
                return;
            }
            
            logsContainer.innerHTML = logs.map(log => {
                const statusClass = log.statusCode >= 400 ? 'error' : log.statusCode >= 200 && log.statusCode < 300 ? 'success' : '';
                const statusText = log.statusCode ? (log.statusCode >= 400 ? 'Error' : 'Success') : 'Pending';
                const statusBadge = log.statusCode ? \`<span class="log-status \${log.statusCode >= 400 ? 'error' : 'success'}">\${log.statusCode} - \${statusText}</span>\` : '<span class="log-status">Pending</span>';
                
                return \`
                    <div class="log-item \${statusClass}" data-id="\${log.id}">
                        <div class="log-header">
                            <div>
                                <span class="log-method \${log.method}">\${log.method}</span>
                                <span class="log-path">\${log.path}</span>
                            </div>
                            \${statusBadge}
                        </div>
                        <div class="log-meta">
                            <span>⏱️ \${log.responseTime ? log.responseTime + 'ms' : '...'}</span>
                            <span>🕐 \${new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <button class="toggle-btn" onclick="toggleDetails('\${log.id}')">Show Details</button>
                        <div class="log-details" id="details-\${log.id}">
                            \${log.query ? \`<div class="detail-section"><div class="detail-title">Query Params</div><div class="code-block">\${JSON.stringify(log.query, null, 2)}</div></div>\` : ''}
                            \${log.body ? \`<div class="detail-section"><div class="detail-title">Request Body</div><div class="code-block">\${JSON.stringify(log.body, null, 2)}</div></div>\` : ''}
                            \${log.responseBody ? \`<div class="detail-section"><div class="detail-title">Response Body</div><div class="code-block">\${JSON.stringify(log.responseBody, null, 2)}</div></div>\` : ''}
                            \${log.error ? \`<div class="detail-section"><div class="detail-title">Error</div><div class="code-block" style="color: #E1312D;">\${log.error}</div></div>\` : ''}
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function toggleDetails(id) {
            const details = document.getElementById('details-' + id);
            const btn = details.previousElementSibling;
            if (details.classList.contains('expanded')) {
                details.classList.remove('expanded');
                btn.textContent = 'Show Details';
            } else {
                details.classList.add('expanded');
                btn.textContent = 'Hide Details';
            }
        }
        
        function clearLogs() {
            if (confirm('Clear all logs?')) {
                fetch('/logs/api', { method: 'DELETE' })
                    .then(() => {
                        logs = [];
                        logIds.clear();
                        updateStats();
                        renderLogs();
                    });
            }
        }
        
        // Auto-scroll para novos logs
        const observer = new MutationObserver(() => {
            if (logs.length > 0 && logsContainer.children[0] && logsContainer.children[0].classList.contains('log-item')) {
                logsContainer.scrollTop = 0;
            }
        });
        observer.observe(logsContainer, { childList: true });
    </script>
</body>
</html>
  `);
});

// API endpoint para buscar logs
app.get('/logs/api', (req: Request, res: Response) => {
  const logs = requestLogger.getRecentLogs(100);
  const stats = requestLogger.getStats();
  res.json({ logs, stats });
});

// API endpoint para limpar logs
app.delete('/logs/api', (req: Request, res: Response) => {
  requestLogger.clearLogs();
  res.json({ success: true });
});

// SSE endpoint para streaming de logs em tempo real
app.get('/logs/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // NÃO envia logs iniciais aqui - o frontend já carrega via /logs/api
  // Isso evita duplicação
  
  // Subscribe apenas para novos logs (não os que já existem)
  const unsubscribe = requestLogger.subscribe((log) => {
    try {
      res.write(`data: ${JSON.stringify(log)}\n\n`);
    } catch (error) {
      console.error('[SSE] Error writing to stream:', error);
      unsubscribe();
    }
  });
  
  // Cleanup quando cliente desconecta
  req.on('close', () => {
    unsubscribe();
    res.end();
  });
  
  // Keep-alive ping
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch (error) {
      clearInterval(pingInterval);
      unsubscribe();
    }
  }, 30000);
  
  req.on('close', () => {
    clearInterval(pingInterval);
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only if not in serverless environment (Vercel)
// Vercel will handle the serverless execution
// Check for Vercel environment variables
const isVercel = process.env.VERCEL === '1' || 
                 process.env.VERCEL_ENV !== undefined || 
                 process.env.VERCEL_URL !== undefined ||
                 typeof process.env.LAMBDA_TASK_ROOT !== 'undefined' ||
                 typeof process.env.AWS_LAMBDA_FUNCTION_NAME !== 'undefined' ||
                 process.env.NOW_REGION !== undefined; // Vercel legacy

// Also check if we're being required (not executed directly)
const isRequired = require.main !== module;

if (!isVercel && !isRequired) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  GET    /                    - API Documentation`);
    console.log(`  GET    /logs                - Request Monitor (Live)`);
    console.log(`  POST   /api/login`);
    console.log(`  GET    /api/user`);
    console.log(`  GET    /api/patients`);
    console.log(`  GET    /api/patients/:cpf/exams`);
    console.log(`  POST   /api/patients/:cpf/exams`);
    console.log(`  GET    /health`);
    console.log(`\n📖 Visit http://localhost:${PORT} for API documentation`);
    console.log(`📊 Visit http://localhost:${PORT}/logs for request monitor\n`);
  });
} else {
  if (isVercel) {
    console.log('🌐 Running in serverless mode (Vercel)');
  } else if (isRequired) {
    console.log('📦 Module loaded as dependency (serverless mode)');
  }
}

export default app;

