import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/message_suggestion_result.dart';

class MessageSuggestionsPanel extends StatelessWidget {
  const MessageSuggestionsPanel({
    required this.result,
    required this.errorMessage,
    required this.isLoading,
    super.key,
  });

  final MessageSuggestionResult? result;
  final String? errorMessage;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (errorMessage != null) {
      return _MessageStateCard(
        title: 'Nao foi possivel continuar',
        message: errorMessage!,
      );
    }

    if (result == null) {
      return const _MessageStateCard(
        title: 'Aguardando entrada',
        message:
            'Preencha os campos ao lado para gerar sugestoes de mensagem de cartao.',
      );
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F1E9),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              const Text(
                'Sugestoes',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 26,
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Georgia',
                ),
              ),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: result!.fallbackUsed
                      ? const Color(0xFFE6C9B6)
                      : AppTheme.mint,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Text(
                    result!.fallbackUsed ? 'Fallback ativo' : 'Gemini ativo',
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            result!.fallbackUsed
                ? 'O backend entregou uma resposta segura local porque a IA nao respondeu de forma valida.'
                : 'As sugestoes abaixo foram geradas pelo Gemini no backend.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          ...result!.suggestions.map(
            (suggestion) => Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppTheme.border),
              ),
              child: Text(
                suggestion,
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 16,
                  height: 1.45,
                  fontFamily: result!.fallbackUsed ? null : 'Georgia',
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Dica: altere os campos e refaca a busca para gerar novas mensagens.',
            style: TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageStateCard extends StatelessWidget {
  const _MessageStateCard({
    required this.title,
    required this.message,
  });

  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
