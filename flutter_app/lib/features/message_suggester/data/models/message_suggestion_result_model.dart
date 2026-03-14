import '../../domain/entities/message_suggestion_result.dart';

class MessageSuggestionResultModel extends MessageSuggestionResult {
  const MessageSuggestionResultModel({
    required super.suggestions,
    required super.fallbackUsed,
  });

  factory MessageSuggestionResultModel.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>;
    final suggestions = (data['suggestions'] as List<dynamic>)
        .map((item) => item.toString())
        .toList();

    return MessageSuggestionResultModel(
      suggestions: suggestions,
      fallbackUsed: data['fallbackUsed'] as bool? ?? false,
    );
  }
}
