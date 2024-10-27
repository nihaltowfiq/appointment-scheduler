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

export function formatDateTime(time: string, date: string): string {
  const dateTimeString = `${date}T${time}`;

  const dateObj = new Date(dateTimeString);

  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${formattedTime}, ${formattedDate}`;
}

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString
    .split('-')
    .map((part) => part.padStart(2, '0'));
  return `${year}-${month}-${day}`;
};
