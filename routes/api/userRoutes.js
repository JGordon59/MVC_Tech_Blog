const router = require('express').Router();
const { 
  getUsers, 
  getUser, 
  createUser, 
  deleteUser, 
  updateUser, 
  addFriend, 
  deleteFriend 
} = require('../../controllers/userController');

// /api/users
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;