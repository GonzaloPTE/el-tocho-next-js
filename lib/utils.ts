import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugifyText(text: string): string {
  return slugify(text, {
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
    remove: /[*+~.()\'"!:@]/g, // remove characters that match regex, replacement is applied first
    locale: "es", // language-specific replacements
    trim: true, // trim leading and trailing replacement chars
  })
}
