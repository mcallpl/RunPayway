export function generateReference(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `RPX-${year}-${seq}`;
}
