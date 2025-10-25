import { Inter, Playfair_Display } from 'next/font/google';

/**
 * Base font - used for body and general text
 */
export const base = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-base',
  display: 'swap',
});

/**
 * Heading font - used for main headings and titles
 */
export const heading = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

/**
 * Subheading font - used for emphasis and secondary headings
 */
export const subheading = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-subheading',
  style: ['normal', 'italic'],
  display: 'swap',
});
