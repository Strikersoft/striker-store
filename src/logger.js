export class Logger {
  constructor(name) {
    this.name = name;
  }

  debug(...args) {
    console.log(`[${this.name}]`, ...args);
  }

  warn(...args) {
    console.warn(`[${this.name}]`, ...args);
  }

  error(...args) {
    console.error(`[${this.name}]`, ...args);
  }
}
