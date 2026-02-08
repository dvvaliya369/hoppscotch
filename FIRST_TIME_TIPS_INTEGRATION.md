# FirstTimeTips Component - Integration Guide

## Overview
The `FirstTimeTips.vue` component provides an onboarding modal for first-time users of Hoppscotch. It displays helpful tips about key features including creating requests, saving to collections, importing files, and using environments.

## Component Location
```
packages/hoppscotch-common/src/components/app/FirstTimeTips.vue
```

## Features
- Modal-based onboarding flow with 4 steps
- Progress indicator showing current step
- Navigation buttons (Next, Previous/Back, Skip)
- localStorage-based persistence (shows only once per user)
- Internationalization support (i18n)
- Uses existing Hoppscotch UI components (HoppSmartModal, HoppButtonPrimary, etc.)
- Icon support for each step

## Integration Instructions

### Option 1: Add to the Default Layout (Recommended)

The easiest way to integrate is to add the component to the default layout so it appears on app initialization.

**File:** `packages/hoppscotch-common/src/layouts/default.vue`

Add the component to the template section after the other root extension components:

```vue
<template>
  <div class="flex h-screen w-screen">
    <!-- ... existing layout code ... -->

    <!-- Let additional stuff be registered -->
    <template
      v-for="(component, index) in rootExtensionComponents"
      :key="index"
    >
      <component :is="component" />
    </template>

    <!-- Add FirstTimeTips component here -->
    <AppFirstTimeTips />
  </div>
</template>
```

The component will auto-import via the unplugin-vue-components setup.

### Option 2: Add to App.vue

Alternatively, you can add it to the root App component.

**File:** `packages/hoppscotch-common/src/App.vue`

```vue
<template>
  <div>
    <div
      v-if="isLoadingInitialRoute"
      class="flex min-h-screen flex-col items-center justify-center"
    >
      <HoppSmartSpinner />
    </div>
    <ErrorPage v-if="errorInfo !== null" :error="errorInfo" />
    <RouterView v-else />
    <Toaster rich-colors />

    <!-- Add FirstTimeTips component here -->
    <AppFirstTimeTips />
  </div>
</template>
```

### Option 3: Programmatic Trigger

You can also trigger the tips programmatically by getting a ref to the component:

```vue
<template>
  <AppFirstTimeTips ref="firstTimeTipsRef" />
</template>

<script setup lang="ts">
import { ref } from "vue"

const firstTimeTipsRef = ref()

// Trigger the tips modal manually
const showTips = () => {
  firstTimeTipsRef.value?.showTips()
}
</script>
```

## How It Works

1. **Automatic Display:** When the component mounts, it checks localStorage for the key `hoppscotch_first_time_tips_shown`
2. **First Time:** If the key doesn't exist, the modal automatically appears after 1 second delay
3. **Subsequent Visits:** If the key exists, the modal doesn't appear
4. **User Actions:**
   - Clicking "Skip" closes the modal and sets the localStorage flag
   - Clicking "Next" advances to the next tip
   - Clicking "Previous" goes back to the previous tip
   - Clicking "Got it" on the last step closes the modal and sets the flag

## Localization

Translation keys have been added to `packages/hoppscotch-common/locales/en.json`:

```json
{
  "action": {
    "next": "Next",
    "previous": "Previous",
    "skip": "Skip",
    "got_it": "Got it"
  },
  "first_time_tips": {
    "title": "Welcome to Hoppscotch!",
    "create_request": {
      "title": "Create a new request",
      "description": "Start by creating your first API request..."
    },
    "save_collections": {
      "title": "Save requests to collections",
      "description": "Organize your requests by saving them into collections..."
    },
    "import_file": {
      "title": "Import a request file",
      "description": "Import existing API collections from Postman, OpenAPI..."
    },
    "use_environments": {
      "title": "Use environments",
      "description": "Create environments to manage variables..."
    }
  }
}
```

## Customization

### Changing the Tips
Edit the `steps` array in `FirstTimeTips.vue`:

```typescript
const steps: TipStep[] = [
  {
    titleKey: "first_time_tips.create_request.title",
    descriptionKey: "first_time_tips.create_request.description",
    icon: IconLucidePlus,
  },
  // Add more steps here
]
```

### Changing the localStorage Key
Modify the constant in `FirstTimeTips.vue`:

```typescript
const FIRST_TIME_TIPS_KEY = "hoppscotch_first_time_tips_shown"
```

### Changing the Auto-Display Delay
Modify the timeout in the `checkFirstTime()` function:

```typescript
setTimeout(() => {
  show.value = true
}, 1000) // Change this value (in milliseconds)
```

## Resetting for Testing

To reset and see the tips again:
1. Open browser DevTools
2. Go to Application/Storage > Local Storage
3. Delete the `hoppscotch_first_time_tips_shown` key
4. Refresh the page

Or run in console:
```javascript
localStorage.removeItem('hoppscotch_first_time_tips_shown')
```

## Styling

The component uses Tailwind CSS classes consistent with the Hoppscotch design system:
- `bg-accent` - Accent color for active progress indicator
- `bg-accentLight` - Light accent for icon background
- `text-primary`, `text-secondary`, `text-secondaryLight` - Text hierarchy
- `bg-divider` - Inactive progress indicators

## Dependencies

The component uses these existing Hoppscotch UI components:
- `HoppSmartModal` - Modal wrapper from @hoppscotch/ui
- `HoppButtonPrimary` - Primary action buttons
- `HoppButtonSecondary` - Secondary action buttons
- Icon components from `~icons/lucide/*`

## Future Enhancements

Potential improvements:
- Add analytics tracking for tip engagement
- Allow users to re-trigger tips from settings
- Add interactive demos or guided tours for each step
- Persist which step the user was on if they close mid-flow
- Add skip all vs. remind me later options
