import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../dashboard/data/website_repository.dart';

final websiteDetailsProvider = StateNotifierProvider.family<WebsiteDetailsNotifier, AsyncValue<dynamic>, String>((ref, id) {
  return WebsiteDetailsNotifier(ref.read(websiteRepositoryProvider), id);
});

class WebsiteDetailsNotifier extends StateNotifier<AsyncValue<dynamic>> {
  final WebsiteRepository _repository;
  final String id;

  WebsiteDetailsNotifier(this._repository, this.id) : super(const AsyncValue.loading()) {
    getWebsite();
  }

  Future<void> getWebsite() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repository.getWebsite(id));
  }
}
