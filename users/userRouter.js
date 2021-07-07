const express = require('express');
const router = express.Router();

const userDataBase = require('./userDb');
const postDataBase = require('../posts/postDb');


//----------posting new user DONE -----------------------------------------
router.post('/', validateUser, (req, res) => {
  userDataBase.insert(req.body).then(data=>{
    res.status(201).json(data);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'cannot post user',
    });
  });
});

//---------posting new post to user DONE ----------------------------------
router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  const post = {user_id: id, ...req.body}
  postDataBase.insert(post).then(data=>{
    res.status(201).json(data);
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'unable to add post to user',
    })
  })
});

//-----------list all users DONE -------------------------------------------
router.get('/', (req, res) => {
  userDataBase.get(req.query).then(data=>{
    res.status(200).json(data);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'The users information could not be retrieved',
    })
  })
});

//-----------get user by id DONE------------------------------------------------
router.get('/:id',validateUserId, (req, res) => {
  const id = req.params.id;
  userDataBase.getById(id).then(data=>{
    res.status(200).json(data);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'Unable to fetch user data',
    })
  })
});

//-----------get all posts by userID DONE------------------------------------
router.get('/:id/posts',validateUserId, (req, res) => {
  const id = req.params.id;
  userDataBase.getUserPosts(id).then(data=>{
    res.status(200).json(data);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'unable to get posts by user',
    })
  })
});

//------------delete user DONE---------------------------------------------
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  userDataBase.remove(id).then(removed=>{
    res.status(200).json(removed);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'cannot remove user',
    })
  })
});

//--------------change user name DONE--------------------------------------
router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  userDataBase.update(id, req.body).then(data=>{
    res.status(200).json(data);
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
      error: 'unable to change user',
    })
  })
});

//custom middleware

function validateUserId(req,res,next) {
  const id = req.params.id;
  userDataBase.getById(id).then(data=>{
    if(!data){
      res.status(400).json({
        message: 'invalid user id',
      })
    } else {
      next();
    }
  })
}

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({
      message: 'missing user data',
    })
  } else if (!req.body.name) {
    res.status(400).json({
      message: 'missing required name field',
    })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({
      message: 'missing post data',
    })
  } else if (!req.body.text){
    res.status(400).json({
      message: 'missing required text field',
    })
  } else {
    next();
  }
}

module.exports = router;
