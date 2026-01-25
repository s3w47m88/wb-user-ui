# Nu Era Heat Theme

This theme package provides the Material UI (MUI) theme configuration used by the Nu Era Heat website.

## Required Dependencies

Install the following packages in your project:

```bash
npm install @mui/material @emotion/react @emotion/cache @emotion/styled
```

For Next.js App Router, you'll also need:
```bash
npm install @emotion/server
```

## Files Included

| File | Description |
|------|-------------|
| `theme.ts` | Main MUI theme configuration with colors, typography, and component overrides |
| `globals.css` | Global CSS reset and base styles |
| `emotion-cache.tsx` | Next.js App Router emotion cache provider for SSR support |
| `createEmotionCache.ts` | Client-side emotion cache utility |
| `ThemeProvider.tsx` | Pre-configured theme provider component |
| `index.ts` | Barrel file for easy imports |

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#2E7D32` | Main brand green |
| Primary Light | `#4CAF50` | Hover states |
| Primary Dark | `#1B5E20` | Active states |
| Secondary | `#212121` | Dark text/elements |
| Success | `#43A047` | Success states |
| Background Default | `#ffffff` | Page background |
| Background Paper | `#f5f5f5` | Card/paper background |
| AppBar | `#1a1a1a` | Navigation bar |

## Typography

- **Font Family**: Roboto, Helvetica, Arial, sans-serif
- **H1**: Font weight 700
- **H2**: Font weight 600

## Usage

### Option 1: Use the pre-built ThemeProvider

```tsx
// layout.tsx
import ThemeProvider from './theme/ThemeProvider';
import './theme/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Option 2: Import individual pieces

```tsx
// providers.tsx
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme, NextAppDirEmotionCacheProvider } from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
```

### Option 3: Extend the theme

```tsx
import { createTheme } from '@mui/material/styles';
import { theme as baseTheme } from './theme';

const extendedTheme = createTheme(baseTheme, {
  // Your additional customizations
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
```

## Roboto Font

Add the Roboto font to your project. For Next.js:

```tsx
// layout.tsx
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      {/* ... */}
    </html>
  );
}
```

Or via CDN in your HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```
