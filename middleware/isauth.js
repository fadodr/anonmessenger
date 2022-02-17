const jwt = require('jsonwebtoken')

const isAuth = async (req, res, next) => {
    const tokenHeader = req.get('Authorization');

    try {
        if (!tokenHeader) {
            const error = new Error('Token is missing')
            error.statuscode = 400;
            throw error;
        }
        const token = tokenHeader.split(' ')[1];
        const isCorrect = jwt.verify(token, process.env['JWT_SECRETKEY']);
        if (!isCorrect) {
            const error = new Error('You are not logged in');
            error.statuscode = 401;
            throw error;
        }
        next()
    }
    catch (error) {
        if (!error.statuscode) {
            error.statuscode = 500;
        }
        return next(error);
    }
}

module.exports = isAuth