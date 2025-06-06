// utils/classnames.js
import clsx from "clsx"

// Base utility functions for common patterns
const base = {
  // Container patterns
  container: "container mx-auto px-4",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex justify-between items-center",
  flexCol: "flex flex-col",

  // Spacing
  space: {
    x1: "space-x-1",
    x2: "space-x-2",
    x3: "space-x-3",
    x4: "space-x-4",
    x6: "space-x-6",
    y3: "space-y-3",
    y4: "space-y-4",
    y6: "space-y-6",
  },

  // Common sizing
  size: {
    full: "w-full h-full",
    icon: "w-8 h-8",
    iconSm: "w-4 h-4",
    iconLg: "w-5 h-5",
    avatar: "w-12 h-12",
    avatarSm: "w-10 h-10",
    avatarLg: "w-32 h-32",
  },

  // Border radius
  rounded: {
    sm: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },

  // Transitions
  transition: "transition duration-300",
  transitionColors: "transition",

  // Grid layouts
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    flexResponsive: "flex flex-col md:flex-row md:space-x-6",
    cols2: "grid grid-cols-1 md:grid-cols-2 gap-4",
    cols3: "grid grid-cols-1 md:grid-cols-3 gap-6",
    cols4: "grid grid-cols-1 md:grid-cols-4 gap-4",
  },
}

// Color schemes for consistent theming
const colors = {
  // Primary colors (green theme)
  primary: {
    base: "bg-green-600 text-white",
    hover: "hover:bg-green-700",
    dark: "bg-green-700",
    light: "bg-green-500",
    text: "text-green-600",
    gradient: "bg-gradient-to-r from-green-500 to-green-600",
    gradientDark: "bg-gradient-to-r from-green-900 to-green-600",
  },

  // Secondary colors (blue theme for dashboard)
  secondary: {
    base: "bg-blue-500 text-white",
    hover: "hover:bg-blue-600",
    dark: "bg-blue-600",
    light: "bg-blue-400",
    text: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900",
  },

  // Status colors
  status: {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },

  // Dark mode variants
  dark: {
    bg: "dark:bg-stone-800",
    bgAlt: "dark:bg-black",
    bgInput: "dark:bg-stone-800",
    bgCard: "dark:bg-stone-900",
    bgDashboard: "dark:bg-gray-900",
    bgDashboardCard: "dark:bg-gray-800",
    text: "dark:text-stone-100",
    textAlt: "dark:text-gray-100",
    textMuted: "dark:text-gray-400",
    border: "dark:border-gray-700",
    borderInput: "dark:border-gray-600",
    hover: "dark:hover:bg-gray-700",
    hoverCard: "dark:hover:bg-gray-750",
  },

  // Light mode variants
  light: {
    bg: "bg-white",
    bgAlt: "bg-gray-50",
    bgInput: "bg-gray-100",
    bgDashboard: "bg-gray-50",
    text: "text-gray-800",
    textMuted: "text-gray-600",
    textLight: "text-gray-700",
    border: "border-gray-300",
    borderInput: "border-gray-600",
    hover: "hover:bg-gray-50",
    hoverAlt: "hover:bg-gray-200",
  },
}

// Component-specific mixins
const components = {
  // Card variants
  card: clsx(
    base.rounded.xl,
    "shadow-md overflow-hidden",
    base.transition,
    colors.light.bg,
    colors.dark.bgAlt,
    colors.dark.textAlt
  ),

  dashboardCard: clsx(
    base.rounded.lg,
    "shadow",
    colors.light.bg,
    colors.dark.bgDashboardCard,
    "p-6"
  ),

  // Button variants
  button: {
    primary: clsx(
      colors.primary.base,
      colors.primary.hover,
      "font-medium py-2 px-4",
      base.rounded.lg,
      base.transitionColors
    ),
    secondary: clsx(
      colors.secondary.base,
      colors.secondary.hover,
      "font-medium py-2 px-4",
      base.rounded.lg,
      base.transitionColors
    ),
    outline: clsx(
      colors.light.bg,
      colors.light.border,
      base.rounded.sm,
      "px-3 py-1.5",
      base.flexCenter,
      base.space.x1,
      "text-sm",
      colors.light.hover,
      base.transitionColors
    ),
    icon: clsx(
      "p-2",
      base.rounded.full,
      colors.light.hoverAlt,
      colors.dark.hover,
      base.transitionColors
    ),
    small: clsx(
      "px-3 py-1 text-sm",
      base.rounded.sm,
      base.transitionColors
    ),
  },

  // Input variants
  input: clsx(
    "w-full",
    colors.light.borderInput,
    colors.light.bgInput,
    colors.dark.bgInput,
    colors.dark.text,
    colors.dark.borderInput,
    base.rounded.sm,
    "px-3 py-2",
    "border"
  ),

  // Text variants
  text: {
    heading: clsx("font-bold", colors.light.text, colors.dark.text),
    subheading: clsx("font-medium", colors.primary.text),
    muted: clsx("text-sm", colors.light.textMuted, colors.dark.textMuted),
    label: clsx("block text-sm font-medium mb-1", colors.light.textLight, colors.dark.text),
  },

  // Badge/Status indicators
  badge: clsx(
    "px-2 py-1 text-xs",
    base.rounded.full,
    "font-medium"
  ),
}

