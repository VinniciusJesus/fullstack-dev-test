import '../../domain/entities/message_suggestion_result.dart';
import '../../domain/repositories/message_suggester_repository.dart';
import '../datasources/message_suggester_remote_data_source.dart';

class MessageSuggesterRepositoryImpl implements MessageSuggesterRepository {
  const MessageSuggesterRepositoryImpl(this._remoteDataSource);

  final MessageSuggesterRemoteDataSource _remoteDataSource;

  @override
  Future<MessageSuggestionResult> getSuggestions({
    required String occasion,
    required String relationship,
  }) {
    return _remoteDataSource.getSuggestions(
      occasion: occasion,
      relationship: relationship,
    );
  }
}
