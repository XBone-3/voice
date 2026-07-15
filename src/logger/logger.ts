import { IS_DEV } from '@env';
import type { LogEntry, LogLevel } from './types';

const MAX_ENTRIES = 200;

/**
 * In-memory only — no network calls, no third-party crash/log reporting
 * service. Deliberate: PROJECT_MANIFEST.md's platform policy prohibits
 * cloud dependencies, and that applies to logging/crash infrastructure too,
 * not just AI. Phase 014 (Debug Screen) will read getEntries() to build a
 * log viewer on DiagnosticsScreen.
 *
 * No content-based redaction exists yet (NON_FUNCTIONAL_REQUIREMENTS.md's
 * "never log passwords/messages/contacts/PII/voice recordings" is a
 * convention callers must follow — nothing calls this with sensitive data
 * yet, so there's nothing to enforce). Revisit if a future caller (e.g.
 * Phase 044 Contacts, Phase 046 SMS) needs it.
 */
class Logger {
  private entries: LogEntry[] = [];

  private record(
    level: LogLevel,
    tag: string,
    message: string,
    data?: unknown,
  ) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      tag,
      message,
      data,
    };
    this.entries.push(entry);
    if (this.entries.length > MAX_ENTRIES) {
      this.entries.shift();
    }

    if (IS_DEV) {
      const line = `[${tag}] ${message}`;
      if (level === 'debug') {
        console.log(line, data ?? '');
      } else if (level === 'info') {
        console.info(line, data ?? '');
      } else if (level === 'warn') {
        console.warn(line, data ?? '');
      } else {
        console.error(line, data ?? '');
      }
    }
  }

  debug(tag: string, message: string, data?: unknown) {
    this.record('debug', tag, message, data);
  }

  info(tag: string, message: string, data?: unknown) {
    this.record('info', tag, message, data);
  }

  warn(tag: string, message: string, data?: unknown) {
    this.record('warn', tag, message, data);
  }

  error(tag: string, message: string, data?: unknown) {
    this.record('error', tag, message, data);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
  }
}

export const logger = new Logger();
