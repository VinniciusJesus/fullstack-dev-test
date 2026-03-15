class MessageSuggestionResult {
  const MessageSuggestionResult({
    required this.suggestions,
    required this.fallbackUsed,
  });

  final List<String> suggestions;
  final bool fallbackUsed;
}
