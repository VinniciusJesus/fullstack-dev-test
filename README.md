# Teste Senior Dev - Gerador de Mensagens com IA

## Status

Progresso atual deste repositório:

- backend implementado
- app Flutter ainda não iniciado

Este backend expõe uma API que recebe `occasion` e `relationship`, consulta o Gemini para gerar mensagens curtas de cartão presente e usa sugestões locais seguras quando o LLM falha.

## Estrutura do Repositório

```text
/
  backend/
  README.md
```

## Stack do Backend

- `Node.js`
- `TypeScript`
- `Express`
- `Zod`
- `Google Gemini`

## Arquitetura do Backend

O backend usa uma estrutura simples em camadas:

- `src/app.ts`: configuração do Express e dos middlewares
- `src/server.ts`: bootstrap HTTP
- `src/config/`: carregamento e validação de ambiente
- `src/modules/message-suggester/`: rota, controller, service, schema e fallback
- `src/providers/llm/`: provider do Gemini e tipos do provider
- `src/middlewares/`: request id, not found e tratamento de erro
- `src/utils/`: utilitários de cache

Decisões de design:

- o controller trata apenas preocupações HTTP
- o service concentra a regra de negócio
- a integração com Gemini fica isolada atrás de um `LlmProvider`
- o fallback é explícito e testável
- o cache fica isolado da camada de rota/controller

## Como Rodar o Backend

### Pré-requisitos

- `Node.js 20+`
- uma chave válida em `GEMINI_API_KEY`

### Setup

Na raiz do repositório:

```bash
cd backend
npm install
```

Crie seu arquivo local de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

Preencha pelo menos:

```env
GEMINI_API_KEY=sua_chave_aqui
```

### Execução

```bash
cd backend
npm run build
node dist/src/server.js
```

A API roda por padrão em:

```text
http://localhost:3000
```

### Testes

```bash
cd backend
npm test
```

## Variáveis de Ambiente

Variáveis atuais do backend:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=20
GEMINI_TIMEOUT_MS=8000
GEMINI_MODEL=gemini-2.0-flash
CACHE_TTL_SECONDS=300
```

## Contrato da API

### Endpoint

```http
POST /api/v1/message-suggestions
```

### Body da Requisição

```json
{
  "occasion": "birthday",
  "relationship": "friend"
}
```

### Resposta de Sucesso

```json
{
  "data": {
    "suggestions": [
      "Happy birthday! Wishing you a joyful day.",
      "Hope your special day is filled with love and celebration."
    ],
    "fallbackUsed": false
  },
  "error": null
}
```

### Resposta de Sucesso com Fallback

```json
{
  "data": {
    "suggestions": [
      "Happy birthday! Wishing you a year full of joy and good surprises.",
      "Hope your special day is filled with love, laughter, and memorable moments."
    ],
    "fallbackUsed": true
  },
  "error": null
}
```

### Erro de Validação

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "occasion is required."
  }
}
```

### Erro de Rate Limit

```json
{
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

## Integração com Gemini

O provider usa Gemini via API HTTP com `fetch` nativo.

Abordagem:

- o modelo é configurável por `GEMINI_MODEL`
- o timeout é configurável por `GEMINI_TIMEOUT_MS`
- o prompt pede retorno em JSON apenas
- a resposta é validada e normalizada antes de chegar ao service

O backend trata os seguintes casos como falha do LLM:

- timeout
- resposta HTTP não-2xx, como `429` ou `5xx`
- resposta vazia
- JSON malformado
- resposta sem array válido de `suggestions`
- resposta com menos de `2` ou mais de `3` sugestões

## Estratégia de Fallback

Fallback é comportamento obrigatório, não um detalhe opcional.

Quando o Gemini falha, o service retorna sugestões locais em vez de expor erros brutos do provider.

Características atuais do fallback:

- baseado principalmente em `occasion`
- usa fallback genérico quando a ocasião não é conhecida
- retorna `fallbackUsed: true`
- ainda responde com HTTP `200`, porque a API conseguiu entregar conteúdo útil

Motivo da decisão:

- o cliente continua recebendo sugestões válidas
- a experiência do usuário continua estável
- a API evita vazar falhas do provider e stack traces

## Decisões de Segurança

Este projeto usa segurança proporcional ao escopo, sem política de acesso complexa.

Implementado:

- `.env` para segredos e configuração
- validação de entrada com `Zod`
- `helmet`
- `cors` com origens configuráveis
- limite no tamanho do body JSON
- `express-rate-limit`
- rastreabilidade por `x-request-id`
- `404` padronizado
- `500` padronizado
- erros internos ocultos do consumidor da API

Não implementado:

- autenticação
- autorização
- RBAC
- políticas avançadas de acesso

Motivo:

- o desafio não exige usuários autenticados
- adicionar autenticação aqui aumentaria a complexidade sem melhorar os critérios centrais de avaliação

## Estratégia de Cache

O backend usa um cache conservador em memória.

Regras:

- a chave do cache é o par normalizado `occasion + relationship`
- apenas respostas bem-sucedidas do Gemini entram no cache
- respostas de fallback não são cacheadas
- o TTL é controlado por `CACHE_TTL_SECONDS`

Por que isso faz sentido aqui:

- a entrada da API é intencionalmente pequena
- requisições idênticas repetidas gerariam custo repetido no LLM
- cache curto reduz latência e custo

Trade-off:

- entradas idênticas podem receber as mesmas sugestões durante a janela do TTL

Para este desafio, esse trade-off é aceitável.
Em um sistema de produção com personalização mais rica, a chave do cache precisaria incluir mais contexto ou a estratégia teria de mudar.

## Considerações de Custo

Escolhas atuais para reduzir custo:

- modelo Gemini leve
- formato de saída restrito
- respostas curtas
- fallback em vez de ciclos repetidos de falha
- cache curto para requisições idênticas

Se isso evoluísse para produção, eu consideraria:

- cache distribuído com Redis
- deduplicação de requisições concorrentes idênticas
- métricas de cache hit e falhas do provider
- otimização adicional do prompt

## Testes

O backend atualmente cobre:

- endpoint de health
- validação do contrato HTTP
- caminho de sucesso do service
- caminho de fallback
- respostas inválidas do provider
- parsing do client Gemini
- rate limiting
- padronização de erros
- comportamento de cache hit
- garantia de que fallback não entra no cache

## Uso de IA

Foi usada assistência de IA durante planejamento e suporte de implementação.

As decisões humanas mantiveram controle sobre:

- arquitetura do backend
- contrato da API
- comportamento de fallback
- escopo de segurança
- estratégia de cache
- trade-offs documentados neste README

## Próximos Passos

Trabalho restante para completar o desafio:

- implementar o app Flutter
- documentar execução do frontend
- descrever a arquitetura ponta a ponta entre app e backend
