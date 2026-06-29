<div align="center">

# 🧠 StockMind

**Plataforma de Inteligência Operacional para Varejo Farmacêutico**

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-orange?style=flat-square&logo=rabbitmq)](https://www.rabbitmq.com/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)](https://redis.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> 🚧 **MVP em desenvolvimento ativo.**

</div>

---

## O Problema

Redes de farmácias de médio porte operam no escuro. Seus ERPs respondem **"Quanto eu tenho em estoque?"** — uma visão de retrovisor. Enquanto isso, três hemorragias financeiras sangram silenciosamente todo mês:

- Medicamentos de uso contínuo em falta fazem o cliente ir para a concorrência — e não voltar.
- Capital de giro travado em excesso de estoque de baixo giro que nunca gira.
- Lotes próximos ao vencimento viram prejuízo direto e custo de descarte.

## A Proposta

O StockMind é um **Decision Co-pilot** — não é um ERP. Ele responde **"Quanto eu deveria ter e o que devo comprar hoje?"**. Transforma dados brutos de vendas e estoque em decisões automatizadas que impactam diretamente o caixa do cliente.

---

## Fluxo de ponta a ponta

```
01:00 AM — Scheduler dispara gatilho via RabbitMQ
  → NightlyForecastTriggerPublisher publica {"event": "start_nightly_forecast", "date": "2026-06-24"}
  → AI Engine (Python) recebe o gatilho
  → Python conecta ao PostgreSQL em modo leitura
  → pandas.read_sql extrai histórico de vendas e estoque atual
  → Prophet + Scikit-Learn rodam os modelos de previsão
  → Previsões publicadas via RabbitMQ → Java consome e persiste em tb_forecasts
  → Recomendações de compra geradas → Java salva em tb_purchase_recommendations
  → Redis atualiza cache dos KPIs do dashboard
07:00 AM — Gerente abre o dashboard com tudo pronto em milissegundos
  → Aprova ou rejeita recomendações de compra (Human-in-the-loop)
```

---

## Os 3 KPIs que Mudam o Jogo

| KPI | O que mede | Impacto Financeiro |
|---|---|---|
| **Ruptura da Curva A** | % de indisponibilidade + R$ de vendas perdidas estimadas | Recuperação de receita |
| **Capital Travado** | R$ imobilizado em estoque acima de 30 dias de cobertura | Liberação de caixa |
| **Risco de Vencimento** | R$ em lotes críticos (< 60 dias) com baixo giro | Prevenção de prejuízo |

---

## Decisões de Arquitetura

### Separação de Responsabilidades por Linguagem

O backend Java (Spring Boot) gerencia autenticação, regras de negócio transacionais, APIs REST e persistência. O motor Python é isolado e focado exclusivamente em Data Prep e inferência de modelos. Nenhum dos dois invade o domínio do outro.

### Gatilho Leve no RabbitMQ — Dados Pesados no PostgreSQL

O RabbitMQ trafega apenas ordens e pequenos payloads de integração. O Java envia um gatilho mínimo `{"event": "start_nightly_forecast", "date": "..."}` e o Python conecta diretamente ao PostgreSQL para extrair volumes massivos via `pandas.read_sql`. O banco de dados é feito para isso; o broker não.

### Batch Processing Noturno

O motor de inteligência não processa previsões em tempo real sob demanda. O processamento roda em lote na madrugada para não onerar a infraestrutura em horário comercial e garantir que os dados estejam prontos quando o gerente precisar.

### Human-in-the-loop nas Recomendações

A IA sugere ordens de compra com quantidade, justificativa e impacto financeiro estimado. O humano aprova ou rejeita. Autonomia total fica para o roadmap futuro — após confiança estabelecida com o cliente.

---

## Módulos do MVP

| Módulo | Responsabilidade |
|---|---|
| **Agente de Previsão** | Analisa histórico de vendas, sazonalidade e tendências via Prophet/Scikit-Learn |
| **Agente de Compras** | Cruza previsão com estoque atual e gera recomendações de compra precisas |
| **Dashboard Operacional** | Interface em tempo real focada nos 3 KPIs financeiros |

---

## Stack

### Backend

| Tecnologia | Versão | Papel |
|---|---|---|
| Java | 21 | Runtime principal com Virtual Threads |
| Spring Boot | 3.5.0 | Framework core, APIs REST, segurança |
| PostgreSQL | 16 | Persistência relacional com auditoria |
| RabbitMQ | 3.13 | Mensageria assíncrona com DLQ |
| Redis | 7 | Cache de KPIs e consultas pesadas do dashboard |
| Flyway | — | Migrations versionadas |
| Python | 3.12 | Motor isolado de inteligência de dados |
| Prophet + Scikit-Learn | — | Forecasting de demanda |

### Frontend

| Tecnologia | Versão | Papel |
|---|---|---|
| Next.js + TypeScript | 15 / 5 | Dashboard operacional com SSR |
| Tailwind CSS | — | Estilização |

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- Java 21+
- Maven 3.9+
- Python 3.12+
- Node.js 22+
- Docker + Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/Matheusfelislino/StockMind.git
cd StockMind
```

### 2. Suba a infraestrutura

```bash
docker-compose up -d postgres redis rabbitmq
```

| Serviço | Porta local |
|---|---|
| PostgreSQL | 5432 |
| RabbitMQ AMQP | 5672 |
| RabbitMQ UI | 15672 |
| Redis | 6379 |

### 3. Suba o backend

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Acesse: http://localhost:8080/actuator/health

### 4. Suba o AI Engine

```bash
cd ai-engine
pip install -r requirements.txt
python -m app.main
```

### 5. Suba o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000

### 6. Rodar tudo com Docker (produção local)

```bash
docker-compose up -d
```

---

## Estrutura do Projeto

```
stockmind/
├── backend/        # Java 21 + Spring Boot (Core, APIs, Mensageria)
├── ai-engine/      # Python + Prophet + Scikit-Learn (Motor de IA)
├── frontend/       # Next.js + TypeScript (Dashboard)
├── infra/          # Prometheus + Grafana
└── docker-compose.yml
```

---

## 🗺️ Roadmap

| Épico | Status |
|---|---|
| Planejamento de arquitetura e domínio | ✅ Concluído |
| Schema do banco de dados — Flyway migrations | ✅ Concluído |
| Entidades JPA + Repositories + DTOs | ✅ Concluído |
| Services + Controllers + Dashboard KPIs | ✅ Concluído |
| RabbitMQ Config + Redis Config | ✅ Concluído |
| Publisher + Consumers + Scheduler | ✅ Concluído |
| Security Config + CORS | ✅ Concluído |
| Docker + docker-compose | ✅ Concluído |
| AI Engine — Prophet + Recomendações | ✅ Concluído |
| Dashboard Next.js com KPIs em tempo real | ✅ Concluído |
| Dados de teste e validação do fluxo | ✅ Concluído |
| Simulador de Cenários | 🔒 Futuro |
| Agente Executivo LLM | 🔒 Futuro |
| Automação de Compra 100% Autônoma | 🔒 Futuro |
| Autenticação JWT | 🔒 Futuro |

---

<div align="center">
  <sub>Construído por <a href="https://github.com/Matheusfelislino">Matheus Felis Lino</a></sub>
</div>