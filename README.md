# MVP Omr Studio Piloto

## Resumo Executivo do MVP
O objetivo do MVP é validar o fluxo completo de ingestão, processamento e visualização de dados acadêmicos no Omr Studio Piloto. A solução integra um painel web React, automações de orquestração com N8N e persistência em Supabase. O recorte atual prioriza o acompanhamento de turmas e avaliações via upload de planilhas e consulta rápida aos resultados.

### Decisões Travadas
- **Modelo de autenticação:** permanece o login único por link seguro enviado por e-mail institucional. A implementação de OAuth corporativo ficou para o pós-MVP.
- **Escopo de métricas:** as primeiras entregas abordam somente taxas de acerto e distribuição por questão; análises preditivas e dashboards comparativos foram postergados.
- **Personalização visual:** adota paleta tech-pop (rosa neon, hover profundo, fundos otimizados para OLED) controlada por tokens CSS de tema; variações por instituição seguem como evolução futura.

## Arquitetura da Solução
- **Frontend:** aplicação React + Vite com tipagem TypeScript, Zustand para estado global, TanStack Query para dados assíncronos e um hash router leve (`window.addEventListener('hashchange', renderView)`) que carrega `viewDados`, `viewSimulador`, `viewConexoes` ou `viewAjuda` conforme o fragmento da URL. O status da instância é persistido em `localStorage` para evitar flashes após recarregar.
- **Automação (N8N):** fluxo principal `pipeline-avaliacoes` recebe uploads, normaliza planilhas CSV/Excel e distribui as chamadas para webhooks REST dedicados (`/api/dados/import`, `/api/chat/send`, etc.). Um nó exclusivo “Prompt Builder” centraliza a composição de contexto (empresa, produtos, FAQs e persona) antes de enviar prompts ao LLM.
- **Supabase:** banco PostgreSQL gerenciado com autenticação de serviço. Além das tabelas de negócio, existe a view agregada `empresa_detalhada` que junta empresa, produtos e FAQs em uma única consulta para o painel e para o N8N. Logs e métricas serão coletados progressivamente usando a função compartilhada `log_event(type, detail)` no front e no backend.
- **Integração:** N8N publica eventos em tempo real para Supabase e responde aos webhooks REST com alias de rotas, mantendo compatibilidade com os novos namespaces de API.

## Design System
- **Tokens principais:** estrutura baseada em `data-theme` (`light` | `dark`). Cada modo define tokens como `--bg`, `--text`, `--surface`, `--border`, espaçamentos (`--space-xs` a `--space-xl`) e tipografia compartilhada.
- **Paleta oficial:**

  | Função | Cor |
  | --- | --- |
  | Primária | `#E84393` |
  | Hover primário | `#C2185B` |
  | Fundo claro | `#FCE4EC` |
  | Fundo escuro | `#0D0D0D` |
  | Sucesso | `#4ADE80` |
  | Erro | `#F87171` |

- **Componentes reutilizáveis:** `Button`, `Card`, `Tab`, `DataTable`, `UploadBox`, `PersonaCard`, todos com variantes (primário, secundário, ghost) e estados de carregamento.
- **Acessibilidade:** contraste mínimo 4.5:1, foco visível e suporte a navegação por teclado em todas as interações críticas.
- **Gestão de tema:** alternância entre modos claro/escuro via `document.body.dataset.theme` com transições suaves.

## Navegação e Estrutura do Painel
Barra lateral fixa com logo, atalhos das abas e indicador de ambiente (produção, homologação). Header contextual exibe breadcrumb da instituição, seletor de turma e ações rápidas.

