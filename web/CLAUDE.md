[Root](../CLAUDE.md) > **web**

---

# Web Module - React Frontend

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The web module provides the admin dashboard and user interface:
- User authentication and management
- Channel configuration
- Token management
- Usage logs and analytics
- Settings administration
- Playground for testing AI models

---

## Entry Points

- `src/App.jsx` - Main application component with routing
- `src/index.jsx` - React DOM entry point
- `index.html` - HTML template

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **UI Library**: Semi Design (@douyinfe/semi-ui)
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **i18n**: i18next + react-i18next
- **Charts**: VChart (@visactor/react-vchart)
- **Styling**: Tailwind CSS + PostCSS
- **Package Manager**: Bun (preferred)

---

## Directory Structure

```
web/src/
  App.jsx              - Main app with routing
  components/
    auth/              - Authentication components (Login, Register, 2FA)
    common/            - Shared components (Markdown, Modals, UI)
    dashboard/         - Dashboard widgets and panels
    layout/            - Layout components (Header, Sidebar, Footer)
    model-deployments/ - Model deployment components
    playground/        - AI playground components
    settings/          - Settings page components
    table/             - Table components (channels, tokens, etc.)
  context/
    Status/            - Application status context
    Theme/             - Theme context (light/dark)
    User/              - User authentication context
  helpers/             - Utility functions (API, data, tokens)
  hooks/               - Custom React hooks
  i18n/                - Internationalization
    i18n.js            - i18next configuration
    locales/           - Translation files (zh, en, ja, fr, ru, vi)
  pages/               - Page components (routed)
  services/            - API service functions
  constants/           - Frontend constants
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-router-dom | ^6.3.0 | Routing |
| @douyinfe/semi-ui | ^2.69.1 | UI components |
| axios | 1.13.5 | HTTP client |
| i18next | ^23.16.8 | Internationalization |
| @visactor/react-vchart | ~1.8.8 | Charts |
| mermaid | ^11.6.0 | Diagrams |
| marked | ^4.1.1 | Markdown parsing |

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | Main dashboard |
| Channel | `/channel` | Channel management |
| Token | `/token` | Token management |
| Log | `/log` | Usage logs |
| User | `/user` | User management (admin) |
| Model | `/model` | Model management |
| Pricing | `/pricing` | Pricing display |
| Playground | `/playground` | AI testing playground |
| Setting | `/setting` | System settings |
| TopUp | `/topup` | Balance top-up |
| Subscription | `/subscription` | Subscription management |
| Task | `/task` | Async task management |
| Midjourney | `/midjourney` | Midjourney tasks |
| Setup | `/setup` | Initial setup wizard |
| About | `/about` | About page |

---

## Context Providers

### UserContext (`context/User/`)
- User authentication state
- User info and preferences
- Login/logout functions

### ThemeContext (`context/Theme/`)
- Light/dark mode
- Theme persistence

### StatusContext (`context/Status/`)
- Application status
- Loading states

---

## Scripts

```bash
bun run dev          # Development server (localhost:5173)
bun run build        # Production build
bun run preview      # Preview production build
bun run lint         # Prettier check
bun run lint:fix     # Prettier fix
bun run eslint       # ESLint check
bun run eslint:fix   # ESLint fix
bun run i18n:extract # Extract translation keys
bun run i18n:sync    # Sync translations
bun run i18n:lint    # Lint translations
```

---

## Internationalization

### Supported Languages
- Chinese Simplified (zh-CN) - default/fallback
- Chinese Traditional (zh-TW)
- English (en)
- Japanese (ja)
- French (fr)
- Russian (ru)
- Vietnamese (vi)

### Usage

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('key')}</div>;
}
```

---

## API Integration

All API calls go through `helpers/api.js`:

```javascript
// Example API call
import { API } from './helpers/api';

const response = await API.get('/api/channel');
```

Base URL is proxied to `http://localhost:3000` in development.

---

## Build Configuration

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `i18next.config.js` - i18next configuration

---

## FAQ

**Q: How do I add a new page?**
A: 1. Create component in `src/pages/NewPage/index.jsx`
   2. Add route in `src/App.jsx`
   3. Add sidebar link if needed

**Q: How do I add a new translation?**
A: 1. Add key to `src/i18n/locales/zh-CN.json`
   2. Run `bun run i18n:sync` to sync to other languages
   3. Translate the key in other locale files

**Q: How do I make authenticated API calls?**
A: The API helper automatically includes auth tokens from cookies/localStorage.

---

## Related Files

- `package.json` - Dependencies and scripts
- `vite.config.js` - Build configuration
- `src/App.jsx` - Main application
- `src/helpers/api.js` - API utilities

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
