import '../entities/message_suggestion_result.dart';
import '../repositories/message_suggester_repository.dart';

class GetMessageSuggestionsUseCase {
  const GetMessageSuggestionsUseCase(this._repository);

  final MessageSuggesterRepository _repository;

  Future<MessageSuggestionResult> call({
    required String occasion,
    required String relationship,
  }) {
    return _repository.getSuggestions(
      occasion: occasion,
      relationship: relationship,
    );
  }
}
