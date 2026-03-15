class AppException implements Exception {
  const AppException(this.message);

  final String message;
}

class ValidationException extends AppException {
  const ValidationException(super.message);
}

class NetworkException extends AppException {
  const NetworkException(super.message);
}

class ServerException extends AppException {
  const ServerException(super.message);
}
