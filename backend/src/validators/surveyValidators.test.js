const {
  createSurveySchema,
  updateSurveySchema,
  addFieldSchema,
  updateFieldSchema,
  submitSurveySchema,
  loginSchema,
} = require('./surveyValidators');

describe('Survey Validators', () => {
  describe('createSurveySchema', () => {
    it('should validate correct survey data', () => {
      const validData = {
        title: 'Customer Feedback Survey',
        description: 'Please provide your feedback',
      };

      const result = createSurveySchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should validate survey without description', () => {
      const validData = {
        title: 'Simple Survey',
      };

      const result = createSurveySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Some description',
      };

      const result = createSurveySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Title is required');
    });

    it('should reject title longer than 200 characters', () => {
      const invalidData = {
        title: 'a'.repeat(201),
      };

      const result = createSurveySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('less than 200 characters');
    });

    it('should reject description longer than 1000 characters', () => {
      const invalidData = {
        title: 'Valid Title',
        description: 'a'.repeat(1001),
      };

      const result = createSurveySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('less than 1000 characters');
    });
  });

  describe('addFieldSchema', () => {
    it('should validate text field without options', () => {
      const validData = {
        label: 'Full Name',
        field_type: 'text',
        is_required: true,
      };

      const result = addFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should validate select field with options', () => {
      const validData = {
        label: 'Choose Color',
        field_type: 'select',
        is_required: false,
        options: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
        ],
      };

      const result = addFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should validate radio field with options', () => {
      const validData = {
        label: 'Gender',
        field_type: 'radio',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
      };

      const result = addFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should validate checkbox field with options', () => {
      const validData = {
        label: 'Interests',
        field_type: 'checkbox',
        options: [
          { label: 'Sports', value: 'sports' },
          { label: 'Music', value: 'music' },
        ],
      };

      const result = addFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject select field without options', () => {
      const invalidData = {
        label: 'Choose Option',
        field_type: 'select',
        options: [],
      };

      const result = addFieldSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Options are required');
    });

    it('should reject radio field without options', () => {
      const invalidData = {
        label: 'Choose One',
        field_type: 'radio',
      };

      const result = addFieldSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject invalid field type', () => {
      const invalidData = {
        label: 'Some Field',
        field_type: 'invalid_type',
      };

      const result = addFieldSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Invalid option');
    });

    it('should reject empty label', () => {
      const invalidData = {
        label: '',
        field_type: 'text',
      };

      const result = addFieldSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should set default is_required to false', () => {
      const validData = {
        label: 'Optional Field',
        field_type: 'textarea',
      };

      const result = addFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
      expect(result.data.is_required).toBe(false);
    });
  });

  describe('submitSurveySchema', () => {
    it('should validate submission with answers', () => {
      const validData = {
        answers: [
          { field_id: 1, value: 'John Doe' },
          { field_id: 2, value: 'john@example.com' },
        ],
      };

      const result = submitSurveySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject submission without answers', () => {
      const invalidData = {
        answers: [],
      };

      const result = submitSurveySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('At least one answer');
    });

    it('should reject invalid field_id', () => {
      const invalidData = {
        answers: [
          { field_id: -1, value: 'Some value' },
        ],
      };

      const result = submitSurveySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should accept empty string as value', () => {
      const validData = {
        answers: [
          { field_id: 1, value: '' },
        ],
      };

      const result = submitSurveySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login credentials', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Invalid email');
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '1234',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('at least 5 characters');
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'user@example.com',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('updateFieldSchema', () => {
    it('should validate field update', () => {
      const validData = {
        label: 'Updated Label',
        is_required: true,
      };

      const result = updateFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should validate with options', () => {
      const validData = {
        label: 'Updated Select',
        options: [
          { label: 'Option 1', value: 'opt1' },
        ],
      };

      const result = updateFieldSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject empty label', () => {
      const invalidData = {
        label: '',
      };

      const result = updateFieldSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});
