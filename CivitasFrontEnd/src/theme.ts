import { createTheme, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  // Define a família da fonte principal
  fontFamily: 'DM Sans, sans-serif',

  // Para um visual minimalista, você pode usar cores neutras.
  // Mantine usa 'blue' como padrão, mas você pode mudar para 'gray' ou outra.
  primaryColor: 'indigo', // Exemplo: 'gray', 'slate', 'zinc' (cores do Tailwind, se desejar algo similar)

  // Raio de borda padrão para componentes (ex: botões, inputs)
  // 'xs' ou 'sm' para um visual mais contido e minimalista
  defaultRadius: 'sm',

  // Você pode sobrescrever outras propriedades do tema aqui
  // Por exemplo, para um espaçamento mais enxuto:
  // spacing: {
  //   xs: '0.5rem', // 8px
  //   sm: '0.75rem', // 12px
  //   md: '1rem',   // 16px
  //   lg: '1.25rem', // 20px
  //   xl: '1.5rem',  // 24px
  // },

  // Exemplo de como definir props padrão para componentes específicos
  // components: {
  //   Button: {
  //     defaultProps: {
  //       variant: 'light', // Botões minimalistas por padrão
  //       radius: 'sm',
  //     },
  //   },
  //   TextInput: {
  //     defaultProps: {
  //       radius: 'sm',
  //     },
  //   },
  //   Paper: {
  //     defaultProps: {
  //       shadow: 'xs', // Sombras mais sutis
  //       radius: 'sm',
  //     }
  //   }
  // },

  // Para manter o restante "bem minimalista", evite adicionar muitas
  // sobrescritas complexas aqui, a menos que seja para simplificar algo.
  // O tema padrão do Mantine já é bastante limpo.

  // Se quiser desativar o negrito automático para títulos (para um visual mais leve):
  // headings: {
  //   fontWeight: '400', // ou '500'
  //   sizes: {
  //     h1: { fontWeight: '500', fontSize: DEFAULT_THEME.headings.sizes.h1.fontSize },
  //     // ... defina para outros níveis de título se necessário
  //   },
  // },
});