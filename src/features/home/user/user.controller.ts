import { Request, Response } from 'express';
import { User } from './user.model';

export class UserController {
  /**
   * Mock user for testing and development
   */
  static mockUser(): User {
    return {
      uid: '1',
      name: 'João',
      lastName: 'Silva',
      email: 'joao.silva@dev.com',
    };
  }

  /**
   * GET /api/user
   * Gets user information
   */
  static async getUserInformation(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement real user retrieval logic here
      // For now, return mock response
      const mockUser = UserController.mockUser();
      console.log('[HOME - USER] Successfully received User information');
      res.json(mockUser);
    } catch (error) {
      console.error('[HOME - USER] Error retrieving User information:', error);
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