### Abas do MVP
- **Dados:** upload de planilhas, histórico de importações, status dos processos N8N e indicadores rápidos (alunos avaliados, questões processadas). Inclui alerts para linhas inválidas, link para template oficial e logs de debug agrupados com prefixo `[OMR]` para facilitar análises durante a ingestão.
- **Test-Drive:** sandbox com dados de demonstração para exploradores sem permissões completas. Permite carregar datasets de amostra, testar filtros e baixar relatórios PDF.
- **Conexões:** gerenciamento de integrações com sistemas externos (N8N, Supabase Service Role, Slack). Exibe tokens ativos, logs e botão para regenerar segredos. O último status da instância é persistido em `localStorage` para manter feedback após recarregar a página.
- **Ajuda:** base de conhecimento resumida, FAQ, links para o Documento Base, canal de suporte e tutorial em vídeo incorporado.

## Instruções de Configuração
1. Instale dependências do frontend: `pnpm install`.
2. Configure variáveis em `.env`:
   ```env
   VITE_SUPABASE_URL=https://<instancia>.supabase.co
   VITE_SUPABASE_ANON_KEY=<chave_anon>
   VITE_API_BASE_URL=https://api.omrstudio.dev
   VITE_N8N_WEBHOOK=https://n8n.omrstudio.dev
   ```
3. Ajuste o arquivo `supabase/.env` com a `SERVICE_ROLE_KEY` para jobs do N8N.
4. No N8N, importe o workflow `pipelines/pipeline-avaliacoes.json` e atualize credenciais (Supabase, Slack, SMTP).

## Instruções de Execução
- **Frontend:** `pnpm dev` para ambiente local (porta 5173), `pnpm build && pnpm preview` para homologação.
- **Automação:** executar o N8N com `docker compose up n8n` usando a stack definida em `deploy/n8n/docker-compose.yml`.
- **Database:** iniciar Supabase local com `supabase start` e aplicar migrações via `supabase db reset`.

## Contrato da API
As ações estão organizadas em namespaces temáticos para facilitar caching, segurança e observabilidade. Todas as rotas exigem `x-service-token` emitido pelo N8N.

### Autenticação
- **Endpoint:** `POST /api/auth/session`
- **Descrição:** cria sessão por magic-link.
- **Body:** `{ "email": "professor@instituicao.edu" }`
- **Responses:**
  - `200 OK` com `{ "sessionId": "sess_123" }`
  - `401 Unauthorized`

### Dados
- **Endpoint:** `POST /api/dados/import`
- **Descrição:** recebe lote de avaliações, respostas e persona escolhida.
- **Headers adicionais:** `x-session-id`.
- **Responses:**
  - `202 Accepted`: processamento assíncrono iniciado.
  - `400 Bad Request`: payload inválido ou schema incompatível.
  - `401 Unauthorized`: token ausente ou incorreto.
  - `409 Conflict`: importação duplicada.
  - `500 Internal Server Error`: erro inesperado persistido no log `api_errors`.

#### Ações internas disparadas
1. Validação do schema contra Supabase.
2. Upsert de avaliações, respostas e vínculo com `personas`.
3. Cálculo de métricas agregadas (taxa de acerto, tempo médio).
4. Emissão de eventos em canal `realtime:avaliacoes`.
5. Notificação no Slack via webhook `#omr-alertas`.

### Instância
- **Endpoint:** `GET /api/instancia/status`
- **Descrição:** retorna estado atual da instância (online, sincronizando, erro) para sincronizar com o cache local.

### Chat
- **Endpoint:** `POST /api/chat/send`
- **Descrição:** envia pergunta contextualizada com persona selecionada e dados agregados da view `empresa_detalhada`.

### Suporte
- **Endpoint:** `POST /api/support/ticket`
- **Descrição:** cria ticket interno anexando logs `[OMR]` relevantes.

### Exemplo de Payload (`POST /api/dados/import`)
```json
{
  "empresaId": "inst_42",
  "turmaId": "turma_3A",
  "personaId": "persona_josi",
  "avaliacao": {
    "id": "prova_matematica_2024_01",
    "data": "2024-05-12",
    "disciplina": "Matemática",
    "etapa": "Simulado ENEM"
  },
  "questoes": [
    { "id": "Q1", "gabarito": "A" },
    { "id": "Q2", "gabarito": "D" }
  ],
  "respostas": [
    { "alunoId": "aluno_001", "questaoId": "Q1", "resposta": "A", "tempoSeg": 45 },
    { "alunoId": "aluno_001", "questaoId": "Q2", "resposta": "B", "tempoSeg": 60 }
  ]
}
```

