import 'package:flutter/material.dart';

import '../message_suggester_constants.dart';

class MessageInputCard extends StatelessWidget {
  const MessageInputCard({
    required this.occasionController,
    required this.relationshipController,
    required this.isLoading,
    required this.onSubmit,
    required this.onExampleSelected,
    super.key,
  });

  final TextEditingController occasionController;
  final TextEditingController relationshipController;
  final bool isLoading;
  final VoidCallback onSubmit;
  final void Function(String occasion, String relationship) onExampleSelected;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Crie sua mensagem',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Escolha a ocasiao e para quem a mensagem sera escrita.',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 20),
            TextField(
              controller: occasionController,
              textInputAction: TextInputAction.next,
              maxLength: MessageSuggesterConstants.maxInputLength,
              decoration: const InputDecoration(
                labelText: 'Ocasiao',
                hintText: 'Ex.: aniversario, casamento, agradecimento',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: relationshipController,
              onSubmitted: (_) => onSubmit(),
              maxLength: MessageSuggesterConstants.maxInputLength,
              decoration: const InputDecoration(
                labelText: 'Relacionamento',
                hintText: 'Ex.: amigo, colega, mae',
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _ExampleChip(
                  label: 'Aniversario',
                  onTap: () => onExampleSelected('aniversario', 'amigo'),
                ),
                _ExampleChip(
                  label: 'Casamento',
                  onTap: () => onExampleSelected('casamento', 'colega'),
                ),
                _ExampleChip(
                  label: 'Agradecimento',
                  onTap: () => onExampleSelected('agradecimento', 'mae'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: isLoading ? null : onSubmit,
                child: Text(isLoading ? 'Criando...' : 'Buscar sugestoes'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ExampleChip extends StatelessWidget {
  const _ExampleChip({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      onPressed: onTap,
      label: Text(label),
      backgroundColor: const Color(0xFFF1ECE6),
    );
  }
}
