import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/website_repository.dart';

final websitesProvider = StateNotifierProvider<WebsitesNotifier, AsyncValue<List<dynamic>>>((ref) {
  return WebsitesNotifier(ref.read(websiteRepositoryProvider));
});

class WebsitesNotifier extends StateNotifier<AsyncValue<List<dynamic>>> {
  final WebsiteRepository _repository;

  WebsitesNotifier(this._repository) : super(const AsyncValue.loading()) {
    getWebsites();
  }

  Future<void> getWebsites() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repository.getWebsites());
  }

  Future<void> addWebsite(String name, String url, int interval) async {
      await _repository.addWebsite(name, url, interval);
      await getWebsites();
  }
}