## Schema do Supabase
```sql
create table empresas (
  id text primary key,
  nome text not null,
  cnpj text,
  segmento text,
  criado_em timestamptz default now()
);

create table turmas (
  id text primary key,
  empresa_id text references empresas(id),
  nome text not null,
  ano_letivo int not null
);

create table avaliacoes (
  id text primary key,
  turma_id text references turmas(id),
  disciplina text,
  data date,
  etapa text
);

create table questoes (
  id text primary key,
  avaliacao_id text references avaliacoes(id),
  ordem int,
  gabarito text
);

create table respostas (
  id uuid primary key default gen_random_uuid(),
  avaliacao_id text references avaliacoes(id),
  aluno_id text,
  questao_id text references questoes(id),
  resposta text,
  tempo_seg int,
  correta boolean
);

create table produtos (
  id uuid primary key default gen_random_uuid(),
  empresa_id text references empresas(id),
  nome text not null,
  status text default 'ativo',
  metadados jsonb default '{}'::jsonb
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  empresa_id text references empresas(id),
  pergunta text not null,
  resposta text not null,
  ordem int default 0
);

create table personas (
  id text primary key,
  nome text not null,
  descricao text,
  estilo jsonb default '{}'::jsonb,
  prompt_base text not null
);

create table usuarios (
  id uuid primary key,
  email text unique not null,
  perfil text check (perfil in ('admin', 'professor', 'viewer')),
  ultimo_login timestamptz
);

create view empresa_detalhada as
select e.*,
       coalesce(json_agg(distinct p.*) filter (where p.id is not null), '[]'::json) as produtos,
       coalesce(json_agg(distinct f.*) filter (where f.id is not null), '[]'::json) as faqs
from empresas e
left join produtos p on p.empresa_id = e.id
left join faqs f on f.empresa_id = e.id
group by e.id;
```

## Checklist de Testes do MVP
- [ ] Upload de planilha `.xlsx` com 50 alunos gera importação aceita.
- [ ] Erros de validação são exibidos com link para download das linhas problemáticas.
- [ ] Dados de demonstração carregam na aba Test-Drive sem dependência do Supabase.
- [ ] Regeneração de token na aba Conexões invalida o token anterior.
- [ ] FAQ da aba Ajuda abre links externos em nova aba.
- [ ] Webhook `POST /api/dados/import` retorna `202` com payload válido.
- [ ] Eventos `realtime:avaliacoes` atualizam tabela sem refresh.

## Roadmap Pós-MVP
1. Autenticação OAuth2 com Azure AD.
2. Painéis personalizados por papel (diretoria, coordenação, professor).
3. Exportação automática de relatórios em CSV/PowerPoint.
4. Integração com LMS externos (Canvas, Moodle).
5. Modelos preditivos para identificação de alunos em risco.
6. Persistência estruturada de logs/métricas (`log_event` → Supabase) e dashboards de observabilidade.

## Notas de Segurança
- Rotacionar tokens de serviço a cada 90 dias.
- Limitar acesso ao Supabase via políticas RLS rigorosas.
- Habilitar TLS mútuo entre N8N e API em ambientes de produção.
- Monitorar logs de auditoria e alertar para tentativas repetidas de importação.

## Links Úteis
- [Documento Base do Projeto](https://docs.omrstudio.dev/base)
- [Figma do Design System](https://figma.com/file/omr-design-system)
- [Workflow N8N](https://n8n.omrstudio.dev/workflows/pipeline-avaliacoes)
- [Console Supabase](https://supabase.com/dashboard)
- [Canal de Suporte](mailto:suporte@omrstudio.dev)

