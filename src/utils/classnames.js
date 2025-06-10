// utils/classnames.js - Enhanced Design System
import clsx from "clsx"

// ===========================================
// DESIGN TOKENS - Green/Stone Color System
// ===========================================

const tokens = {
  // Primary Green Palette (from the designs)
  primary: {
    50: 'bg-green-50',
    100: 'bg-green-100',
    500: 'bg-green-500',
    600: 'bg-green-600', // Main brand color
    700: 'bg-green-700',
    800: 'bg-green-800',
    900: 'bg-green-900',
  },

  // Stone-based Neutrals (replacing gray)
  neutral: {
    50: 'bg-stone-50',
    100: 'bg-stone-100',
    200: 'bg-stone-200',
    300: 'bg-stone-300',
    400: 'bg-stone-400',
    500: 'bg-stone-500',
    600: 'bg-stone-600',
    700: 'bg-stone-700',
    800: 'bg-stone-800',
    900: 'bg-stone-900',
    950: 'bg-stone-950',
  },

  // Text Colors
  text: {
    primary: 'text-stone-900 dark:text-white',
    secondary: 'text-stone-600 dark:text-stone-300',
    muted: 'text-stone-500 dark:text-stone-400',
    inverse: 'text-white dark:text-stone-900',
    brand: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
  },

  // Border Colors
  border: {
    light: 'border-stone-200 dark:border-stone-700',
    medium: 'border-stone-300 dark:border-stone-600',
    heavy: 'border-stone-400 dark:border-stone-500',
    brand: 'border-green-600 dark:border-green-400',
  },

  // Background Colors
  background: {
    primary: 'bg-white dark:bg-stone-900',
    secondary: 'bg-stone-50 dark:bg-stone-800',
    tertiary: 'bg-stone-100 dark:bg-stone-700',
    brand: 'bg-green-600',
    brandLight: 'bg-green-50 dark:bg-green-900/20',
    overlay: 'bg-stone-900/50',
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },

  // Border Radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },

  // Spacing
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
}

// ===========================================
// BASE UTILITIES
// ===========================================

const base = {
  // Layout
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexCol: "flex flex-col",

  // Grid Systems
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    cards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    form: "grid grid-cols-1 md:grid-cols-2 gap-4",
    stats: "grid grid-cols-2 lg:grid-cols-4 gap-4",
  },

  // Transitions
  transition: "transition-all duration-200 ease-in-out",
  transitionColors: "transition-colors duration-200 ease-in-out",
  transitionTransform: "transition-transform duration-200 ease-in-out",

  // Common Sizes
  size: {
    full: "w-full h-full",
    icon: "w-5 h-5",
    iconSm: "w-4 h-4",
    iconLg: "w-6 h-6",
    avatar: "w-10 h-10",
    avatarLg: "w-12 h-12",
    touch: "min-h-[44px]", // Accessibility touch target
  },

  // Typography
  typography: {
    h1: "text-2xl sm:text-3xl lg:text-4xl font-bold",
    h2: "text-xl sm:text-2xl lg:text-3xl font-bold",
    h3: "text-lg sm:text-xl font-semibold",
    h4: "text-base sm:text-lg font-semibold",
    body: "text-sm sm:text-base",
    caption: "text-xs sm:text-sm",
    label: "text-sm font-medium",
  },
}

// ===========================================
// COMPONENT DESIGN SYSTEM
// ===========================================

