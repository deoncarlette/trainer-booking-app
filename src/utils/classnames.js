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
    x6: "space-x-6",
    y3: "space-y-3",
  },

  // Common sizing
  size: {
    full: "w-full h-full",
    icon: "w-8 h-8",
    avatar: "w-12 h-12",
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

  // Dark mode variants
  dark: {
    bg: "dark:bg-stone-800",
    bgAlt: "dark:bg-black",
    bgInput: "dark:bg-stone-800",
    bgCard: "dark:bg-stone-900",
    text: "dark:text-stone-100",
    textAlt: "dark:text-gray-100",
    hover: "dark:hover:bg-gray-700",
  },

  // Light mode variants
  light: {
    bg: "bg-white",
    bgAlt: "bg-gray-50",
    bgInput: "bg-gray-100",
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
  },

  // Input variants
  input: clsx(
    "w-full",
    colors.light.borderInput,
    colors.light.bgInput,
    colors.dark.bgInput,
    colors.dark.text,
    base.rounded.sm,
    "px-3 py-2"
  ),

  // Text variants
  text: {
    heading: clsx("font-bold", colors.light.text, colors.dark.text),
    subheading: clsx("font-medium", colors.primary.text),
    muted: clsx("text-sm", colors.light.textMuted, colors.dark.text),
    label: "block text-sm font-medium mb-1",
  },
}

// Main component exports
export const app = {
  main: clsx("min-h-screen", base.flexCol, colors.dark.bg, colors.dark.text),
  container: clsx("flex-grow", base.container, "py-6"),
}

export const header = {
  container: clsx(base.flexBetween, "mb-6"),
  h1: clsx("text-2xl md:text-2xl", components.text.heading),
  button: components.button.secondary,
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

  // Month navigation
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

  // Weekday labels
  weekdayContainer: clsx(
    "grid grid-cols-7 gap-1 mb-1",
    "text-center text-xs",
    "text-gray-500 dark:text-gray-400"
  ),

  // Date grid
  dateGrid: "grid grid-cols-7 gap-1",

  // Date cell variants
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

// Time slot picker component styles
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

  // Time slot grid
  grid: clsx(
    "grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4"
  ),

  // Time slot button variants
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

  // Selected summary section
  summary: {
    container: clsx(
      "border-t border-gray-600 pt-4 text-sm"
    ),

    text: "mb-1",

    label: "font-bold",
  },
}

// Booking summary component styles
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

  // Date group styling
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

  // Total section
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

// Export utilities for custom use
export { base, colors, components }