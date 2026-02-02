const jwt = require('jsonwebtoken');
const { login } = require('./authController');
const { findUserByEmail } = require('../models/userModel');
const { comparePassword } = require('../utils/hash');

// Mock dependencies
jest.mock('../models/userModel');
jest.mock('../utils/hash');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'admin@example.com';
      const password = 'password123';
      const mockUser = {
        id: 1,
        name: 'Admin User',
        email: email,
        password: 'hashedPassword',
        role: 'admin',
      };
      const mockToken = 'jwt.token.here';

      mockReq.body = { email, password };
      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await login(mockReq, mockRes);

      expect(findUserByEmail).toHaveBeenCalledWith(email);
      expect(comparePassword).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: mockToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should return 401 when user not found', async () => {
      mockReq.body = { email: 'nonexistent@example.com', password: 'password' };
      findUserByEmail.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(findUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(comparePassword).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 when password does not match', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'officer',
      };

      mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(comparePassword).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 500 on server error', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password' };
      const error = new Error('Database error');
      findUserByEmail.mockRejectedValue(error);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    it('should handle JWT signing errors', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'admin',
      };

      mockReq.body = { email: 'test@example.com', password: 'password' };
      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    it('should not include password in response', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'officer',
      };
      const mockToken = 'jwt.token';

      mockReq.body = { email: 'test@example.com', password: 'password' };
      findUserByEmail.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await login(mockReq, mockRes);

      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.user.password).toBeUndefined();
    });
  });
});
