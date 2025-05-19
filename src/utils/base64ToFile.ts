/**
 * Converts a base64 string to a File object
 * @param base64 - The base64 string to convert
 * @param filename - The name to give the file
 * @param mimeType - The MIME type of the file (default: 'image/jpeg')
 * @returns A File object created from the base64 string
 */
export function base64ToFile(
  base64: string,
  filename: string,
  mimeType: string = 'image/jpeg'
): File {
  // Remove data URL prefix if it exists
  const base64WithoutPrefix = base64.includes('base64,')
    ? base64.split('base64,')[1]
    : base64;

  // Convert base64 to binary
  const binaryString = atob(base64WithoutPrefix);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create Blob and then File from the binary data
  const blob = new Blob([bytes], { type: mimeType });
  
  return new File([blob], filename, { type: mimeType });
}

/**
 * Extracts the MIME type from a base64 data URL
 * @param base64 - The base64 data URL
 * @returns The MIME type or null if not found
 */
export function getMimeTypeFromBase64(base64: string): string | null {
  const match = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  return match ? match[1] : null;
}

export default base64ToFile;