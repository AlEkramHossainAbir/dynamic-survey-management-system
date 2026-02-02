// Mock Prisma Client for testing
const mockPrismaClient = {
  users: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  surveys: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  survey_fields: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  field_options: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  submissions: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  submission_answers: {
    create: jest.fn(),
    createMany: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaClient)),
};

module.exports = mockPrismaClient;
