import 'package:flutter_app/core/errors/app_exception.dart';
import 'package:flutter_app/features/message_suggester/domain/entities/message_suggestion_result.dart';
import 'package:flutter_app/features/message_suggester/domain/repositories/message_suggester_repository.dart';
import 'package:flutter_app/features/message_suggester/domain/usecases/get_message_suggestions_use_case.dart';
import 'package:flutter_app/features/message_suggester/presentation/providers/message_suggester_provider.dart';
import 'package:flutter_test/flutter_test.dart';

class _FakeRepository implements MessageSuggesterRepository {
  _FakeRepository({
    this.result,
    this.exception,
  });

  final MessageSuggestionResult? result;
  final AppException? exception;

  @override
  Future<MessageSuggestionResult> getSuggestions({
    required String occasion,
    required String relationship,
  }) async {
    if (exception != null) {
      throw exception!;
    }

    return result!;
  }
}

void main() {
  test('provider valida campos vazios antes de chamar a API', () async {
    final provider = MessageSuggesterProvider(
      GetMessageSuggestionsUseCase(
        _FakeRepository(
          result: const MessageSuggestionResult(
            suggestions: ['a', 'b'],
            fallbackUsed: false,
          ),
        ),
      ),
    );

    await provider.submit(occasion: '', relationship: '');

    expect(provider.errorMessage, 'Preencha ocasiao e relacionamento.');
    expect(provider.result, isNull);
  });

  test('provider expõe resultado em caso de sucesso', () async {
    final provider = MessageSuggesterProvider(
      GetMessageSuggestionsUseCase(
        _FakeRepository(
          result: const MessageSuggestionResult(
            suggestions: ['Mensagem 1', 'Mensagem 2'],
            fallbackUsed: true,
          ),
        ),
      ),
    );

    await provider.submit(occasion: 'birthday', relationship: 'friend');

    expect(provider.errorMessage, isNull);
    expect(provider.result, isNotNull);
    expect(provider.result!.fallbackUsed, isTrue);
    expect(provider.result!.suggestions.length, 2);
  });

  test('provider expõe mensagem amigável quando recebe AppException', () async {
    final provider = MessageSuggesterProvider(
      GetMessageSuggestionsUseCase(
        _FakeRepository(
          exception: const NetworkException('Falha de rede.'),
        ),
      ),
    );

    await provider.submit(occasion: 'birthday', relationship: 'friend');

    expect(provider.result, isNull);
    expect(provider.errorMessage, 'Falha de rede.');
  });
}
