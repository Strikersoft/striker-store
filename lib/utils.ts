export function invariant(msg, ...rest) {
  console.warn(`[striker-store]: ${msg}`, ...rest);
}
