export const convertUtcToLocal = (data: Date | string): string => {
  const date = new Date(data);

  const day = String(date.getDate()).padStart(2, '0');

  // Array of month names to get MMM format
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = date.getMonth();
  const month = monthNames[monthIndex];

  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get AM/PM format
  const amPM = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12; // Handle midnight (0 hours)

  const item = `${day}-${month}-${year} ${hours12}:${minutes}:${seconds} ${amPM}`;

  return item;
};




import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  exp: number;
  [key: string]: any;
}
// Function to decode JWT token
export const getTokenData = (token: string): TokenPayload | null => {
  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    return decodedToken;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
