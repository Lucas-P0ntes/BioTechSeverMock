import { Request, Response } from 'express';
import { LoginResponse } from '../models/LoginResponse';
import { v4 as uuidv4 } from 'uuid';

export class LoginController {
  /**
   * Mock login response for testing and development
   */
  static mockLoginResponse(email: string): LoginResponse {
    return {
      professionalId: 1,
      companyName: 'Dev Company',
      email: email,
      authToken: `dev-token-${uuidv4()}`,
    };
  }
  
  /**
   * Format login response to match Swift model expectations
   */
  private static formatLoginResponse(response: LoginResponse): any {
    return {
      professional_id: response.professionalId,
      company_name: response.companyName,
      email: response.email,
      token: response.authToken,
    };
  }

  /**
   * POST /api/login
   * Performs user login
   */
  static async performLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required',
        });
        return;
      }

      // TODO: Implement real authentication logic here
      // For now, return mock response
      const mockResponse = LoginController.mockLoginResponse(email);
      const formattedResponse = LoginController.formatLoginResponse(mockResponse);
      console.log('[LOGIN CONTROLLER] Login successful');
      res.json(formattedResponse);
    } catch (error) {
      console.error('[LOGIN CONTROLLER] Error trying to login:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

