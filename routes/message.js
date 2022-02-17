const express = require('express');
const router = express.Router();
const messagecontroller = require('../controller/messagecontroller');
const isauth = require('../middleware/isauth')


router.post('/askquestion', isauth, messagecontroller.send_message);
router.post('/replyquestion/:id', isauth, messagecontroller.reply_message);
router.get('/questions/:userId', messagecontroller.fetch_all_user_questions)


module.exports = router;