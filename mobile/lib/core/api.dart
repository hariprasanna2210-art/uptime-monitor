import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const String kBaseUrl = 'https://uptime-backend.onrender.com/api'; // Android Emulator localhost

final dioProvider = Dio(BaseOptions(
  baseUrl: kBaseUrl,
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 10),
));

class ApiClient {
  final Dio _dio = dioProvider;
  final _storage = const FlutterSecureStorage();

  ApiClient() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Handle global errors like 401
        return handler.next(e);
      },
    ));
  }

  Dio get client => _dio;
}
