const prisma = require('../config/db');

const createSurvey = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // from JWT middleware

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const survey = await prisma.surveys.create({
    data: {
      title,
      description,
      created_by: userId,
    },
  });

  res.status(201).json(survey);
};

const getSurveys = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.surveys.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.surveys.count(),
  ]);

  res.json({
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getSurveyById = async (req, res) => {
  const surveyId = Number(req.params.id);

  const survey = await prisma.surveys.findUnique({
    where: { id: surveyId },
    include: {
      survey_fields: {
        orderBy: { order_index: "asc" },
        include: { field_options: true },
      },
    },
  });

  if (!survey) {
    return res.status(404).json({ message: "Survey not found" });
  }

  res.json(survey);
};

const deleteSurvey = async (req, res) => {
  const surveyId = Number(req.params.id);

  await prisma.surveys.delete({
    where: { id: surveyId },
  });

  res.json({ message: "Survey deleted" });
};

const addFieldToSurvey = async (req, res) => {
  const surveyId = Number(req.params.id);
  const { label, field_type, is_required, options } = req.body;

  const field = await prisma.survey_fields.create({
    data: {
      survey_id: surveyId,
      label,
      field_type,
      is_required,
    },
  });

  // Handle options
  if (["checkbox", "radio", "select"].includes(field_type)) {
    const optionData = options.map(opt => ({
      field_id: field.id,
      label: opt.label,
      value: opt.value,
    }));

    await prisma.field_options.createMany({
      data: optionData,
    });
  }

  res.status(201).json(field);
};

const updateField = async (req, res) => {
  const fieldId = Number(req.params.id);
  const { label, is_required, options } = req.body;

  await prisma.survey_fields.update({
    where: { id: fieldId },
    data: { label, is_required },
  });

  if (options) {
    await prisma.field_options.deleteMany({
      where: { field_id: fieldId },
    });

    await prisma.field_options.createMany({
      data: options.map(o => ({
        field_id: fieldId,
        label: o.label,
        value: o.value,
      })),
    });
  }

  res.json({ message: "Field updated" });
};


const deleteField = async (req, res) => {
  const fieldId = Number(req.params.id);

  await prisma.survey_fields.delete({
    where: { id: fieldId },
  });

  res.json({ message: "Field deleted" });
};

// GET /surveys/:id/submissions - Get all submissions for a survey
const getSubmissions = async (req, res) => {
  const surveyId = Number(req.params.id);

  try {
    const submissions = await prisma.submissions.findMany({
      where: { survey_id: surveyId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        submission_answers: {
          include: {
            survey_fields: {
              select: {
                id: true,
                label: true,
                field_type: true,
              },
            },
          },
        },
      },
      orderBy: { submitted_at: "desc" },
    });

    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
};

// PUT /surveys/:id - Update survey
const updateSurvey = async (req, res) => {
  const surveyId = Number(req.params.id);
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const survey = await prisma.surveys.update({
      where: { id: surveyId },
      data: {
        title,
        description,
        updated_at: new Date(),
      },
    });

    res.json(survey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update survey" });
  }
};


module.exports = {
  createSurvey,
  getSurveys,
  getSurveyById,
  deleteSurvey,
  addFieldToSurvey,
  updateField,
  deleteField,
  getSubmissions,
  updateSurvey,
};