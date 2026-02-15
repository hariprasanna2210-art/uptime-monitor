import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/api.dart';

final authRepositoryProvider = Provider((ref) => AuthRepository());

class AuthRepository {
  final _client = ApiClient().client;
  final _storage = const FlutterSecureStorage();

  Future<void> login(String email, String password) async {
    try {
      final response = await _client.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      final token = response.data['token'];
      await _storage.write(key: 'token', value: token);
    } catch (e) {
      throw e;
    }
  }

  Future<void> register(String name, String email, String password) async {
      try {
        final response = await _client.post('/auth/register', data: {
          'name': name,
          'email': email,
          'password': password,
        });
        final token = response.data['token'];
        await _storage.write(key: 'token', value: token);
      } catch (e) {
        throw e;
      }
    }

  Future<void> logout() async {
    await _storage.delete(key: 'token');
  }

  Future<bool> isLoggedIn() async {
      final token = await _storage.read(key: 'token');
      return token != null;
  }
}
