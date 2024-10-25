export function formatUsername(str: string | null) {
  if (!str || typeof str !== 'string') return;
  return str.split('@as.com')[0];
}
