// utils/classnames.js
import clsx from "clsx"

export const app = {
  main: "min-h-screen flex flex-col dark:bg-stone-800 dark:text-stone-100",
  container: clsx(
    "flex-grow container mx-auto px-4 py-6"
  ),
}

export const header = {
  container: "flex justify-between items-center mb-6",
  h1: "text-2xl md:text-2xl font-bold text-gray-800 dark:text-stone-100",
  button: clsx(
    "bg-white border border-gray-300 rounded-md",
    "px-3 py-1.5 flex items-center space-x-1 text-sm hover:bg-gray-50 transition",
  )
}

export const navbar = {
  nav: "bg-green-600 text-white shadow-lg",
  outer: "container mx-auto px-4 py-3 flex justify-between items-center",
  inner: "flex items-center space-x-2",
  button: "w-8 h-8 rounded-full bg-green-700 flex items-center justify-center font-bold",
}

export const theme = {
  toggleButton: "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition",
  dark: "text-yellow-500",
  light: "text-gray-700",
}

export const trainerList = {
  container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
}

export const trainerCard = {
  container: clsx(
    "trainer-card", // css
    "bg-white rounded-xl shadow-md overflow-hidden transition duration-300",
    "dark:bg-black dark:text-gray-100",
  ),
  imageContainer: "h-40 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center",
  availabilityOuter: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4",
  availabilityInner: "flex items-center space-x-2",
  availabilityBackground: "bg-green-500 rounded-full w-2 h-2",
  availability: "text-white text-sm",
  nameContainer: "justify-between items-start",
  name: "font-bold text-lg text-gray-800 dark:text-stone-100",
  specialty: "text-green-600 font-medium",
  location: "mt-3 text-sm text-gray-600 dark:text-stone-100",
  duration: "text-sm text-gray-600",
  bookContainer: "mt-3 flex items-center justify-between",
  priceContainer: "text-gray-800",
  price: "font-bold text-xl dark:text-stone-100",
  session: "text-sm text-gray-600 dark:text-stone-100",
  bookButton: "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition",
}

export const bookingSection = {
  bookingOuter: "bg-white rounded-xl shadow-lg p-5 mb-8 dark:bg-black dark:text-gray-100",
  h2: "text-xl font-bold text-gray-800 mb-4 dark:text-gray-100",
  bookingInner: "flex flex-col md:flex-row md:space-x-6",
  session: "md:w-1/3 mb-6 md:mb-0",
}

export const trainerProfile = {
  outerContainer: "bg-gradient-to-r from-green-900 to-green-600 text-white rounded-lg p-4 mb-4",
  innerContainer: "flex items-center space-x-3",
  initials: "w-12 h-12 bg-white text-green-600 rounded-full flex items-center justify-center font-bold text-xl",
  name: "font-bold",

}

export const sessionDetails = {
  container: "bg-gray-50 text-gray-950 dark:bg-stone-900 dark:text-stone-100 rounded-lg p-4",
  h4: "font-medium mb-3",
  innerContainer: "space-y-3",
  label: "block text-sm font-medium mb-1",
  text: "w-full border border-gray-600 bg-gray-100 dark:bg-stone-800 dark:text-stone-100 rounded-md px-3 py-2",
}