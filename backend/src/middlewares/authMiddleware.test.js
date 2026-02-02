const jwt = require('jsonwebtoken');
const { authenticateJWT, authorizeRole } = require('./authMiddleware');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateJWT', () => {
    it('should authenticate with valid token', () => {
      const token = 'valid.jwt.token';
      const decoded = { id: 1, role: 'admin' };
      
      mockReq.headers.authorization = `Bearer ${token}`;
      jwt.verify.mockReturnValue(decoded);

      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
      expect(mockReq.user).toEqual(decoded);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject request without authorization header', () => {
      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Missing token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject request without Bearer prefix', () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject request with malformed Bearer token', () => {
      mockReq.headers.authorization = 'Bearer ';

      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject expired token', () => {
      const token = 'expired.jwt.token';
      mockReq.headers.authorization = `Bearer ${token}`;
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token expired or invalid' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      const token = 'invalid.jwt.token';
      mockReq.headers.authorization = `Bearer ${token}`;
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateJWT(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token expired or invalid' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRole', () => {
    beforeEach(() => {
      mockReq.user = { id: 1, role: 'admin' };
    });

    it('should allow access for authorized role', () => {
      const middleware = authorizeRole(['admin']);

      middleware(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access for multiple authorized roles', () => {
      mockReq.user.role = 'officer';
      const middleware = authorizeRole(['admin', 'officer']);

      middleware(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      mockReq.user.role = 'officer';
      const middleware = authorizeRole(['admin']);

      middleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should deny access when user role is not in allowed roles', () => {
      mockReq.user.role = 'guest';
      const middleware = authorizeRole(['admin', 'officer']);

      middleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should work with single role in array', () => {
      const middleware = authorizeRole(['admin']);

      middleware(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