// Main component exports
export const app = {
  main: clsx("min-h-screen", base.flexCol, colors.dark.bg, colors.dark.text),
  container: clsx("flex-grow", base.container, "py-6"),
}

export const header = {
  container: clsx(base.flexBetween, "mb-6"),
  h1: clsx("text-2xl md:text-2xl", components.text.heading),
  button: components.button.outline,
}

export const navbar = {
  nav: clsx(colors.primary.base, "shadow-lg"),
  outer: clsx(base.container, "py-3", base.flexBetween),
  inner: clsx(base.flexCenter, base.space.x2),
  button: clsx(
    base.size.icon,
    base.rounded.full,
    colors.primary.dark,
    base.flexCenter,
    "font-bold"
  ),
}

export const theme = {
  toggleButton: components.button.icon,
  dark: "text-yellow-500",
  light: colors.light.textLight,
}

export const trainerList = {
  container: clsx(base.grid.responsive, "mb-8"),
}

export const trainerCard = {
  container: clsx(components.card, "trainer-card"),
  imageContainer: clsx(
    "h-40",
    colors.primary.gradient,
    base.flexCenter
  ),
  availabilityOuter: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4",
  availabilityInner: clsx(base.flexCenter, base.space.x2),
  availabilityBackground: clsx(colors.primary.light, base.rounded.full, "w-2 h-2"),
  availability: "text-white text-sm",
  nameContainer: "justify-between items-start",
  name: clsx("text-lg", components.text.heading),
  specialty: components.text.subheading,
  location: clsx("mt-3", components.text.muted),
  duration: components.text.muted,
  bookContainer: clsx("mt-3", base.flexBetween),
  priceContainer: colors.light.text,
  price: clsx("font-bold text-xl", colors.dark.text),
  session: components.text.muted,
  bookButton: components.button.primary,
}

export const bookingSection = {
  bookingOuter: clsx(
    colors.light.bg,
    base.rounded.xl,
    "shadow-lg p-5 mb-8",
    colors.dark.bgAlt,
    colors.dark.textAlt
  ),
  h2: clsx("text-xl", components.text.heading, "mb-4"),
  bookingInner: base.grid.flexResponsive,
  session: "md:w-1/3 mb-6 md:mb-0",
}

export const trainerProfile = {
  outerContainer: clsx(
    colors.primary.gradientDark,
    "text-white",
    base.rounded.lg,
    "p-4 mb-4"
  ),
  innerContainer: clsx(base.flexCenter, base.space.x3),
  initials: clsx(
    base.size.avatar,
    colors.light.bg,
    colors.primary.text,
    base.rounded.full,
    base.flexCenter,
    "font-bold text-xl"
  ),
  name: "font-bold",
}

export const sessionDetails = {
  container: clsx(
    colors.light.bgAlt,
    "text-gray-950",
    colors.dark.bgCard,
    colors.dark.text,
    base.rounded.lg,
    "p-4"
  ),
  h4: "font-medium mb-3",
  innerContainer: base.space.y3,
  label: components.text.label,
  text: components.input,
}

