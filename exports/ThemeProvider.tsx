'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import NextAppDirEmotionCacheProvider from './emotion-cache';

/**
 * Theme Provider Component
 *
 * Wrap your application with this component to apply the Nu Era Heat theme.
 *
 * Usage:
 * ```tsx
 * // In your layout.tsx or app wrapper
 * import ThemeProvider from './theme/ThemeProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
