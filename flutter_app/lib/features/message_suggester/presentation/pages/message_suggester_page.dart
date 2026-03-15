import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../providers/message_suggester_provider.dart';
import '../widgets/message_input_card.dart';
import '../widgets/message_page_header.dart';
import '../widgets/message_suggestions_panel.dart';

class MessageSuggesterPage extends StatefulWidget {
  const MessageSuggesterPage({super.key});

  @override
  State<MessageSuggesterPage> createState() => _MessageSuggesterPageState();
}

class _MessageSuggesterPageState extends State<MessageSuggesterPage> {
  late final TextEditingController _occasionController;
  late final TextEditingController _relationshipController;

  @override
  void initState() {
    super.initState();
    _occasionController = TextEditingController(text: 'aniversario');
    _relationshipController = TextEditingController(text: 'amigo');
  }

  @override
  void dispose() {
    _occasionController.dispose();
    _relationshipController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<MessageSuggesterProvider>();

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          color: AppTheme.background,
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.background,
              const Color(0xFFF0E1D4).withValues(alpha: 0.65),
              AppTheme.background,
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                child: ListView(
                  children: [
                    const MessagePageHeader(),
                    const SizedBox(height: 20),
                    MessageInputCard(
                      occasionController: _occasionController,
                      relationshipController: _relationshipController,
                      isLoading: provider.isLoading,
                      onSubmit: _submit,
                      onExampleSelected: _applyExample,
                    ),
                    const SizedBox(height: 16),
                    MessageSuggestionsPanel(
                      result: provider.result,
                      errorMessage: provider.errorMessage,
                      isLoading: provider.isLoading,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _submit() {
    context.read<MessageSuggesterProvider>().submit(
          occasion: _occasionController.text,
          relationship: _relationshipController.text,
        );
  }

  void _applyExample(String occasion, String relationship) {
    _occasionController.text = occasion;
    _relationshipController.text = relationship;
  }
}
