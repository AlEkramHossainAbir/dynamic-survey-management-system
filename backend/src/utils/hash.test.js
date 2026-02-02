const { hashPassword, comparePassword } = require('./hash');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');

describe('Hash Utility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = '$2b$10$hashedPasswordExample';
      
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should throw error if hashing fails', async () => {
      const password = 'testPassword123';
      const error = new Error('Hashing failed');
      
      bcrypt.hash.mockRejectedValue(error);

      await expect(hashPassword(password)).rejects.toThrow('Hashing failed');
    });

    it('should use 10 salt rounds', async () => {
      const password = 'password';
      bcrypt.hash.mockResolvedValue('hashed');

      await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = '$2b$10$hashedPasswordExample';
      
      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const plainPassword = 'wrongPassword';
      const hashedPassword = '$2b$10$hashedPasswordExample';
      
      bcrypt.compare.mockResolvedValue(false);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should throw error if comparison fails', async () => {
      const plainPassword = 'testPassword';
      const hashedPassword = 'hashed';
      const error = new Error('Comparison failed');
      
      bcrypt.compare.mockRejectedValue(error);

      await expect(comparePassword(plainPassword, hashedPassword)).rejects.toThrow('Comparison failed');
    });
  });
});
