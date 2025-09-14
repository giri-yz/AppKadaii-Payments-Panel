// A simple XOR encryption for light obfuscation.
// Note: This is not cryptographically secure and should not be used for sensitive data.

// Base64 encoding is used to ensure the encrypted string is safe for localStorage.

export function encrypt(text: string, key: string): string {
  // On the server, we don't have access to window, so we return an empty string.
  if (typeof window === 'undefined' || !key) return '';

  const encrypted = text.split('').map((char, i) => {
    const charCode = char.charCodeAt(0) ^ key.charCodeAt(i % key.length);
    return String.fromCharCode(charCode);
  }).join('');

  // Encode to Base64 to safely store in localStorage
  return window.btoa(encrypted);
}

export function decrypt(encryptedText: string, key: string): string {
  // On the server, we don't have access to window, so we return an empty string.
  if (typeof window === 'undefined' || !key) return '';

  try {
    // Decode from Base64
    const decodedText = window.atob(encryptedText);

    const decrypted = decodedText.split('').map((char, i) => {
      const charCode = char.charCodeAt(0) ^ key.charCodeAt(i % key.length);
      return String.fromCharCode(charCode);
    }).join('');

    return decrypted;
  } catch (e) {
    console.error("Failed to decrypt data. It might be corrupted or not encrypted.", e);
    // Return an empty string if decryption fails. This can happen if the password is wrong
    // or the data is not what we expect.
    return "";
  }
}
