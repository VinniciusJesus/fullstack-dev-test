# Backend

## Stack

- `Node.js`
- `TypeScript`
- `Express`
- `Zod`
- `Google Gemini`

## Como rodar

Entre na pasta:

```bash
cd backend
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Preencha pelo menos:

```env
GEMINI_API_KEY=sua_chave_aqui (se nao conseguirem gerar uma chave do Gemini, podem solicitá-la por e-mail; a versao gratuita ja e suficiente para este projeto)
```

Suba o servidor:

```bash
npm run build
node dist/src/server.js
```

API padrao:

```text
http://localhost:3000
```

Rodar testes:

```bash
npm test
```

## Arquitetura

Estrutura principal:

```text
src/
  app.ts
  server.ts
  config/
  middlewares/
  modules/
    message-suggester/
  providers/
    llm/
  utils/
```

Camadas:

- `app.ts`: composicao do Express, CORS, rate limit e middlewares
- `config/`: env e regras de CORS
- `middlewares/`: request id, erro global, not found
- `modules/message-suggester/`: schema, controller, service, fallback
- `providers/llm/`: cliente Gemini
- `utils/cache.ts`: cache em memoria com TTL

## Contrato da API

Endpoint:

```http
POST /api/v1/message-suggestions
```

Body:

```json
{
  "occasion": "birthday",
  "relationship": "friend"
}
```

Sucesso:

```json
{
  "data": {
    "suggestions": [
      "Mensagem 1",
      "Mensagem 2"
    ],
    "fallbackUsed": false
  },
  "error": null
}
```

Erro de validacao:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "occasion is required."
  }
}
```

## Estrategias adotadas

### 1. Integracao controlada com Gemini

O Gemini foi integrado por `fetch` nativo.

Pontos principais:

- modelo configuravel por env
- timeout configuravel
- prompt com saida estruturada
- parse e validacao da resposta antes de chegar ao cliente

### 2. Fallback obrigatorio

Quando o Gemini falha, o backend nao quebra o fluxo.

Ele retorna:

- mensagens locais seguras
- `fallbackUsed: true`

Falhas tratadas como fallback:

- timeout
- `429`
- `5xx`
- resposta vazia
- formato inesperado
- numero invalido de sugestoes

### 3. Seguranca proporcional

Implementado:

- `helmet`
- `cors`
- `express-rate-limit`
- request id
- validacao com `Zod`
- erro `404` padronizado
- erro `500` padronizado

Nao implementado:

- autenticacao
- autorizacao
- RBAC

Motivo:

- o desafio nao exige usuarios autenticados
- isso aumentaria a complexidade sem melhorar o fluxo principal

### 4. CORS amigavel para desenvolvimento

Em desenvolvimento, o backend aceita:

- `localhost` em qualquer porta
- `127.0.0.1` em qualquer porta

Isso foi necessario para o Flutter web, porque a porta local muda com frequencia.

### 5. Cache em memoria

Estrategia:

- chave por `occasion + relationship`
- TTL curto
- cache apenas para respostas validas do Gemini
- fallback nao e cacheado

Objetivo:

- reduzir custo
- reduzir latencia
- evitar chamadas repetidas ao LLM

## Variaveis de ambiente

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

## Testes

Cobertura atual:

- health check
- validacao da API
- service em sucesso
- fallback por falha do provider
- parsing do Gemini client
- cache hit
- garantia de nao cachear fallback
- rate limit
- middlewares de erro
- CORS para localhost dinamico

Para rodar:

```bash
cd backend
npm test
```
