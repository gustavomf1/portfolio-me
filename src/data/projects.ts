import type { Project } from "./types";

// Conteúdo portado do protótipo (Portfolio.dc.html). Edite aqui; o layout não muda.
// PRINTS: coloque o arquivo em public/assets/projects/<slot> e preencha `imagem` com o caminho.
export const projects: Project[] = [
  {
    "slug": "safecore",
    "nome": "SafeCore",
    "categorias": [
      "IA",
      "Backend",
      "Frontend",
      "Mobile",
      "Arquitetura"
    ],
    "destaque": true,
    "selo": "Em produção · proposta enterprise",
    "resumo": "SaaS B2B de gestão de segurança em engenharia (NR-01, ISO 45001), com fluxo de Não Conformidade, auditoria imutável e IA para leitura de normas.",
    "stack": [
      "Spring Boot",
      "JPA/Hibernate",
      "PostgreSQL",
      "Flyway",
      "React",
      "TypeScript",
      "TanStack Query",
      "Zod",
      "Tailwind",
      "Flutter",
      "AWS S3",
      "Claude API"
    ],
    "links": {
      "privado": true
    },
    "briefing": {
      "contexto": "Plataforma SaaS B2B para gestão de segurança em engenharia, aderente à NR-01 e à ISO 45001. Proposta comercial enterprise em andamento com uma operadora aeroportuária, cobrindo licenciamento SaaS e serviço de responsabilidade técnica.",
      "desafio": "Registrar e tratar não conformidades com rastreabilidade completa para auditoria, isolando dados por cliente, e acelerar a consulta a normas regulatórias extensas.",
      "construi": [
        "Fluxo de Não Conformidade com state machine de 6 estados.",
        "Auditoria imutável e snapshots point-in-time.",
        "Arquitetura multi-tenant com RBAC.",
        "Busca e extração de trechos relevantes em normas com Claude Haiku 4.5.",
        "Extração de resumos de PDFs guiada por prompt livre do usuário.",
        "App mobile em Flutter com upload de evidências (câmera + geolocalização) para AWS S3."
      ],
      "decisoes": [
        "Notificações assíncronas com @Async + @TransactionalEventListener, disparadas só após o commit.",
        "Prompt iterado para retornar todos os trechos pertinentes; max_tokens ajustado de 1024 para 4096.",
        "Sanitização da resposta do modelo para JSON antes de qualquer uso.",
        "Timeouts alinhados entre nginx e axios para respostas de 30 a 40 s."
      ],
      "resultado": "Produto em produção e base de uma proposta enterprise com cliente real do setor aeroportuário."
    },
    "slot": "safecore.png",
    "prints": [
      {
        "src": "/assets/projects/safecore-1-login.png",
        "alt": "Tela de login do SafeCore, com o painel de apresentação do produto"
      },
      {
        "src": "/assets/projects/safecore-2-ocorrencias.png",
        "alt": "Lista de ocorrências do SafeCore com filtros por status e papel"
      },
      {
        "src": "/assets/projects/safecore-3-detalhe.png",
        "alt": "Detalhe de uma Não Conformidade com matriz de risco e responsáveis"
      },
      {
        "src": "/assets/projects/safecore-4-cinco-porques.png",
        "alt": "Análise de causa raiz (5 porquês) e plano de atividades aprovado"
      }
    ]
  },
  {
    "slug": "erp-de-leiloes",
    "nome": "ERP de Leilões",
    "categorias": [
      "Backend",
      "Frontend",
      "Arquitetura"
    ],
    "destaque": true,
    "resumo": "Lances em tempo real via WebSocket/STOMP e RabbitMQ, cache em Redis e regras financeiras transacionais.",
    "stack": [
      "Spring Boot",
      "WebSocket/STOMP",
      "RabbitMQ",
      "Redis",
      "Angular",
      "RxJS",
      "TestContainers",
      "Docker Compose"
    ],
    "links": {
      "privado": true
    },
    "briefing": {
      "contexto": "ERP para operação de leilões com lances ao vivo e gestão financeira.",
      "desafio": "Manter consistência financeira com muitos lances concorrentes e painéis atualizados em tempo real.",
      "construi": [
        "Lances em tempo real com WebSocket/STOMP + RabbitMQ (AMQP).",
        "Cache distribuído em Redis.",
        "Regras financeiras: PIX, faturas, taxas, comissões e fechamento de leilão.",
        "Painel admin em Angular + RxJS com atualização ao vivo e cache offline em IndexedDB.",
        "Dashboard com movimentação bruta, lotes e animais vendidos, e vendas por sexo e por raça.",
        "Geração da nota de leilão em PDF (contrato de compra e venda com comissões de comprador e vendedor).",
        "Módulo de comunicação por WhatsApp: envio individual e em massa, de texto e mídia."
      ],
      "decisoes": [
        "Operações financeiras com @Transactional.",
        "Testes de integração com TestContainers.",
        "Ambiente completo em Docker Compose."
      ],
      "resultado": "Fluxo de leilão completo, do lance ao fechamento financeiro."
    },
    "slot": "leilao.png",
    "prints": [
      {
        "src": "/assets/projects/erp-2-dashboard.png",
        "alt": "Dashboard do ERP de leilões com movimentação bruta e vendas por sexo e raça"
      },
      {
        "src": "/assets/projects/erp-4-lotes.png",
        "alt": "Monitor de lotes de um leilão com status, preço atual e progresso de vendas"
      },
      {
        "src": "/assets/projects/erp-3-clientes.png",
        "alt": "Cadastro de clientes com busca, paginação e ações (dados anonimizados)"
      },
      {
        "src": "/assets/projects/erp-5-nota.png",
        "alt": "Nota de leilão em PDF: contrato de compra e venda com comissões (dados anonimizados)"
      },
      {
        "src": "/assets/projects/erp-6-whatsapp.png",
        "alt": "Módulo de comunicação por WhatsApp com envio individual e em massa"
      },
      {
        "src": "/assets/projects/erp-1-login.png",
        "alt": "Tela de login do ERP de leilões"
      }
    ]
  },
  {
    "slug": "fintrack-ai",
    "nome": "FinTrack AI",
    "categorias": [
      "IA",
      "Backend",
      "Frontend"
    ],
    "destaque": true,
    "resumo": "SaaS de finanças pessoais com duas integrações reais com LLM usando structured output: insights de gastos e classificação automática de transações.",
    "stack": [
      "NestJS",
      "Zod",
      "PostgreSQL",
      "Drizzle ORM",
      "Next.js",
      "TanStack Query",
      "Gemini API",
      "Jest",
      "JWT"
    ],
    "links": {
      "repo": [
        {
          "label": "fintrack-ai",
          "url": "https://github.com/gustavomf1/fintrack-ai"
        }
      ],
      "demo": "https://fintrack-ai-frontend-pi.vercel.app/login"
    },
    "briefing": {
      "contexto": "Aplicação de finanças pessoais com design dark próprio, construída para explorar IA aplicada a dados do usuário.",
      "desafio": "Usar LLM para gerar valor real sem abrir mão de previsibilidade: saídas estruturadas, validadas e com o usuário no controle.",
      "construi": [
        "API NestJS com ZodValidationPipe customizado.",
        "PostgreSQL com Drizzle ORM e migrations manuais.",
        "Autenticação JWT hand-rolled: guard CanActivate, cookie httpOnly, rotas escopadas por usuário e CRUD com controle de ownership.",
        "Frontend Next.js (App Router, Server Components) com TanStack Query.",
        "Insights de padrão de gastos com severidade e recomendação acionável (Gemini + structured output).",
        "Classificação automática de transação em categoria com enum restrito e etapa de confirmar ou sobrescrever."
      ],
      "decisoes": [
        "Enum restrito no schema de saída para impedir categorias inventadas.",
        "Confirmação do usuário antes de persistir a classificação.",
        "Testes unitários com Jest."
      ],
      "resultado": "Duas funcionalidades de IA integradas ao fluxo do produto, com saída validada de ponta a ponta."
    },
    "slot": "fintrack.png",
    "prints": [
      {
        "src": "/assets/projects/fintrack-1-dashboard.png",
        "alt": "Dashboard do FinTrack com gastos do mês, nova transação, análise da IA e transações recentes"
      },
      {
        "src": "/assets/projects/fintrack-2-login.png",
        "alt": "Tela de login do FinTrack AI"
      }
    ]
  },
  {
    "slug": "microsservicos-event-driven",
    "nome": "Microsserviços Event-Driven",
    "categorias": [
      "Backend",
      "Arquitetura"
    ],
    "destaque": false,
    "resumo": "4 microsserviços Quarkus comunicando via Apache Kafka, com OpenTelemetry e propagação de token OIDC no gateway BFF.",
    "stack": [
      "Quarkus",
      "Apache Kafka",
      "SmallRye Reactive Messaging",
      "OpenTelemetry",
      "OIDC"
    ],
    "links": {
      "repo": [
        {
          "label": "quotation",
          "url": "https://github.com/gustavomf1/quotation-quarkus-kafka"
        },
        {
          "label": "proposal",
          "url": "https://github.com/gustavomf1/proposal-quarkus-kafka"
        },
        {
          "label": "report",
          "url": "https://github.com/gustavomf1/report-quarkus-kafka"
        },
        {
          "label": "gateway-bff",
          "url": "https://github.com/gustavomf1/gateway-bff-quarkus-kafka"
        }
      ]
    },
    "briefing": {
      "contexto": "Sistema de cotação e proposta dividido em serviços independentes: cotação, proposta, report e gateway-BFF.",
      "desafio": "Desacoplar serviços sem perder rastreabilidade das requisições nem a identidade do usuário entre eles.",
      "construi": [
        "Comunicação assíncrona via Kafka com SmallRye Reactive Messaging.",
        "Gateway BFF com propagação de token OIDC.",
        "Observabilidade distribuída com OpenTelemetry."
      ],
      "decisoes": [
        "Eventos como contrato entre serviços em vez de chamadas síncronas.",
        "BFF como único ponto de entrada autenticado."
      ],
      "resultado": "Quatro serviços independentes com tracing de ponta a ponta."
    },
    "diagrama": true
  },
  {
    "slug": "logtrack",
    "nome": "LogTrack",
    "categorias": [
      "Backend",
      "Frontend",
      "Arquitetura"
    ],
    "destaque": false,
    "resumo": "Rastreamento de lotes via RFID para logística e almoxarifado: backend, frontend e firmware ESP32 em um monorepo.",
    "stack": [
      "Quarkus",
      "Java 21",
      "PostgreSQL",
      "Angular",
      "Tailwind",
      "ESP32",
      "PlatformIO"
    ],
    "links": {
      "repo": [
        {
          "label": "logtrack",
          "url": "https://github.com/gustavomf1/logtrack"
        }
      ],
      "demo": "https://logtrack.gustavo-mf1.workers.dev/"
    },
    "briefing": {
      "contexto": "Projeto full stack com hardware (IoT) para rastrear lotes em logística e almoxarifado.",
      "desafio": "Ligar leitura física de RFID a um sistema web confiável.",
      "construi": [
        "Backend Quarkus com Java 21 e PostgreSQL.",
        "Frontend Angular + Tailwind.",
        "Firmware ESP32 (PlatformIO/Arduino) com simulação no Wokwi."
      ],
      "decisoes": [
        "Monorepo reunindo firmware, API e interface.",
        "Simulação Wokwi para desenvolver o firmware sem depender do hardware."
      ],
      "resultado": "Fluxo completo do leitor RFID até a tela."
    },
    "slot": "logtrack.png",
    "prints": [
      {
        "src": "/assets/projects/logtrack-1-visao-geral.png",
        "alt": "Painel Visão geral do LogTrack com lotes no estoque, localizados, sem zona e em atenção"
      },
      {
        "src": "/assets/projects/logtrack-2-login.png",
        "alt": "Tela de login do LogTrack, com leitor RFID em um armazém"
      }
    ]
  },
  {
    "slug": "insight-flow",
    "nome": "Insight Flow",
    "categorias": [
      "IA",
      "Backend",
      "Arquitetura"
    ],
    "destaque": false,
    "resumo": "Plataforma de análise de ativos do mercado financeiro, com camada de IA multi-provedor e validador determinístico de saída.",
    "stack": [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Alembic",
      "Claude",
      "OpenAI",
      "Ollama",
      "JWT"
    ],
    "links": {
      "repo": [
        {
          "label": "Insight-flow-backend",
          "url": "https://github.com/InsightF-AI/Insight-flow-backend"
        }
      ]
    },
    "briefing": {
      "contexto": "Projeto em equipe (organização InsightF-AI no GitHub), consumido por clientes web, mobile e desktop.",
      "desafio": "Integrar fontes de mercado heterogêneas e diferentes provedores de LLM sem acoplar o domínio a nenhum deles.",
      "construi": [
        "Backend FastAPI em camadas: domain, repositories (interfaces + SQLAlchemy), services e integrations.",
        "Integrações com brapi, Binance e BCB.",
        "Camada de IA com abstração de provedores (Claude, OpenAI, Ollama).",
        "Templates de prompt versionados e validador determinístico de saída (guardrails).",
        "Scheduler, JWT/bcrypt e testes."
      ],
      "decisoes": [
        "Repositórios por interface para trocar persistência sem tocar no domínio.",
        "Prompts versionados como artefato do código.",
        "Migrations com Alembic."
      ],
      "resultado": "Backend único servindo três clientes, com troca de provedor de LLM por configuração."
    },
    "slot": "insight-flow.png"
  }
];
