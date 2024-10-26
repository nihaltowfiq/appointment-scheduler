import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function classNames(...values: ClassValue[]) {
  return twMerge(clsx(values));
}

export default classNames;
