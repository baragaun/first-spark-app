export const getUserInitials = (handle: string): string => {
  if (!handle || typeof handle !== 'string') {
    return '';
  }

  const trimmed = handle.trim();
  if (!trimmed) {
    return '';
  }

  let initials = trimmed[0]; // Always include the first character

  // Find all uppercase letters in the string
  const uppercaseLetters = trimmed.match(/[A-Z]/g);

  if (uppercaseLetters && uppercaseLetters.length > 0) {
    // Add the first uppercase letter (if any) to the initials
    initials += uppercaseLetters[0];
  }

  return initials.slice(0, 2); // Ensure only up to 2 characters are returned
};
