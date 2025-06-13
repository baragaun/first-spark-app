export function getUserInitials(userHandle: string) {
  const handle = userHandle?.trim();
  const words = handle?.split(/(?=[A-Z])|(?=[^A-Za-z])/);
  const initials = words?.map((word) => word.charAt(0)).join('');
  return initials;
}
