import 'package:flutter_riverpod/flutter_riverpod.dart';

// Placeholder for FCM Service
// In a real app, use firebase_messaging package
class FcmService {
  Future<void> init() async {
    // 1. Request permission
    // 2. Get token
    // 3. Send token to backend
    print('FCM Service Initialized (Placeholder)');
  }
}

final fcmServiceProvider = Provider((ref) => FcmService());