// Calendar component styles
export const calendar = {
  container: clsx(
    "w-full p-4",
    base.rounded.sm,
    colors.light.bg,
    colors.dark.bgCard,
    colors.dark.text,
    "shadow-md mb-5"
  ),

  heading: clsx(
    "font-medium mb-3",
    "text-gray-900 dark:text-white"
  ),

  wrapper: clsx(
    "border border-gray-200",
    base.rounded.lg
  ),

  monthNav: clsx(
    base.flexBetween,
    "mb-2 border border-gray-300 p-3"
  ),

  navButton: clsx(
    "text-gray-500",
    "hover:text-gray-900 dark:hover:text-white"
  ),

  monthTitle: clsx(
    "text-gray-800 dark:text-gray-200 font-semibold"
  ),

  weekdayContainer: clsx(
    "grid grid-cols-7 gap-1 mb-1",
    "text-center text-xs",
    "text-gray-500 dark:text-gray-400"
  ),

  dateGrid: "grid grid-cols-7 gap-1",

  dateCell: {
    base: clsx(
      "h-8",
      base.flexCenter,
      base.rounded.sm,
      "text-sm",
      base.transitionColors
    ),

    selected: clsx(
      colors.primary.base
    ),

    available: clsx(
      "text-gray-900 dark:text-white",
      "cursor-pointer",
      "hover:bg-gray-200 dark:hover:bg-gray-700"
    ),

    unavailable: clsx(
      "bg-gray-200 text-stone-400",
      "dark:bg-stone-700 dark:text-stone-500",
      "cursor-not-allowed"
    ),
  },
}

export const timeSlots = {
  container: clsx(
    colors.dark.bgCard,
    colors.dark.text,
    "p-4"
  ),

  heading: "font-medium mb-2",

  dateDisplay: clsx(
    "text-sm text-gray-400 mb-2"
  ),

  emptyState: clsx(
    "text-gray-500 text-sm italic"
  ),

  grid: clsx(
    "grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4"
  ),

  slotButton: {
    base: clsx(
      "py-2 px-2 text-center",
      base.rounded.sm,
      "border text-sm",
      base.transitionColors
    ),

    selected: clsx(
      colors.primary.base,
      "border-green-600"
    ),

    available: clsx(
      "border-gray-600 text-gray-300",
      "hover:bg-gray-100 dark:hover:bg-stone-700"
    ),
  },

  summary: {
    container: clsx(
      "border-t border-gray-600 pt-4 text-sm"
    ),

    text: "mb-1",

    label: "font-bold",
  },
}

export const bookingSummary = {
  container: clsx(
    colors.light.bg,
    base.rounded.xl,
    "shadow-lg p-5 mb-8",
    colors.dark.bgAlt,
    colors.dark.textAlt
  ),

  heading: clsx(
    "text-xl font-bold mb-4",
    colors.light.text,
    colors.dark.textAlt
  ),

  emptyState: clsx(
    "text-gray-500 text-center py-4 italic"
  ),

  clearButton: clsx(
    "text-red-500 hover:text-red-700 text-sm font-medium",
    base.transitionColors
  ),

  dateGroup: {
    container: "mb-6 last:mb-0",

    date: clsx(
      "font-semibold text-lg mb-3",
      colors.primary.text
    ),

    timeBlock: {
      container: clsx(
        "bg-gray-50 dark:bg-stone-800",
        base.rounded.lg,
        "p-4 mb-3 last:mb-0"
      ),

      header: clsx(
        base.flexBetween,
        "items-start mb-2"
      ),

      timeRange: clsx(
        "font-medium",
        colors.light.text,
        colors.dark.text
      ),

      removeButton: clsx(
        "text-red-500 hover:text-red-700 text-xs",
        base.transitionColors
      ),

      details: clsx(
        "text-sm",
        colors.light.textMuted,
        colors.dark.text
      ),

      price: clsx(
        "font-bold text-lg",
        colors.primary.text
      ),

      breakdown: clsx(
        "text-xs text-gray-500 dark:text-gray-400"
      ),
    },
  },

  total: {
    container: clsx(
      "border-t pt-4 mt-4",
      "border-gray-200 dark:border-gray-600"
    ),

    row: clsx(
      base.flexBetween,
      "mb-2 last:mb-0"
    ),

    label: clsx(
      "font-medium",
      colors.light.text,
      colors.dark.text
    ),

    value: clsx(
      "font-bold",
      colors.light.text,
      colors.dark.text
    ),

    grandTotal: clsx(
      "text-xl font-bold",
      colors.primary.text
    ),
  },
}

