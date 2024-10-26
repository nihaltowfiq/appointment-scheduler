export function formatUsername(str: string | null) {
  if (!str || typeof str !== 'string') return;
  return str.split('@as.com')[0];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateUID() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomNum = Math.random().toString(36).substring(2, 8); // Random string part
  return timestamp + randomNum;
}
