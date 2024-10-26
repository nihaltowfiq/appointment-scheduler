export function formatUsername(str: string | null) {
  if (!str || typeof str !== 'string') return;
  return str.split('@as.com')[0];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