// Dashboard component styles
export const dashboard = {
  // Main layout

  layout: clsx(
    "min-h-screen",
    colors.light.bgDashboard,
    colors.dark.bgDashboard
  ),

  mainContent: clsx(
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  ),

  // Header
  header: {
    container: clsx(
      colors.light.bg,
      colors.dark.bgDashboardCard,
      "shadow"
    ),

    inner: clsx(
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    ),

    content: clsx(
      base.flexBetween,
      "py-6"
    ),

    left: clsx(
      base.flexCenter,
      base.space.x4
    ),

    avatar: clsx(
      base.size.avatarSm,
      base.rounded.full,
      "object-cover"
    ),

    title: clsx(
      "text-2xl font-bold",
      colors.light.text,
      colors.dark.text
    ),

    subtitle: clsx(
      colors.light.textMuted,
      colors.dark.textMuted
    ),

    right: clsx(
      base.flexCenter,
      base.space.x4
    ),

    iconButton: clsx(
      "p-2",
      colors.light.textMuted,
      colors.dark.textMuted,
      "hover:text-gray-900 dark:hover:text-white"
    ),

    primaryButton: components.button.secondary,
  },

  // Navigation tabs
  navigation: {
    container: clsx(
      colors.light.bg,
      colors.dark.bgDashboardCard,
      "border-b",
      colors.dark.border
    ),

    inner: clsx(
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    ),

    tabs: clsx(
      "flex",
      base.space.x2,
      "md:space-x-8"
    ),

    tab: {
      base: clsx(
        base.flexCenter,
        base.space.x2,
        "py-4 px-1 border-b-2 font-medium text-sm",
        base.transitionColors
      ),

      active: clsx(
        "border-blue-500 text-blue-600 dark:text-blue-400"
      ),

      inactive: clsx(
        "border-transparent",
        colors.light.textMuted,
        colors.dark.textMuted,
        "hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
      ),
    },
  },

  // Stats cards
  stats: {
    grid: base.grid.cols4,

    card: clsx(
      components.dashboardCard,
      base.flexBetween
    ),

    content: "flex-1",

    label: clsx(
      "text-sm",
      colors.light.textMuted,
      colors.dark.textMuted
    ),

    value: clsx(
      "text-2xl font-bold",
      colors.light.text,
      colors.dark.text
    ),

    icon: clsx(
      base.size.icon,
      "flex-shrink-0"
    ),
  },

  // Content sections
  section: {
    container: components.dashboardCard,

    header: clsx(
      base.flexBetween,
      "mb-4"
    ),

    title: clsx(
      "text-lg font-semibold",
      colors.dark.text
    ),

    content: base.space.y4,

    emptyState: clsx(
      colors.light.textMuted,
      colors.dark.textMuted,
      "text-center py-8"
    ),
  },

  // Forms and inputs
  form: {
    group: "space-y-4",

    label: components.text.label,

    input: components.input,

    textarea: clsx(
      components.input,
      "resize-none"
    ),

    select: components.input,

    buttonGroup: clsx(
      "flex",
      base.space.x3,
      "mt-6"
    ),

    primaryButton: components.button.secondary,

    secondaryButton: clsx(
      components.button.small,
      "bg-gray-500 text-white hover:bg-gray-600"
    ),
  },

  // Tables and lists
  table: {
    container: "overflow-x-auto",

    table: "w-full border-collapse",

    header: clsx(
      "border-b",
      colors.dark.border
    ),

    headerCell: clsx(
      "text-left p-3 font-medium",
      colors.light.textMuted,
      colors.dark.textMuted
    ),

    row: clsx(
      "border-b",
      colors.dark.border,
      "hover:bg-gray-50 dark:hover:bg-gray-700",
      base.transitionColors
    ),

    cell: clsx(
      "p-3",
      colors.dark.text
    ),
  },

  // Filter buttons
  filters: {
    container: clsx(
      "flex",
      base.space.x2
    ),

    button: {
      base: clsx(
        components.button.small,
        base.transitionColors
      ),

      active: clsx(
        colors.secondary.base
      ),

      inactive: clsx(
        "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
        "hover:bg-gray-300 dark:hover:bg-gray-600"
      ),
    },
  },

  // Status badges
  status: {
    confirmed: colors.status.success,
    pending: colors.status.warning,
    cancelled: colors.status.error,
  },

  // Action buttons
  actions: {
    container: clsx(
      "flex",
      base.space.x2,
      "mt-3"
    ),

    edit: clsx(
      components.button.small,
      colors.secondary.base,
      colors.secondary.hover
    ),

    delete: clsx(
      components.button.small,
      "bg-red-500 text-white hover:bg-red-600"
    ),

    add: clsx(
      components.button.small,
      "bg-green-500 text-white hover:bg-green-600",
      base.flexCenter,
      base.space.x1
    ),
  },
}

// Export utilities for custom use
export { base, colors, components }