import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/network/dio_client.dart';
import 'core/routing/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/message_suggester/data/datasources/message_suggester_remote_data_source.dart';
import 'features/message_suggester/data/repositories/message_suggester_repository_impl.dart';
import 'features/message_suggester/domain/repositories/message_suggester_repository.dart';
import 'features/message_suggester/domain/usecases/get_message_suggestions_use_case.dart';
import 'features/message_suggester/presentation/providers/message_suggester_provider.dart';

class SmashGiftApp extends StatelessWidget {
  const SmashGiftApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => DioClientFactory.create()),
        Provider<MessageSuggesterRemoteDataSource>(
          create: (context) => MessageSuggesterRemoteDataSourceImpl(
            context.read(),
          ),
        ),
        Provider<MessageSuggesterRepository>(
          create: (context) => MessageSuggesterRepositoryImpl(
            context.read(),
          ),
        ),
        Provider(
          create: (context) => GetMessageSuggestionsUseCase(
            context.read<MessageSuggesterRepository>(),
          ),
        ),
        ChangeNotifierProvider(
          create: (context) => MessageSuggesterProvider(
            context.read<GetMessageSuggestionsUseCase>(),
          ),
        ),
      ],
      child: MaterialApp.router(
        title: 'Smash Gift',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        routerConfig: AppRouter.router,
      ),
    );
  }
}
