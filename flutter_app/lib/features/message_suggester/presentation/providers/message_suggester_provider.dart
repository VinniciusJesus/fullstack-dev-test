import 'package:flutter/foundation.dart';

import '../../../../core/errors/app_exception.dart';
import '../../domain/entities/message_suggestion_result.dart';
import '../../domain/usecases/get_message_suggestions_use_case.dart';
import '../message_suggester_constants.dart';

class MessageSuggesterProvider extends ChangeNotifier {
  MessageSuggesterProvider(this._getMessageSuggestionsUseCase);

  final GetMessageSuggestionsUseCase _getMessageSuggestionsUseCase;

  bool _isLoading = false;
  String? _errorMessage;
  MessageSuggestionResult? _result;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  MessageSuggestionResult? get result => _result;

  Future<void> submit({
    required String occasion,
    required String relationship,
  }) async {
    final trimmedOccasion = occasion.trim();
    final trimmedRelationship = relationship.trim();

    final validationMessage = _validateInput(
      occasion: trimmedOccasion,
      relationship: trimmedRelationship,
    );

    if (validationMessage != null) {
      _errorMessage = validationMessage;
      _result = null;
      notifyListeners();
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _result = await _getMessageSuggestionsUseCase(
        occasion: trimmedOccasion,
        relationship: trimmedRelationship,
      );
    } on AppException catch (error) {
      _errorMessage = error.message;
      _result = null;
    } catch (_) {
      _errorMessage = 'Nao foi possivel buscar sugestoes agora. Tente novamente.';
      _result = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  String? _validateInput({
    required String occasion,
    required String relationship,
  }) {
    if (occasion.isEmpty || relationship.isEmpty) {
      return 'Preencha ocasiao e relacionamento.';
    }

    if (occasion.length > MessageSuggesterConstants.maxInputLength) {
      return 'A ocasiao deve ter no maximo ${MessageSuggesterConstants.maxInputLength} caracteres.';
    }

    if (relationship.length > MessageSuggesterConstants.maxInputLength) {
      return 'O relacionamento deve ter no maximo ${MessageSuggesterConstants.maxInputLength} caracteres.';
    }

    return null;
  }
}
