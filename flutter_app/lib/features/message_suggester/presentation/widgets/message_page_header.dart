import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';

class MessagePageHeader extends StatelessWidget {
  const MessagePageHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
      decoration: BoxDecoration(
        color: const Color(0xFFF3E7DA),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 168,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFFB68F68),
                  Color(0xFFE3CCB4),
                  Color(0xFFF7EEE4),
                ],
              ),
            ),
            child: Stack(
              children: [
                Positioned(top: 18, right: 18, child: const SizedBox.shrink()),
                const Positioned(
                  left: 20,
                  top: 20,
                  child: Icon(
                    Icons.auto_awesome_rounded,
                    size: 28,
                    color: Color(0xFF6F4F34),
                  ),
                ),
                Positioned(
                  left: 22,
                  bottom: 26,
                  child: Text(
                    'Desafio Fullstack',
                    style: TextStyle(
                      fontSize: 34,
                      color: Color(0xFF4F3728),
                      fontFamily: 'Georgia',
                      height: 1.05,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Smash Gift',
            style: Theme.of(
              context,
            ).textTheme.displaySmall?.copyWith(color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 8),
          Text(
            'Crie mensagens delicadas para acompanhar um presente, com sugestões da IA.',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              color: AppTheme.textSecondary,
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }
}
