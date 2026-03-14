import 'package:dio/dio.dart';

import '../../../../core/errors/app_exception.dart';
import '../models/message_suggestion_result_model.dart';

abstract class MessageSuggesterRemoteDataSource {
  Future<MessageSuggestionResultModel> getSuggestions({
    required String occasion,
    required String relationship,
  });
}

class MessageSuggesterRemoteDataSourceImpl
    implements MessageSuggesterRemoteDataSource {
  MessageSuggesterRemoteDataSourceImpl(this._dio);

  final Dio _dio;

  @override
  Future<MessageSuggestionResultModel> getSuggestions({
    required String occasion,
    required String relationship,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/api/v1/message-suggestions',
        data: {
          'occasion': occasion.trim(),
          'relationship': relationship.trim(),
        },
      );

      final payload = response.data;

      if (payload == null) {
        throw const ServerException('Resposta vazia da API.');
      }

      return MessageSuggestionResultModel.fromJson(payload);
    } on DioException catch (error) {
      throw _mapDioException(error);
    } catch (_) {
      throw const ServerException(
        'Nao foi possivel interpretar a resposta do servidor.',
      );
    }
  }

  AppException _mapDioException(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkException(
          'A requisicao demorou demais. Tente novamente.',
        );
      case DioExceptionType.connectionError:
      case DioExceptionType.unknown:
        return const NetworkException(
          'Nao foi possivel conectar ao backend. Verifique a API e tente novamente.',
        );
      case DioExceptionType.badResponse:
        return _mapBadResponse(error.response);
      case DioExceptionType.cancel:
        return const NetworkException('A requisicao foi cancelada.');
      case DioExceptionType.badCertificate:
        return const NetworkException('Falha de seguranca na conexao com a API.');
    }
  }

  AppException _mapBadResponse(Response<dynamic>? response) {
    final payload = response?.data;
    final errorMessage =
        payload is Map<String, dynamic> ? payload['error'] : null;
    final message = errorMessage is Map<String, dynamic>
        ? errorMessage['message']?.toString()
        : null;

    switch (response?.statusCode) {
      case 400:
        return ValidationException(message ?? 'Os dados enviados sao invalidos.');
      case 429:
        return const ServerException(
          'Voce atingiu o limite de requisicoes. Aguarde um momento.',
        );
      case 404:
        return const ServerException('Endpoint nao encontrado no backend.');
      default:
        return ServerException(
          message ?? 'O servidor nao conseguiu processar sua solicitacao.',
        );
    }
  }
}
