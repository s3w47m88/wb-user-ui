# Website Builder by Spencer Hill

A modern, visual website builder with drag-and-drop editing, themes, templates, and inline content editing.

## Related repositories

- https://github.com/s3w47m88/wb-admin-ui
- https://github.com/s3w47m88/wb-control-api
- https://github.com/s3w47m88/wb-content-api
- https://github.com/s3w47m88/wb-builder
- https://github.com/s3w47m88/wb-jobs
- https://github.com/s3w47m88/wb-shared
- https://github.com/s3w47m88/wb-infra

## Authoritative Architecture

The system architecture, planes, server layout, and operating rules live here:
- `docs/infrastructure.md`
- `docs/siteplan`

## Features

- **10 Pre-built Templates** - SaaS, Portfolio, E-commerce, and more
- **Inline Editing** - Click to edit text, images, and buttons directly
- **Drag & Drop** - Reorder components with visible drag handles
- **Theme System** - 8 pre-built themes with custom color palettes
- **Auto-save** - Changes persist automatically to Supabase
- **Share Links** - Public preview and edit URLs
- **Advanced Image Uploader** - Auto-resize and WebP conversion
- **10 Component Types** - Hero, CTA, Gallery, Text, Features, Testimonials, Pricing, Stats, Contact, Footer

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v3
- Zustand (State Management)
- Supabase (Control + Content Planes)
- @dnd-kit (Drag and Drop)
- Replicate API (AI Image Generation)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- (Optional) Replicate API key for AI image generation

### Installation

