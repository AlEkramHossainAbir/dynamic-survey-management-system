const prisma = require('../config/db');

const showAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.users.findMany({});
        res.status(200).json(allUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { showAllUsers };