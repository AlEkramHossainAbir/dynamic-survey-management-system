const { findUserByEmail, createUser } = require('./userModel');

// Mock the Prisma client
jest.mock('../config/db', () => require('../__tests__/mocks/prisma.mock'));
const prisma = require('../config/db');

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should find user by email successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'admin',
      };

      prisma.users.findUnique.mockResolvedValue(mockUser);

      const result = await findUserByEmail('john@example.com');

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      const result = await findUserByEmail('nonexistent@example.com');

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      prisma.users.findUnique.mockRejectedValue(dbError);

      await expect(findUserByEmail('test@example.com')).rejects.toThrow('Database connection failed');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword123',
        role: 'officer',
      };

      const mockCreatedUser = {
        id: 2,
        ...userData,
      };

      prisma.users.create.mockResolvedValue(mockCreatedUser);

      const result = await createUser(userData);

      expect(prisma.users.create).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(mockCreatedUser);
      expect(result.id).toBe(2);
    });

    it('should create admin user', async () => {
      const adminData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedAdminPass',
        role: 'admin',
      };

      const mockAdmin = { id: 1, ...adminData };
      prisma.users.create.mockResolvedValue(mockAdmin);

      const result = await createUser(adminData);

      expect(result.role).toBe('admin');
      expect(prisma.users.create).toHaveBeenCalledWith({ data: adminData });
    });

    it('should handle creation errors', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        role: 'officer',
      };

      const dbError = new Error('Unique constraint violation');
      prisma.users.create.mockRejectedValue(dbError);

      await expect(createUser(userData)).rejects.toThrow('Unique constraint violation');
    });
  });
});