1. Clone the repository:
\`\`\`bash
git clone git@github.com:s3w47m88/website-builder.git
cd website-builder
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file with your credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_CONTROL_URL=your_control_plane_url
NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY=your_control_plane_publishable_key
SUPABASE_CONTROL_SECRET_KEY=your_control_plane_secret_key
SUPABASE_CONTROL_PROJECT_ID=your_control_plane_project_id

NEXT_PUBLIC_SUPABASE_CONTENT_URL=your_content_plane_url
NEXT_PUBLIC_SUPABASE_CONTENT_PUBLISHABLE_KEY=your_content_plane_publishable_key
SUPABASE_CONTENT_SECRET_KEY=your_content_plane_secret_key
SUPABASE_CONTENT_PROJECT_ID=your_content_plane_project_id

REPLICATE_API_TOKEN=your_replicate_token (optional)
\`\`\`

4. Run the Supabase migration:
\`\`\`bash
npm run migrate
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Railway Deployment

This repo currently hosts the User UI Server. The full multi-service plan is defined in `docs/infrastructure.md`.
Deployed service: https://railway.com/project/b63cf75f-49b9-418f-97d5-ea9b8f21755d/service/f9949045-28ca-44a4-9314-f0e309d6bae1?environmentId=cab149f1-da97-4d7b-a966-f4f05af454d9

1. Install Railway CLI:
\`\`\`bash
npm i -g @railway/cli
\`\`\`

2. Login to Railway:
\`\`\`bash
railway login
\`\`\`

3. Link to your project:
\`\`\`bash
railway link
\`\`\`

4. Set environment variables (per `docs/infrastructure.md`):
\`\`\`bash
railway variables --set "NEXT_PUBLIC_SUPABASE_CONTROL_URL=your_control_url" \\
  --set "NEXT_PUBLIC_SUPABASE_CONTROL_PUBLISHABLE_KEY=your_control_key" \\
  --set "SUPABASE_CONTROL_SECRET_KEY=your_control_secret" \\
  --set "SUPABASE_CONTROL_PROJECT_ID=your_control_project_id" \\
  --set "NEXT_PUBLIC_SUPABASE_CONTENT_URL=your_content_url" \\
  --set "NEXT_PUBLIC_SUPABASE_CONTENT_PUBLISHABLE_KEY=your_content_key" \\
  --set "SUPABASE_CONTENT_SECRET_KEY=your_content_secret" \\
  --set "SUPABASE_CONTENT_PROJECT_ID=your_content_project_id"
\`\`\`

5. Deploy:
\`\`\`bash
railway up
\`\`\`

## Critical Issue: React Hooks in Helper Functions

### What Broke the Deployment

**Issue**: Calling React hooks (\`useEditorStore\`) inside a regular JavaScript helper function (\`renderComponent\`) violates React's Rules of Hooks.

**Deployment ID that worked**: `827692ce-619c-492f-a15d-9d1662fd2e84`

**What changed**: In commit `6699529`, theme colors were added to all components. The \`renderComponent\` helper function was modified to call \`useEditorStore((state) => state.theme)\` directly inside the function body.

### The Problem

React hooks can **only** be called:
1. At the top level of a React component
2. At the top level of a custom hook
3. **NOT** inside regular JavaScript functions, loops, or conditions

\`\`\`typescript
// ❌ WRONG - Breaks React Rules of Hooks
function renderComponent(...) {
  const theme = useEditorStore((state) => state.theme); // ERROR!
  // ...
}
\`\`\`

### The Fix

Pass the theme as a **parameter** instead of calling the hook inside the helper function:

\`\`\`typescript
// ✅ CORRECT - Call hook in the component, pass as parameter
export const EditableBlock: React.FC<EditableBlockProps> = ({ component, disabled = false }) => {
  const { updateComponent, removeComponent, theme } = useEditorStore(); // Hook called here ✓

  return (
    <div>
      {renderComponent(component, true, handleTextEdit, handleImageEdit, theme)} {/* Pass theme ✓ */}
    </div>
  );
};

// ✅ CORRECT - Accept theme as parameter
function renderComponent(
  component: ComponentData,
  editable: boolean,
  onTextEdit: (key: string, value: string) => void,
  onImageEdit: (key: string) => void,
  theme: any // Parameter instead of hook call ✓
) {
  const { type, props } = component;
  // Now use theme.colors.primary, theme.colors.secondary, etc.
}
\`\`\`

### How to Prevent This

**Rules to Follow:**

1. **Only call hooks at the component level** - Extract theme/state in the component, not in helper functions
2. **Pass state as parameters** - Helper functions should receive state as arguments
3. **Test builds locally** - Run \`npm run build\` before deploying to catch these errors early
4. **Check for hook violations** - Look for \`use*\` function calls inside non-component functions

**Example Pattern:**

\`\`\`typescript
// Component (can use hooks)
const MyComponent = () => {
  const data = useMyHook(); // ✅ OK
  return <div>{helperFunction(data)}</div>; // Pass to helper
};

// Helper function (receives data as param)
function helperFunction(data: any) { // ✅ OK
  // Do NOT call useMyHook() here ❌
  return data.value;
}
\`\`\`

### Build Verification

Always test production builds locally before deploying:

\`\`\`bash
npm run build
\`\`\`

If you see errors about "Invalid hook call" or hooks being called in wrong places, refactor to pass data as parameters instead.

## Critical Issue 2: TypeScript Build Failure - Missing Type Definitions

### What Broke the Deployment

**Failing Build ID**: `c13fc9a5-0de7-44cb-8e62-25fa387931c9`
**Last Working Build ID**: `460e513e-e56f-4a7a-9830-559f1a5db393`

**Error Message**:
\`\`\`
Type error: Could not find a declaration file for module 'pg'.
'/app/node_modules/pg/esm/index.mjs' implicitly has an 'any' type.
Try `npm i --save-dev @types/pg` if it exists or add a new declaration (.d.ts) file containing `declare module 'pg';`

./src/app/api/run-migration/route.ts:2:24
\`\`\`

### The Problem

**Root Cause**: The file \`src/app/api/run-migration/route.ts\` was created during debugging sessions to run database migrations programmatically. This file:

1. **Imported the \`pg\` module** (PostgreSQL client) without corresponding TypeScript type definitions
2. **Was localhost-only** (included a host check to prevent production use)
3. **Should never have been deployed** - it was a debugging tool, not a production feature
4. **Caused TypeScript compilation to fail** during \`next build\`

### What Changed Between Builds

**Files that changed in this session**:
- \`src/components/editor/Canvas.tsx\` - Rebuilt component insertion feature
- \`src/components/blocks/GalleryBlock.tsx\` - Replaced external placeholder images with base64 SVG
- \`src/app/api/generate-image/route.ts\` - Replaced external placeholder images with base64 SVG

**None of these changes should have affected deployment.**

The real issue was that \`src/app/api/run-migration/route.ts\` existed from a **previous debugging session** (commit \`d00aad9\`) but TypeScript strict mode only started failing on it now due to build environment differences.

### The Fix

**Removed the problematic files**:
1. Deleted \`src/app/api/run-migration/\` directory entirely
2. Removed \`pg\` dependency from \`package.json\`

**Why this is safe**:
- This was a localhost-only debugging endpoint
- Not used by any production features
- Database migrations should be handled via Supabase dashboard or CLI, not through API routes

### How to Prevent This

**Rules to Follow:**

1. **Never commit debugging API routes** - Keep them local or in a separate branch
2. **If you add a new dependency, add its types** - Run \`npm i --save-dev @types/package-name\`
3. **Test builds before pushing** - Run \`npm run build\` locally to catch TypeScript errors
4. **Keep \`package.json\` clean** - Remove unused dependencies regularly
5. **Use proper migration tools** - Supabase CLI or dashboard, not custom API routes

**Debugging vs Production**:

\`\`\`typescript
// ❌ BAD - Debug endpoint that breaks builds
// src/app/api/run-migration/route.ts
import { Client } from 'pg'; // No @types/pg installed!

export async function POST(request: NextRequest) {
  // Localhost check doesn't prevent build failures
  if (!host.includes('localhost')) return;
  // ... migration logic
}
\`\`\`

\`\`\`bash
# ✅ GOOD - Use proper tools for migrations
npx supabase db push
# or run SQL directly in Supabase dashboard
\`\`\`

### Dependency Management

**Before adding any npm package**:

\`\`\`bash
# 1. Install the package
npm install package-name

# 2. Check if types are needed
npm search @types/package-name

# 3. If types exist, install them
npm install --save-dev @types/package-name

# 4. Test the build
npm run build
\`\`\`

**Audit dependencies regularly**:

\`\`\`bash
# List all dependencies
npm list --depth=0

# Remove unused packages
npm uninstall package-name

# Update package.json and package-lock.json
npm install
\`\`\`

### Build Verification Checklist

Before every deployment:

- [ ] Run \`npm run build\` locally
- [ ] Check for TypeScript errors
- [ ] Verify no debugging files in \`src/app/api/\`
- [ ] Confirm all dependencies have types (if needed)
- [ ] Review git diff for unexpected changes
- [ ] Test locally with \`npm start\` (production mode)

## License

MIT

## Author

Spencer Hill - [GitHub](https://github.com/s3w47m88)
