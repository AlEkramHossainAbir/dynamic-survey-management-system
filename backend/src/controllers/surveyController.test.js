const {
  createSurvey,
  getSurveys,
  getSurveyById,
  deleteSurvey,
  addFieldToSurvey,
  updateField,
  deleteField,
  getSubmissions,
  updateSurvey,
  reorderFields,
} = require('./surveyController');

// Mock Prisma
jest.mock('../config/db', () => require('../__tests__/mocks/prisma.mock'));
const prisma = require('../config/db');

describe('Survey Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1, role: 'admin' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSurvey', () => {
    it('should create survey successfully', async () => {
      const mockSurvey = {
        id: 1,
        title: 'Customer Feedback',
        description: 'Please provide feedback',
        created_by: 1,
      };

      mockReq.body = { title: 'Customer Feedback', description: 'Please provide feedback' };
      prisma.surveys.create.mockResolvedValue(mockSurvey);

      await createSurvey(mockReq, mockRes);

      expect(prisma.surveys.create).toHaveBeenCalledWith({
        data: {
          title: 'Customer Feedback',
          description: 'Please provide feedback',
          created_by: 1,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockSurvey);
    });

    it('should return 400 when title is missing', async () => {
      mockReq.body = { description: 'Some description' };

      await createSurvey(mockReq, mockRes);

      expect(prisma.surveys.create).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Title is required' });
    });

    it('should create survey without description', async () => {
      const mockSurvey = { id: 1, title: 'Simple Survey', created_by: 1 };
      mockReq.body = { title: 'Simple Survey' };
      prisma.surveys.create.mockResolvedValue(mockSurvey);

      await createSurvey(mockReq, mockRes);

      expect(prisma.surveys.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getSurveys', () => {
    it('should get surveys with pagination', async () => {
      const mockSurveys = [
        { id: 1, title: 'Survey 1' },
        { id: 2, title: 'Survey 2' },
      ];

      mockReq.query = { page: '1', limit: '10' };
      prisma.surveys.findMany.mockResolvedValue(mockSurveys);
      prisma.surveys.count.mockResolvedValue(2);

      await getSurveys(mockReq, mockRes);

      expect(prisma.surveys.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockSurveys,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should use default pagination values', async () => {
      mockReq.query = {};
      prisma.surveys.findMany.mockResolvedValue([]);
      prisma.surveys.count.mockResolvedValue(0);

      await getSurveys(mockReq, mockRes);

      expect(prisma.surveys.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });
    });

    it('should calculate correct skip for page 2', async () => {
      mockReq.query = { page: '2', limit: '5' };
      prisma.surveys.findMany.mockResolvedValue([]);
      prisma.surveys.count.mockResolvedValue(0);

      await getSurveys(mockReq, mockRes);

      expect(prisma.surveys.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('getSurveyById', () => {
    it('should get survey by id with fields', async () => {
      const mockSurvey = {
        id: 1,
        title: 'Test Survey',
        survey_fields: [
          { id: 1, label: 'Name', field_type: 'text', order_index: 0, field_options: [] },
        ],
      };

      mockReq.params.id = '1';
      prisma.surveys.findUnique.mockResolvedValue(mockSurvey);

      await getSurveyById(mockReq, mockRes);

      expect(prisma.surveys.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          survey_fields: {
            orderBy: { order_index: 'asc' },
            include: { field_options: true },
          },
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockSurvey);
    });

    it('should return 404 when survey not found', async () => {
      mockReq.params.id = '999';
      prisma.surveys.findUnique.mockResolvedValue(null);

      await getSurveyById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Survey not found' });
    });
  });

  describe('deleteSurvey', () => {
    it('should delete survey successfully', async () => {
      mockReq.params.id = '1';
      prisma.surveys.delete.mockResolvedValue({ id: 1 });

      await deleteSurvey(mockReq, mockRes);

      expect(prisma.surveys.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Survey deleted' });
    });
  });

  describe('addFieldToSurvey', () => {
    it('should add text field without options', async () => {
      const mockField = {
        id: 1,
        survey_id: 1,
        label: 'Name',
        field_type: 'text',
        is_required: true,
      };

      mockReq.params.id = '1';
      mockReq.body = {
        label: 'Name',
        field_type: 'text',
        is_required: true,
      };
      prisma.survey_fields.create.mockResolvedValue(mockField);

      await addFieldToSurvey(mockReq, mockRes);

      expect(prisma.survey_fields.create).toHaveBeenCalledWith({
        data: {
          survey_id: 1,
          label: 'Name',
          field_type: 'text',
          is_required: true,
        },
      });
      expect(prisma.field_options.createMany).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockField);
    });

    it('should add select field with options', async () => {
      const mockField = {
        id: 2,
        survey_id: 1,
        label: 'Color',
        field_type: 'select',
        is_required: false,
      };

      const options = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
      ];

      mockReq.params.id = '1';
      mockReq.body = {
        label: 'Color',
        field_type: 'select',
        is_required: false,
        options,
      };
      prisma.survey_fields.create.mockResolvedValue(mockField);
      prisma.field_options.createMany.mockResolvedValue({ count: 2 });

      await addFieldToSurvey(mockReq, mockRes);

      expect(prisma.survey_fields.create).toHaveBeenCalled();
      expect(prisma.field_options.createMany).toHaveBeenCalledWith({
        data: [
          { field_id: 2, label: 'Red', value: 'red' },
          { field_id: 2, label: 'Blue', value: 'blue' },
        ],
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should add radio field with options', async () => {
      const mockField = { id: 3, field_type: 'radio' };
      const options = [{ label: 'Yes', value: 'yes' }];

      mockReq.params.id = '1';
      mockReq.body = { label: 'Agree?', field_type: 'radio', options };
      prisma.survey_fields.create.mockResolvedValue(mockField);
      prisma.field_options.createMany.mockResolvedValue({ count: 1 });

      await addFieldToSurvey(mockReq, mockRes);

      expect(prisma.field_options.createMany).toHaveBeenCalled();
    });

    it('should add checkbox field with options', async () => {
      const mockField = { id: 4, field_type: 'checkbox' };
      const options = [{ label: 'Option 1', value: 'opt1' }];

      mockReq.params.id = '1';
      mockReq.body = { label: 'Choose', field_type: 'checkbox', options };
      prisma.survey_fields.create.mockResolvedValue(mockField);
      prisma.field_options.createMany.mockResolvedValue({ count: 1 });

      await addFieldToSurvey(mockReq, mockRes);

      expect(prisma.field_options.createMany).toHaveBeenCalled();
    });
  });

  describe('updateField', () => {
    it('should update field without options', async () => {
      mockReq.params.id = '1';
      mockReq.body = {
        label: 'Updated Label',
        is_required: true,
      };
      prisma.survey_fields.update.mockResolvedValue({});

      await updateField(mockReq, mockRes);

      expect(prisma.survey_fields.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { label: 'Updated Label', is_required: true },
      });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Field updated' });
    });

    it('should update field with new options', async () => {
      const options = [{ label: 'New Option', value: 'new' }];

      mockReq.params.id = '1';
      mockReq.body = {
        label: 'Updated',
        is_required: false,
        options,
      };
      prisma.survey_fields.update.mockResolvedValue({});
      prisma.field_options.deleteMany.mockResolvedValue({ count: 0 });
      prisma.field_options.createMany.mockResolvedValue({ count: 1 });

      await updateField(mockReq, mockRes);

      expect(prisma.field_options.deleteMany).toHaveBeenCalledWith({
        where: { field_id: 1 },
      });
      expect(prisma.field_options.createMany).toHaveBeenCalledWith({
        data: [{ field_id: 1, label: 'New Option', value: 'new' }],
      });
    });
  });

  describe('deleteField', () => {
    it('should delete field successfully', async () => {
      mockReq.params.id = '1';
      prisma.survey_fields.delete.mockResolvedValue({ id: 1 });

      await deleteField(mockReq, mockRes);

      expect(prisma.survey_fields.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Field deleted' });
    });
  });

  describe('getSubmissions', () => {
    it('should get submissions with pagination', async () => {
      const mockSubmissions = [
        {
          id: 1,
          survey_id: 1,
          users: { id: 1, name: 'John', email: 'john@example.com' },
          submission_answers: [],
        },
      ];

      mockReq.params.id = '1';
      mockReq.query = { page: '1', limit: '10' };
      prisma.submissions.findMany.mockResolvedValue(mockSubmissions);
      prisma.submissions.count.mockResolvedValue(1);

      await getSubmissions(mockReq, mockRes);

      expect(prisma.submissions.findMany).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSubmissions,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should handle errors gracefully', async () => {
      mockReq.params.id = '1';
      prisma.submissions.findMany.mockRejectedValue(new Error('Database error'));

      await getSubmissions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch submissions',
      });
    });
  });

  describe('updateSurvey', () => {
    it('should update survey successfully', async () => {
      const mockUpdatedSurvey = {
        id: 1,
        title: 'Updated Title',
        description: 'Updated description',
      };

      mockReq.params.id = '1';
      mockReq.body = {
        title: 'Updated Title',
        description: 'Updated description',
      };
      prisma.surveys.update.mockResolvedValue(mockUpdatedSurvey);

      await updateSurvey(mockReq, mockRes);

      expect(prisma.surveys.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Title',
          description: 'Updated description',
          updated_at: expect.any(Date),
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedSurvey);
    });

    it('should return 400 when title is missing', async () => {
      mockReq.params.id = '1';
      mockReq.body = { description: 'Only description' };

      await updateSurvey(mockReq, mockRes);

      expect(prisma.surveys.update).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Title is required' });
    });

    it('should handle update errors', async () => {
      mockReq.params.id = '1';
      mockReq.body = { title: 'Valid Title' };
      prisma.surveys.update.mockRejectedValue(new Error('Update failed'));

      await updateSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to update survey' });
    });
  });

  describe('reorderFields', () => {
    it('should reorder fields successfully', async () => {
      const fieldOrders = [
        { id: 1, order_index: 2 },
        { id: 2, order_index: 1 },
      ];

      mockReq.params.surveyId = '1';
      mockReq.body = { fieldOrders };
      prisma.survey_fields.update.mockResolvedValue({});

      await reorderFields(mockReq, mockRes);

      expect(prisma.survey_fields.update).toHaveBeenCalledTimes(2);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Fields reordered successfully',
      });
    });

    it('should return 400 when fieldOrders is empty', async () => {
      mockReq.params.surveyId = '1';
      mockReq.body = { fieldOrders: [] };

      await reorderFields(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Field orders array is required',
      });
    });

    it('should return 400 when fieldOrders is not an array', async () => {
      mockReq.params.surveyId = '1';
      mockReq.body = { fieldOrders: 'not an array' };

      await reorderFields(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle reorder errors', async () => {
      mockReq.params.surveyId = '1';
      mockReq.body = { fieldOrders: [{ id: 1, order_index: 1 }] };
      prisma.survey_fields.update.mockRejectedValue(new Error('Update failed'));

      await reorderFields(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to reorder fields' });
    });
  });
});