// Button System
export const button = {
  // Base button styles
  base: clsx(
    "inline-flex items-center justify-center",
    "font-medium",
    "border border-transparent",
    tokens.radius.md,
    base.transitionColors,
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    base.size.touch,
  ),

  // Size Variants
  size: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm sm:text-base",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  },

  // Style Variants
  variant: {
    primary: clsx(
      tokens.primary[600],
      "text-white",
      "hover:bg-green-700",
      "focus:ring-green-500",
      "active:bg-green-800"
    ),
    secondary: clsx(
      tokens.background.primary,
      tokens.text.primary,
      tokens.border.light,
      "border",
      "hover:bg-stone-50 dark:hover:bg-stone-800",
      "focus:ring-green-500"
    ),
    outline: clsx(
      "bg-transparent",
      tokens.text.brand,
      "border border-green-600",
      "hover:bg-green-50 dark:hover:bg-green-900/20",
      "focus:ring-green-500"
    ),
    ghost: clsx(
      "bg-transparent",
      tokens.text.primary,
      "hover:bg-stone-100 dark:hover:bg-stone-800",
      "focus:ring-green-500"
    ),
    danger: clsx(
      "bg-red-600 text-white",
      "hover:bg-red-700",
      "focus:ring-red-500"
    ),
  },

  // Convenience Combinations
  primary: clsx(this?.base, this?.size?.md, this?.variant?.primary),
  secondary: clsx(this?.base, this?.size?.md, this?.variant?.secondary),
}

// Card System
export const card = {
  base: clsx(
    tokens.background.primary,
    tokens.border.light,
    "border",
    tokens.radius.lg,
    tokens.shadow.md,
    "overflow-hidden",
    base.transition
  ),

  variants: {
    default: "",
    elevated: tokens.shadow.lg,
    flat: "shadow-none border-0",
    outlined: clsx(tokens.border.medium, "border-2"),
  },

  padding: {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },

  interactive: clsx(
    "cursor-pointer",
    "hover:shadow-lg hover:-translate-y-1",
    base.transitionTransform
  ),
}

