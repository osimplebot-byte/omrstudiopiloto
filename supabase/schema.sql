create extension if not exists "pgcrypto";

create table if not exists empresas (
  id text primary key,
  nome text not null,
  cnpj text,
  segmento text,
  criado_em timestamptz default now()
);

create table if not exists turmas (
  id text primary key,
  empresa_id text references empresas(id),
  nome text not null,
  ano_letivo int not null
);

create table if not exists avaliacoes (
  id text primary key,
  turma_id text references turmas(id),
  disciplina text,
  data date,
  etapa text
);

create table if not exists questoes (
  id text primary key,
  avaliacao_id text references avaliacoes(id),
  ordem int,
  gabarito text
);

create table if not exists respostas (
  id uuid primary key default gen_random_uuid(),
  avaliacao_id text references avaliacoes(id),
  aluno_id text,
  questao_id text references questoes(id),
  resposta text,
  tempo_seg int,
  correta boolean
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  empresa_id text references empresas(id),
  nome text not null,
  status text default 'ativo',
  metadados jsonb default '{}'::jsonb
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  empresa_id text references empresas(id),
  pergunta text not null,
  resposta text not null,
  ordem int default 0
);

create table if not exists personas (
  id text primary key,
  nome text not null,
  descricao text,
  estilo jsonb default '{}'::jsonb,
  prompt_base text not null
);

create table if not exists usuarios (
  id uuid primary key,
  email text unique not null,
  perfil text check (perfil in ('admin', 'professor', 'viewer')),
  ultimo_login timestamptz
);

create or replace view empresa_detalhada as
select e.*, 
       coalesce(json_agg(distinct p.*) filter (where p.id is not null), '[]'::json) as produtos,
       coalesce(json_agg(distinct f.*) filter (where f.id is not null), '[]'::json) as faqs
from empresas e
left join produtos p on p.empresa_id = e.id
left join faqs f on f.empresa_id = e.id
group by e.id;

create or replace function log_event(event_type text, detail jsonb)
returns void
language plpgsql
as $$
begin
  insert into api_logs (event_type, detail)
  values (event_type, detail)
  on conflict do nothing;
exception when undefined_table then
  raise notice '[OMR:SUPABASE] tabela api_logs não disponível';
end;
$$;
