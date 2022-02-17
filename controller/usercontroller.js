const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/userschema')
const Forgetpassword = require('../model/forgetpasswordschema')
const randomatic = require('randomatic')

exports.signup_user = async (req, res, next) => {
    const { name, email, username, password } = req.body;

    try {
        const hashPwd = await bcrypt.hash(password, 10);
        const createdUser = new User({
            name,
            email,
            username,
            password: hashPwd,
        });
        await createdUser.save();
        res.status(201).json({
            message: 'New user have been created',
            user: createdUser
        });
    }
    catch (error) {
        if(!error.statuscode){
            error.statuscode = 500
        }
        return next(error)
    }
}

exports.login_user = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            const error = new Error('Invalid login credentials');
            error.statuscode = 401;
            throw error;
        }

        const passwordIsCorrect = await bcrypt.compare(password, existingUser.password);
        if (!passwordIsCorrect) {
            const error = new Error('Invalid login credentials');
            error.statuscode = 401;
            throw error;
        }

        const token = await jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env['JWT_SECRETKEY'], { expiresIn: '1h' })
        res.status(200).json({
            message: "You are successfully logged in",
            tokendata: {
                token: token,
                expiresin: new Date(new Date().getTime() + 7200000).toISOString
            },
            user: existingUser
        });
    }
    catch (error) {
        if(!error.statuscode){
            error.statuscode = 500
        }
        return next(error)
    }
}

exports.forget_password = async (req, res, next) => {
    const email = req.body.email;

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            const error = new Error('User does not exist')
            error.statuscode = 404
            throw error
        }
        
        const randomNumber = randomatic('Aao', 15);
        const forgetpassword = new Forgetpassword({
            email,
            token : randomNumber,
        });
        await forgetpassword.save()
        res.status(200).json({
            message: 'You can now reset your password with token below',
            token : randomNumber
        });

    }
    catch (error) {
        if(!error.statuscode){
            error.statuscode = 500
        }
        return next(error)
    }
}

exports.reset_password = async (req, res, next) => {
    const { email, token, password } = req.body;

    try {
        const fetchedUser = await Forgetpassword.findOne({ token: token, email : email });
        if (!fetchedUser) {
            const error = new Error('Token with specified email does not exist');
            error.statuscode = 404;
            throw error;
        }

        const existingUser = await User.findOne({ email: fetchedUser.email })
        const hashPwd = await bcrypt.hash(password, 10);
        await User.updateOne(
            { _id: existingUser._id },
            { $set: { password: hashPwd } },
            
        );
        res.status(200).json({
            message: "Your password have been changed successfully"
        });
    }
    catch (error) {
        if(!error.statuscode){
            error.statuscode = 500
        }
        return next(error)
    }
}