// Form System
export const form = {
  group: "space-y-4",

  label: clsx(
    "block",
    base.typography.label,
    tokens.text.primary,
    "mb-1"
  ),

  input: clsx(
    "w-full",
    tokens.background.primary,
    tokens.text.primary,
    tokens.border.light,
    "border",
    tokens.radius.md,
    "px-3 py-2",
    base.size.touch,
    base.transitionColors,
    "placeholder:text-stone-400 dark:placeholder:text-stone-500",
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-800"
  ),

  textarea: clsx(
    "w-full",
    tokens.background.primary,
    tokens.text.primary,
    tokens.border.light,
    "border",
    tokens.radius.md,
    "px-3 py-2",
    "resize-none",
    base.transitionColors,
    "placeholder:text-stone-400 dark:placeholder:text-stone-500",
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),

  select: clsx(
    "w-full",
    tokens.background.primary,
    tokens.text.primary,
    tokens.border.light,
    "border",
    tokens.radius.md,
    "px-3 py-2",
    base.size.touch,
    base.transitionColors,
    "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),

  checkbox: clsx(
    "h-4 w-4",
    "text-green-600",
    tokens.border.medium,
    "border",
    tokens.radius.sm,
    "focus:ring-green-500 focus:ring-2"
  ),

  error: "text-red-600 dark:text-red-400 text-sm mt-1",
  help: "text-stone-500 dark:text-stone-400 text-sm mt-1",

  // Button styling for forms (MISSING CLASSES ADDED HERE)
  primaryButton: clsx(
    "bg-green-600 hover:bg-green-700 disabled:bg-green-400",
    "text-white font-medium",
    "py-2 px-4 sm:py-3 sm:px-6",
    "rounded-lg",
    "transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "flex items-center justify-center",
    "min-h-[44px]",
    "text-sm sm:text-base"
  ),

  secondaryButton: clsx(
    "bg-stone-100 dark:bg-stone-700",
    "text-stone-900 dark:text-white",
    "hover:bg-stone-200 dark:hover:bg-stone-600",
    "border border-stone-300 dark:border-stone-600",
    "font-medium",
    "py-2 px-4 sm:py-3 sm:px-6",
    "rounded-lg",
    "transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "flex items-center justify-center",
    "min-h-[44px]",
    "text-sm sm:text-base"
  ),

  dangerButton: clsx(
    "bg-red-600 hover:bg-red-700 disabled:bg-red-400",
    "text-white font-medium",
    "py-2 px-4 sm:py-3 sm:px-6",
    "rounded-lg",
    "transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "flex items-center justify-center",
    "min-h-[44px]",
    "text-sm sm:text-base"
  ),

  buttonGroup: clsx(
    "flex flex-col sm:flex-row",
    "gap-3",
    "mt-4 sm:mt-6"
  ),

  // Additional specialized form elements
  timePicker: clsx(
    "inline-flex items-center",
    "border border-stone-300 dark:border-stone-600",
    "rounded-md shadow-sm",
    "bg-white dark:bg-stone-900",
    "min-h-[44px]"
  ),
}

// Badge/Status System
export const badge = {
  base: clsx(
    "inline-flex items-center",
    "px-2.5 py-0.5",
    "text-xs font-medium",
    tokens.radius.full
  ),

  variants: {
    default: clsx(tokens.background.secondary, tokens.text.primary),
    primary: clsx(tokens.primary[600], "text-white"),
    success: clsx("bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"),
    warning: clsx("bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"),
    error: clsx("bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"),
    info: clsx("bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"),
  },
}

// ===========================================
// PAGE LAYOUTS
// ===========================================

// App Layout
export const app = {
  main: clsx(
    "min-h-screen",
    tokens.background.secondary,
    tokens.text.primary,
    base.flexCol
  ),
  container: clsx(base.container, "flex-1 py-6"),
}

// Navigation
export const navbar = {
  nav: clsx(
    tokens.primary[600],
    "text-white",
    tokens.shadow.lg,
    "sticky top-0 z-50"
  ),
  container: clsx(base.container, "py-4"),
  inner: clsx(base.flexBetween),
  brand: clsx(base.flexStart, "space-x-3"),
  logo: clsx(base.size.iconLg),
  title: clsx(base.typography.h3, "text-white"),
  actions: clsx(base.flexStart, "space-x-2"),
}

// Page Header
export const header = {
  container: clsx(base.flexBetween, "mb-6"),
  content: clsx(base.flexCol, "space-y-1"),
  title: clsx(base.typography.h1, tokens.text.primary),
  subtitle: clsx(base.typography.body, tokens.text.secondary),
  actions: clsx(base.flexStart, "space-x-3"),
}

// ===========================================
// COMPONENT-SPECIFIC STYLES
// ===========================================

// Trainer Cards
export const trainerCard = {
  container: clsx(
    card.base,
    card.interactive,
    "group"
  ),

  imageSection: clsx(
    "h-40 relative overflow-hidden",
    "bg-gradient-to-br from-green-400 to-green-600"
  ),

  image: clsx(
    "w-full h-full object-cover",
    "group-hover:scale-105",
    base.transitionTransform
  ),

  placeholder: clsx(
    "w-full h-full",
    base.flexCenter,
    "text-white/30"
  ),

  badge: clsx(
    "absolute top-3 left-3",
    badge.base,
    badge.variants.success
  ),

  content: clsx(card.padding.md, "space-y-3"),

  header: clsx(base.flexBetween, "items-start"),

  title: clsx(base.typography.h4, tokens.text.primary),

  specialty: clsx(base.typography.body, tokens.text.brand),

  location: clsx(base.typography.caption, tokens.text.secondary),

  footer: clsx(base.flexBetween, "items-center", "mt-4"),

  price: clsx(base.typography.h4, tokens.text.primary),

  priceLabel: clsx(base.typography.caption, tokens.text.secondary),
}

// Calendar Component
export const calendar = {
  container: clsx(
    card.base,
    card.padding.md,
    "space-y-4"
  ),

  header: clsx(base.flexBetween, "items-center"),

  title: clsx(base.typography.h4, tokens.text.primary),

  navigation: clsx(base.flexStart, "space-x-4"),

  navButton: clsx(
    "p-2",
    tokens.radius.md,
    tokens.text.secondary,
    "hover:bg-stone-100 dark:hover:bg-stone-800",
    base.transitionColors
  ),

  monthTitle: clsx(base.typography.label, tokens.text.primary),

  weekdays: clsx(
    "grid grid-cols-7 gap-1 mb-2",
    "text-center text-xs font-medium",
    tokens.text.secondary
  ),

  dates: "grid grid-cols-7 gap-1",

  date: {
    base: clsx(
      "h-10 w-full",
      base.flexCenter,
      base.typography.caption,
      tokens.radius.md,
      base.transitionColors,
      "cursor-pointer"
    ),
    available: clsx(
      tokens.text.primary,
      "hover:bg-green-50 dark:hover:bg-green-900/20"
    ),
    selected: clsx(
      tokens.primary[600],
      "text-white"
    ),
    unavailable: clsx(
      tokens.text.muted,
      "cursor-not-allowed opacity-50"
    ),
  },
}

// Time Slots
export const timeSlots = {
  container: clsx(card.base, card.padding.md),

  header: clsx("space-y-2 mb-4"),

  title: clsx(base.typography.h4, tokens.text.primary),

  subtitle: clsx(base.typography.body, tokens.text.secondary),

  grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",

  slot: {
    base: clsx(
      "p-3 text-center",
      tokens.border.light,
      "border",
      tokens.radius.md,
      base.typography.caption,
      "font-medium",
      base.transitionColors,
      "cursor-pointer"
    ),
    available: clsx(
      tokens.background.primary,
      tokens.text.primary,
      "hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300"
    ),
    selected: clsx(
      tokens.primary[600],
      "text-white border-green-600"
    ),
    unavailable: clsx(
      tokens.background.tertiary,
      tokens.text.muted,
      "cursor-not-allowed"
    ),
  },
}

// Booking Summary
export const bookingSummary = {
  container: clsx(card.base, card.padding.md),

  header: clsx(base.flexBetween, "items-center mb-4"),

  title: clsx(base.typography.h4, tokens.text.primary),

  clearButton: clsx(
    base.typography.caption,
    "text-red-600 hover:text-red-700",
    "font-medium underline",
    base.transitionColors
  ),

  sessions: "space-y-4",

  session: {
    container: clsx(
      tokens.background.secondary,
      tokens.border.light,
      "border",
      tokens.radius.md,
      "p-4"
    ),
    header: clsx(base.flexBetween, "items-start mb-2"),
    details: "space-y-1",
    remove: clsx(
      base.typography.caption,
      "text-red-600 hover:text-red-700",
      "font-medium",
      base.transitionColors
    ),
  },

  total: {
    container: clsx(
      "border-t",
      tokens.border.light,
      "pt-4 mt-4"
    ),
    row: clsx(base.flexBetween, "items-center"),
    label: clsx(base.typography.body, tokens.text.primary),
    value: clsx(base.typography.body, "font-semibold", tokens.text.primary),
    grandTotal: clsx(base.typography.h4, tokens.text.brand),
  },
}

// Dashboard Specific
export const dashboard = {
  layout: clsx("min-h-screen", tokens.background.secondary),

  header: {
    container: clsx(
      tokens.background.primary,
      tokens.shadow.sm,
      "sticky top-0 z-40"
    ),
    inner: clsx(base.container, "py-4"),
    content: clsx(base.flexBetween),
    left: clsx(base.flexStart, "space-x-4"),
    title: clsx(base.typography.h2, tokens.text.primary),
    right: clsx(base.flexStart, "space-x-3"),
  },

  navigation: {
    container: clsx(
      tokens.background.primary,
      "border-b",
      tokens.border.light,
      "sticky top-16 z-30",
      "overflow-x-auto"
    ),
    inner: clsx(base.container),
    tabs: clsx("flex space-x-8 min-w-max"),
    tab: {
      base: clsx(
        base.flexStart,
        "space-x-2 py-4 px-1",
        "border-b-2 font-medium text-sm",
        base.transitionColors,
        "whitespace-nowrap"
      ),
      active: clsx(
        "border-green-500",
        tokens.text.brand
      ),
      inactive: clsx(
        "border-transparent",
        tokens.text.secondary,
        "hover:text-stone-700 dark:hover:text-stone-300"
      ),
    },
  },

  main: clsx(base.container, "py-8"),

  mainContent: clsx(base.container, "py-8"),

  section: {
    container: clsx(card.base, card.padding.lg, "mb-8"),
    header: clsx(base.flexBetween, "items-start mb-6"),
    title: clsx(base.typography.h3, tokens.text.primary),
    content: "space-y-6",
  },

  stats: {
    grid: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
    card: clsx(
      card.base,
      card.padding.md,
      base.flexBetween,
      "items-center"
    ),
    content: "flex-1",
    label: clsx(base.typography.caption, tokens.text.secondary),
    value: clsx(base.typography.h3, tokens.text.primary),
    icon: clsx(base.size.iconLg, "flex-shrink-0"),
  },

  // Form classes for dashboard (THESE WERE MISSING!)
  form: {
    group: "space-y-4",

    label: clsx(
      "block",
      base.typography.label,
      tokens.text.primary,
      "mb-1"
    ),

    input: clsx(
      "w-full",
      tokens.background.primary,
      tokens.text.primary,
      tokens.border.light,
      "border",
      tokens.radius.md,
      "px-3 py-2",
      base.size.touch,
      base.transitionColors,
      "placeholder:text-stone-400 dark:placeholder:text-stone-500",
      "focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-800"
    ),

    primaryButton: clsx(
      "bg-green-600 hover:bg-green-700 disabled:bg-green-400",
      "text-white font-medium",
      "py-2 px-4 sm:py-3 sm:px-6",
      "rounded-lg",
      "transition-colors",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "flex items-center justify-center",
      "min-h-[44px]",
      "text-sm sm:text-base",
      "w-full sm:w-auto"
    ),

    secondaryButton: clsx(
      "bg-stone-100 dark:bg-stone-700",
      "text-stone-900 dark:text-white",
      "hover:bg-stone-200 dark:hover:bg-stone-600",
      "border border-stone-300 dark:border-stone-600",
      "font-medium",
      "py-2 px-4 sm:py-3 sm:px-6",
      "rounded-lg",
      "transition-colors",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "flex items-center justify-center",
      "min-h-[44px]",
      "text-sm sm:text-base",
      "w-full sm:w-auto"
    ),

    dangerButton: clsx(
      "bg-red-600 hover:bg-red-700 disabled:bg-red-400",
      "text-white font-medium",
      "py-2 px-4 sm:py-3 sm:px-6",
      "rounded-lg",
      "transition-colors",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "flex items-center justify-center",
      "min-h-[44px]",
      "text-sm sm:text-base",
      "w-full sm:w-auto"
    ),

    buttonGroup: clsx(
      "flex flex-col sm:flex-row",
      "gap-3",
      "mt-4 sm:mt-6"
    ),
  },
}

// Status Indicators
export const status = {
  pending: clsx(badge.base, "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"),
  confirmed: clsx(badge.base, "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"),
  cancelled: clsx(badge.base, "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"),
  completed: clsx(badge.base, "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"),
}

// Theme Toggle
export const theme = {
  toggle: clsx(
    "p-2",
    tokens.radius.md,
    "text-white/80 hover:text-white",
    "hover:bg-white/10",
    base.transitionColors,
  ),
}

// Utility Exports
export { tokens, base }

// Legacy compatibility (can be removed later)
export const components = { badge, card, button }
export const colors = tokens