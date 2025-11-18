import { Request, Response, NextFunction } from 'express';
import { RequestLog, RequestLogger } from '../utils/requestLogger';

/**
 * Middleware para capturar e armazenar logs de requests/responses
 */
export const requestLoggerMiddleware = (logger: RequestLogger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Captura o body do request (se existir)
    let requestBody: any = null;
    if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
      requestBody = req.body;
    }
    
    // Captura query params
    const queryParams = Object.keys(req.query).length > 0 ? req.query : null;
    
    // Captura headers (removendo Authorization por segurança)
    const headers = { ...req.headers };
    if (headers.authorization) {
      headers.authorization = '[REDACTED]';
    }
    
    // Cria log inicial do request
    const requestLog: RequestLog = {
      id: requestId,
      method: req.method,
      path: req.path,
      originalUrl: req.originalUrl,
      query: queryParams,
      headers: headers,
      body: requestBody,
      timestamp: new Date().toISOString(),
      statusCode: null,
      responseTime: null,
      responseBody: null,
      error: null
    };
    
    // Flag para garantir que o log seja adicionado apenas uma vez
    let logAdded = false;
    
    // Intercepta o response
    const originalSend = res.send;
    const originalJson = res.json;
    
    const addLogOnce = (body: any) => {
      if (logAdded) return; // Evita duplicação
      
      const responseTime = Date.now() - startTime;
      requestLog.statusCode = res.statusCode;
      requestLog.responseTime = responseTime;
      
      // Tenta parsear o body se for string
      try {
        if (typeof body === 'string') {
          requestLog.responseBody = JSON.parse(body);
        } else {
          requestLog.responseBody = body;
        }
      } catch {
        requestLog.responseBody = body;
      }
      
      // Marca erro se status >= 400
      if (res.statusCode >= 400) {
        requestLog.error = `HTTP ${res.statusCode}`;
      }
      
      // Adiciona o log completo apenas uma vez
      logger.addLog(requestLog);
      logAdded = true;
    };
    
    res.send = function(body: any) {
      addLogOnce(body);
      return originalSend.call(this, body);
    };
    
    res.json = function(body: any) {
      addLogOnce(body);
      return originalJson.call(this, body);
    };
    
    // Fallback: se o response terminar sem chamar send/json, adiciona log vazio
    res.on('finish', () => {
      if (!logAdded) {
        const responseTime = Date.now() - startTime;
        requestLog.statusCode = res.statusCode;
        requestLog.responseTime = responseTime;
        if (res.statusCode >= 400) {
          requestLog.error = `HTTP ${res.statusCode}`;
        }
        logger.addLog(requestLog);
        logAdded = true;
      }
    });
    
    next();
  };
};

