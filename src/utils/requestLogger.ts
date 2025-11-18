/**
 * Interface para um log de request/response
 */
export interface RequestLog {
  id: string;
  method: string;
  path: string;
  originalUrl: string;
  query: any;
  headers: any;
  body: any;
  timestamp: string;
  statusCode: number | null;
  responseTime: number | null;
  responseBody: any;
  error: string | null;
}

/**
 * Classe para gerenciar logs de requests em memória
 */
export class RequestLogger {
  private logs: RequestLog[] = [];
  private maxLogs: number = 1000; // Limite de logs em memória
  private subscribers: Set<(log: RequestLog) => void> = new Set();

  /**
   * Adiciona um novo log
   */
  addLog(log: RequestLog): void {
    this.logs.unshift(log); // Adiciona no início
    
    // Remove logs antigos se exceder o limite
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Notifica todos os subscribers
    this.notifySubscribers(log);
  }

  /**
   * Retorna todos os logs
   */
  getLogs(): RequestLog[] {
    return this.logs;
  }

  /**
   * Retorna os últimos N logs
   */
  getRecentLogs(limit: number = 50): RequestLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Limpa todos os logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Adiciona um subscriber para receber novos logs em tempo real
   */
  subscribe(callback: (log: RequestLog) => void): () => void {
    this.subscribers.add(callback);
    
    // Retorna função para unsubscribe
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notifica todos os subscribers sobre um novo log
   */
  private notifySubscribers(log: RequestLog): void {
    this.subscribers.forEach(callback => {
      try {
        callback(log);
      } catch (error) {
        console.error('[REQUEST LOGGER] Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Retorna estatísticas dos logs
   */
  getStats(): {
    total: number;
    byMethod: Record<string, number>;
    byStatus: Record<string, number>;
    averageResponseTime: number;
  } {
    const byMethod: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    this.logs.forEach(log => {
      // Conta por método
      byMethod[log.method] = (byMethod[log.method] || 0) + 1;
      
      // Conta por status
      if (log.statusCode) {
        const statusRange = `${Math.floor(log.statusCode / 100)}xx`;
        byStatus[statusRange] = (byStatus[statusRange] || 0) + 1;
      }
      
      // Soma tempos de resposta
      if (log.responseTime !== null) {
        totalResponseTime += log.responseTime;
        responseTimeCount++;
      }
    });

    return {
      total: this.logs.length,
      byMethod,
      byStatus,
      averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0
    };
  }
}

// Singleton instance
export const requestLogger = new RequestLogger();

