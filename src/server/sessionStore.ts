import { CompleteDocumentData } from './samplePresentation.js';
import { DocumentMetadata } from '../types/index.js';

interface SessionEntry {
  data: CompleteDocumentData;
  lastAccessed: number;
}

class InMemorySessionStore {
  private sessions = new Map<string, SessionEntry>();
  private readonly SESSION_EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 hours

  constructor() {
    // Periodic garbage collection for expired sessions
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 15 * 60 * 1000);
  }

  public set(id: string, data: CompleteDocumentData): void {
    this.sessions.set(id, {
      data,
      lastAccessed: Date.now(),
    });
  }

  public get(id: string): CompleteDocumentData | undefined {
    const entry = this.sessions.get(id);
    if (!entry) return undefined;
    entry.lastAccessed = Date.now();
    return entry.data;
  }

  public has(id: string): boolean {
    return this.sessions.has(id);
  }

  public updateStatus(
    id: string,
    status: DocumentMetadata['status'],
    progress: number,
    currentAction: string,
    errorMessage?: string
  ): void {
    const entry = this.sessions.get(id);
    if (entry) {
      entry.data.metadata.status = status;
      entry.data.metadata.progress = progress;
      entry.data.metadata.currentAction = currentAction;
      if (errorMessage) {
        entry.data.metadata.errorMessage = errorMessage;
      }
      entry.lastAccessed = Date.now();
    }
  }

  public delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  public getAllMetadata(): DocumentMetadata[] {
    return Array.from(this.sessions.values()).map((entry) => entry.data.metadata);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [id, entry] of this.sessions.entries()) {
      if (now - entry.lastAccessed > this.SESSION_EXPIRATION_MS) {
        console.log(`[EVIAI SessionStore] Purged expired session: ${id}`);
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionStore = new InMemorySessionStore();
