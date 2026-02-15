import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api.dart';

final websiteRepositoryProvider = Provider((ref) => WebsiteRepository());

class WebsiteRepository {
  final _client = ApiClient().client;

  Future<List<dynamic>> getWebsites() async {
    try {
      final response = await _client.get('/websites');
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  Future<dynamic> getWebsite(String id) async {
    try {
      final response = await _client.get('/websites/$id');
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  Future<void> addWebsite(String name, String url, int interval) async {
      try {
        await _client.post('/websites', data: {
            'name': name,
            'url': url,
            'check_interval': interval
        });
      } catch (e) {
        throw e;
      }
  }
}
