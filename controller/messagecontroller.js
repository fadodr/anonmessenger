const mongoose = require('mongoose')
const User = require('../model/userschema')
const Message = require('../model/messageschema')


exports.send_message = async (req, res, next) => {
    const { question , meantFor } = req.body;

    try {
        const existingUser = await User.findOne({ _id: meantFor })
        if (!existingUser) {
            const error = new Error('Cannot create question for user that does exist');
            error.statuscode = 409;
            throw error
        }
        const newMessage = new Message({
            message : question,
            userId: meantFor,

        });
        const messageInfo = await newMessage.save()
        res.status(201).json({
            message: 'Successfully created new message',
            question : messageInfo
        })
    }
    catch (error) {
        if (!error.statuscode) {
            error.statuscode = 500
        }
        return next(error);
    }
}

exports.reply_message = async (req, res, next) => {
    const { answer, userId } = req.body;
    const messageId = req.params.id;

    try {
        const foundMessage = await Message.findOne({ _id: messageId, userId });
        if (!foundMessage) {
            const error = new Error('Message not found for this user')
            error.statuscode = 404;
            throw error;
        };

        const messageInfo = await Message.updateOne(
            { _id: messageId },
            { $set: { answered: true, reply: answer } }
        );
        res.status(200).json({
            message: 'Reply successfully sent',
            question : messageInfo
        })
    }
    catch (error) {
        if (!error.statuscode) {
            error.statuscode = 500
        };
        return next(error);
    }
}

exports.fetch_all_user_questions = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            const error = new Error('Cannot find user');
            error.statuscode = 409;
            throw error
        }
        const allQuestions = await Message.find({ userId });
        if (allQuestions.length == 0) {
            res.status(200).json({
                message : 'User does not have any question yet'
            })
        }
        else {
            res.status(200).json({
                message: 'All questions with the specified user fetched successfully',
                questions : allQuestions
            })
        }
    }
    catch (error) {
        if (!error.statuscode) {
            error.statuscode = 500
        };
        return next(error);
    }
}