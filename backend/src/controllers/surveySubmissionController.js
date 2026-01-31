const prisma = require('../config/db');

// GET /surveys
const getOfficerSurveys = async (req, res) => {
    console.log("Fetching surveys for officer:");
  try {
    const surveys = await prisma.surveys.findMany({
      include: {
        survey_fields: {
          include: { field_options: true }
        }
      }
    });
    console.log(surveys);
    res.json({ success: true, data: surveys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch surveys" });
  }
};

// POST /surveys/:id/submit
const submitSurvey = async (req, res) => {
  const { id } = req.params; // survey ID
  const { answers } = req.body; // [{ field_id, value }]
  const userId = req.user.id;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: "Answers are required" });
  }

  try {
    // Validate required fields
    const fields = await prisma.survey_fields.findMany({
      where: { survey_id: parseInt(id) }
    });

    const missingRequired = fields
      .filter(f => f.is_required)
      .some(f => !answers.find(a => a.field_id === f.id));

    if (missingRequired) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    // Create submission
    const submission = await prisma.submissions.create({
      data: {
        survey_id: parseInt(id),
        user_id: userId,
        submission_answers: {
          create: answers.map(a => ({
            field_id: a.field_id,
            value: a.value
          }))
        }
      },
      include: { submission_answers: true }
    });

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Submission failed" });
  }
};

module.exports = { getOfficerSurveys, submitSurvey };
