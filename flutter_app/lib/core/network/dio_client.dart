import 'package:dio/dio.dart';

import '../config/env.dart';

class DioClientFactory {
  static Dio create() {
    final dio = Dio(
      BaseOptions(
        baseUrl: Env.apiBaseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        sendTimeout: const Duration(seconds: 10),
        contentType: Headers.jsonContentType,
        responseType: ResponseType.json,
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (error, handler) {
          handler.next(error);
        },
      ),
    );

    return dio;
  }
}
