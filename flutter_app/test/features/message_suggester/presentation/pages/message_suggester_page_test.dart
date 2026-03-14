import 'package:flutter/material.dart';
import 'package:flutter_app/core/theme/app_theme.dart';
import 'package:flutter_app/features/message_suggester/domain/entities/message_suggestion_result.dart';
import 'package:flutter_app/features/message_suggester/domain/repositories/message_suggester_repository.dart';
import 'package:flutter_app/features/message_suggester/domain/usecases/get_message_suggestions_use_case.dart';
import 'package:flutter_app/features/message_suggester/presentation/pages/message_suggester_page.dart';
import 'package:flutter_app/features/message_suggester/presentation/providers/message_suggester_provider.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

class _SuccessRepository implements MessageSuggesterRepository {
  @override
  Future<MessageSuggestionResult> getSuggestions({
    required String occasion,
    required String relationship,
  }) async {
    return const MessageSuggestionResult(
      suggestions: [
        'Mensagem de teste 1',
        'Mensagem de teste 2',
      ],
      fallbackUsed: false,
    );
  }
}

void main() {
  testWidgets('renderiza o layout principal e busca sugestoes', (tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => MessageSuggesterProvider(
              GetMessageSuggestionsUseCase(_SuccessRepository()),
            ),
          ),
        ],
        child: MaterialApp(
          theme: AppTheme.light(),
          home: const MessageSuggesterPage(),
        ),
      ),
    );

    expect(find.text('Smash Gift'), findsOneWidget);
    expect(find.text('Gerar mensagem'), findsOneWidget);
    expect(find.text('Buscar sugestoes'), findsOneWidget);

    await tester.tap(find.text('Buscar sugestoes'));
    await tester.pumpAndSettle();

    expect(find.text('Gemini ativo'), findsOneWidget);
    expect(find.text('Mensagem de teste 1'), findsOneWidget);
    expect(find.text('Mensagem de teste 2'), findsOneWidget);
  });
}
