# Flutter App

## Stack

- `Flutter`
- `Dart`
- `FVM`
- `GoRouter`
- `Dio`
- `Provider`

## Versao do Flutter

O projeto Flutter esta configurado para usar `FVM`.

Configuracao atual:

- arquivo: `.fvmrc`
- canal definido: `stable`

Durante o desenvolvimento desta solucao, a versao utilizada foi:

- `Flutter 3.35.5`

Recomendacao:

- usar `FVM` sempre neste projeto
- evitar executar comandos com o Flutter global

## Como rodar com FVM

Entre na pasta do app:

```bash
cd flutter_app
```

Se voce ainda nao tiver o `FVM`:

```bash
dart pub global activate fvm
```

Baixe e selecione a versao do projeto:

```bash
fvm install stable
fvm use stable
```

Instale as dependencias:

```bash
fvm flutter pub get
```

## Execucao

### Web

```bash
fvm flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:3000
```

### Emulador Android

```bash
fvm flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
```

Observacoes:

- no Flutter web, `localhost` funciona para acessar o backend local
- no Android emulator, use `10.0.2.2`
- o backend precisa estar rodando antes do app

## Arquitetura

O app foi organizado por feature, com separacao de responsabilidades em camadas.

Estrutura principal:

```text
lib/
  app.dart
  main.dart
  core/
    config/
    errors/
    network/
    routing/
    theme/
  features/
    message_suggester/
      data/
        datasources/
        models/
        repositories/
      domain/
        entities/
        repositories/
        usecases/
      presentation/
        pages/
        providers/
        widgets/
```

### `core/`

Centraliza o que e compartilhado no app:

- `config/env.dart`: leitura de `API_BASE_URL` via `dart-define`
- `network/dio_client.dart`: configuracao do `Dio`
- `routing/app_router.dart`: navegacao com `GoRouter`
- `errors/app_exception.dart`: erros mapeados da camada de rede
- `theme/app_theme.dart`: identidade visual

### `features/message_suggester/domain`

Camada mais estavel da feature:

- entidades
- contratos de repositorio
- use case

Objetivo:

- desacoplar a interface da implementacao HTTP
- facilitar manutencao e testes

### `features/message_suggester/data`

Camada que conversa com a API:

- datasource usando `Dio`
- models para parse da resposta
- repository concreto

Objetivo:

- isolar transporte e serializacao

### `features/message_suggester/presentation`

Camada da interface:

- `page`
- `provider`
- widgets componentizados

Objetivo:

- manter a pagina principal enxuta
- centralizar o estado de UI
- facilitar iteracao visual

## Fluxo interno da feature

1. a pagina coleta os inputs
2. o `MessageSuggesterProvider` valida os campos
3. o provider chama o `GetMessageSuggestionsUseCase`
4. o use case chama o `MessageSuggesterRepository`
5. o repository delega ao `RemoteDataSource`
6. o `RemoteDataSource` usa `Dio` para chamar o backend
7. o resultado volta para a UI

## Gerenciamento de estado

Foi usado `Provider` com `ChangeNotifier`.

Estado controlado no provider:

- `isLoading`
- `errorMessage`
- `result`

Motivo da escolha:

- simples para o escopo do desafio
- suficiente para uma feature principal
- baixo custo de complexidade

## Estrategias adotadas

### 1. Configuracao por ambiente

O app nao hardcode a URL da API na feature.

A base URL vem de:

- `--dart-define=API_BASE_URL=...`

Isso facilita:

- rodar no web
- rodar no Android emulator
- trocar backend sem alterar codigo da tela

### 2. Tratamento de erro amigavel

O datasource mapeia erros do `Dio` para excecoes de aplicacao:

- timeout
- erro de conexao
- `400`
- `404`
- `429`
- erros inesperados do servidor

O provider converte isso em mensagens legiveis para a interface.

### 3. Validacao local

Antes de chamar a API, o provider valida:

- campos vazios
- tamanho maximo dos campos

Objetivo:

- feedback mais rapido ao usuario
- menos chamadas desnecessarias ao backend

### 4. UI responsiva

Mesmo no navegador, o layout foi tratado como app responsivo, nao como landing page.

Direcao adotada:

- estrutura mobile-first
- coluna central
- boa leitura em web e mobile

### 5. Componentizacao

Widgets principais da feature:

- `message_page_header.dart`
- `message_input_card.dart`
- `message_suggestions_panel.dart`

Objetivo:

- reduzir acoplamento na pagina
- melhorar clareza
- facilitar manutencao visual

## Seguranca no Flutter

O app nao carrega segredos de LLM.

A chave do Gemini fica apenas no backend.

Medidas proporcionais adotadas:

- `API_BASE_URL` externa via `dart-define`
- timeout HTTP no `Dio`
- mapeamento de erros sem expor stack trace
- validacao local de input
- nenhum segredo embutido no app

## Testes

Foram adicionados testes automatizados da feature:

- provider:
  - `test/features/message_suggester/presentation/providers/message_suggester_provider_test.dart`
- pagina principal:
  - `test/features/message_suggester/presentation/pages/message_suggester_page_test.dart`

Cobertura atual:

- validacao local no provider
- caminho de sucesso no provider
- mensagem de erro amigavel
- renderizacao da tela principal
- submit da tela e exibicao de sugestoes

Para rodar:

```bash
cd flutter_app
fvm flutter test
```

## Resumo das decisoes

- `GoRouter` para navegacao simples
- `Dio` para HTTP com timeout e melhor controle de erro
- `Provider` para estado leve
- arquitetura por feature com separacao em `data`, `domain` e `presentation`
- `dart-define` para ambiente
- UI mobile-first e responsiva
