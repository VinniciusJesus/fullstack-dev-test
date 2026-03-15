import '../entities/message_suggestion_result.dart';

abstract class MessageSuggesterRepository {
  Future<MessageSuggestionResult> getSuggestions({
    required String occasion,
    required String relationship,
  });
}
