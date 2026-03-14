import 'package:go_router/go_router.dart';

import '../../features/message_suggester/presentation/pages/message_suggester_page.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const MessageSuggesterPage(),
      ),
    ],
  );
}
