import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../application/website_details_provider.dart';

class WebsiteDetailsScreen extends ConsumerWidget {
  final String id;

  const WebsiteDetailsScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final websiteAsync = ref.watch(websiteDetailsProvider(id));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Website Details'),
        actions: [
            IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () => ref.refresh(websiteDetailsProvider(id)),
            )
        ],
      ),
      body: websiteAsync.when(
        data: (website) {
          final isUp = website['last_status'] == 'UP';
          final logs = website['logs'] as List<dynamic>;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Card
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Icon(
                          isUp ? Icons.check_circle : Icons.error,
                          color: isUp ? Colors.green : Colors.red,
                          size: 64,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          website['name'],
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        Text(
                          website['url'],
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildStat(context, 'Status', website['last_status'], isUp ? Colors.green : Colors.red),
                            _buildStat(context, 'Uptime', '${website['uptime_percentage']}%', Colors.blue),
                            _buildStat(context, 'Interval', '${website['check_interval']}m', Colors.orange),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 24),
                Text('Recent Logs', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),

                // Logs List
                ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: logs.length,
                    itemBuilder: (context, index) {
                        final log = logs[index];
                        final logIsUp = log['status'] == 'UP';
                        return ListTile(
                            leading: Icon(
                                logIsUp ? Icons.circle : Icons.circle,
                                color: logIsUp ? Colors.green : Colors.red,
                                size: 12,
                            ),
                            title: Text('Status: ${log['status']} (${log['status_code']})'),
                            subtitle: Text(DateTime.parse(log['checked_at']).toLocal().toString()),
                            trailing: Text('${log['response_time']}ms'),
                        );
                    },
                ),
              ],
            ),
          );
        },
        error: (err, stack) => Center(child: Text('Error: $err')),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }

  Widget _buildStat(BuildContext context, String label, String value, Color color) {
      return Column(
          children: [
              Text(value, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: color)),
              Text(label, style: Theme.of(context).textTheme.bodySmall),
          ],
      );
  }
}
