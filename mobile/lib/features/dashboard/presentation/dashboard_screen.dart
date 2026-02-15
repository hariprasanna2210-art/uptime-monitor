import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../application/website_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final websitesAsync = ref.watch(websitesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.refresh(websitesProvider),
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddWebsiteDialog(context, ref),
          ),
        ],
      ),
      body: websitesAsync.when(
        data: (websites) {
            if (websites.isEmpty) {
                return const Center(child: Text('No websites monitored.'));
            }
            return RefreshIndicator(
                onRefresh: () async => ref.refresh(websitesProvider),
                child: ListView.builder(
                    itemCount: websites.length,
                    itemBuilder: (context, index) {
                        final site = websites[index];
                        final isUp = site['last_status'] == 'UP';
                        return Card(
                            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            child: ListTile(
                                leading: CircleAvatar(
                                    backgroundColor: isUp ? Colors.green[100] : Colors.red[100],
                                    child: Icon(
                                        isUp ? Icons.check_circle : Icons.error,
                                        color: isUp ? Colors.green : Colors.red,
                                    ),
                                ),
                                title: Text(site['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                                subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                        Text(site['url']),
                                        const SizedBox(height: 4),
                                        Text(
                                            'Uptime: ${site['uptime_percentage']}%', 
                                            style: TextStyle(color: Colors.grey[600], fontSize: 12)
                                        ),
                                    ],
                                ),
                                trailing: const Icon(Icons.chevron_right),
                                onTap: () {
                                    // Navigate to details
                                    context.push('/monitor/${site['id']}');
                                },
                            ),
                        );
                    },
                ),
            );
        },
        error: (err, stack) => Center(child: Text('Error: $err')),
        loading: () => const Center(child: CircularProgressIndicator()),
      ),
    );
  }

  void _showAddWebsiteDialog(BuildContext context, WidgetRef ref) {
      final nameController = TextEditingController();
      final urlController = TextEditingController();
      final intervalController = TextEditingController(text: '5');

      showDialog(context: context, builder: (context) {
          return AlertDialog(
              title: const Text('Monitor New Website'),
              content: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                      TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Name')),
                      TextField(controller: urlController, decoration: const InputDecoration(labelText: 'URL')),
                      TextField(controller: intervalController, decoration: const InputDecoration(labelText: 'Interval (min)'), keyboardType: TextInputType.number),
                  ],
              ),
              actions: [
                  TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                  ElevatedButton(onPressed: () async {
                      try {
                          await ref.read(websitesProvider.notifier).addWebsite(
                              nameController.text,
                              urlController.text,
                              int.parse(intervalController.text),
                          );
                          if (context.mounted) Navigator.pop(context);
                      } catch (e) {
                          // Handle error
                      }
                  }, child: const Text('Add')),
              ],
          );
      });
  }
}
