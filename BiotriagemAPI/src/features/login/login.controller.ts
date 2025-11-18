import { Request, Response } from 'express';
import { LoginResponse } from './login.model';
import { v4 as uuidv4 } from 'uuid';

export class LoginController {
  /**
   * Mock users database for testing and development
   */
  private static mockUsers = [
    {
      email: 'ADM@gmail.com',
      password: 'ADM',
      professionalId: 1,
      companyName: 'Dev Company',
    },
    {
      email: 'user1@test.com',
      password: '123456',
      professionalId: 2,
      companyName: 'Test Company',
    },
    {
      email: 'user2@test.com',
      password: 'password',
      professionalId: 3,
      companyName: 'Another Company',
    },
    {
      email: 'admin@biotriagem.com',
      password: 'admin123',
      professionalId: 4,
      companyName: 'Biotriagem Admin',
    },
  ];

  /**
   * Mock login response for testing and development
   */
  static mockLoginResponse(email: string, professionalId: number, companyName: string): LoginResponse {
    return {
      professionalId: professionalId,
      companyName: companyName,
      email: email,
      authToken: `dev-token-${uuidv4()}`,
    };
  }
  
  /**
   * Validates user credentials against mock database
   */
  private static validateCredentials(email: string, password: string): { valid: boolean; user?: any } {
    const user = LoginController.mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      return { valid: true, user };
    }
    
    return { valid: false };
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

      // Validate credentials against mock database
      const validation = LoginController.validateCredentials(email, password);
      
      if (!validation.valid || !validation.user) {
        console.log(`[LOGIN] Login failed for email: ${email}`);
        res.status(401).json({
          error: 'Invalid email or password',
        });
        return;
      }

      // Generate login response with user data
      const mockResponse = LoginController.mockLoginResponse(
        validation.user.email,
        validation.user.professionalId,
        validation.user.companyName
      );
      const formattedResponse = LoginController.formatLoginResponse(mockResponse);
      console.log(`[LOGIN] Login successful for email: ${email}`);
      res.json(formattedResponse);
    } catch (error) {
      console.error('[LOGIN] Error trying to login:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

