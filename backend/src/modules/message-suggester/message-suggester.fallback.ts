import { MessageSuggestionsInput } from './message-suggester.schema.js';

const fallbackSuggestionsByOccasion: Record<string, string[]> = {
  birthday: [
    'Feliz aniversario! Desejo um ano cheio de alegria e boas surpresas.',
    'Espero que seu dia especial seja repleto de amor, sorrisos e momentos inesqueciveis.',
  ],
  wedding: [
    'Desejo a voces uma vida inteira de amor, parceria e felicidade.',
    'Que este novo capitulo traga alegria, harmonia e muitas lembrancas bonitas.',
  ],
  'thank you': [
    'Muito obrigado pelo seu carinho e apoio. Isso significa muito para mim.',
    'Sou muito grato por tudo o que voce fez. Obrigado pela sua atencao e generosidade.',
  ],
};

const genericFallbackSuggestions = [
  'Desejo tudo de melhor e espero que esta mensagem traga um sorriso ao seu dia.',
  'Envio votos sinceros e muito carinho para este momento especial.',
];

export function buildFallbackSuggestions(
  input: MessageSuggestionsInput,
): string[] {
  const normalizedOccasion = input.occasion.trim().toLowerCase();

  return (
    fallbackSuggestionsByOccasion[normalizedOccasion] ??
    genericFallbackSuggestions
  );
}
