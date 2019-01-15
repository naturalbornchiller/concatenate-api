// pull in Mongoose model for taskss
const mongoose = require('mongoose')

const { Task } = require('../models/task')
const { Chain } = require('../models/chain')
const User = require('../models/user')

// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// make this into a middleware such that it can be run after requireToken in
// each route on every request
// https://expressjs.com/en/guide/using-middleware.html
// const breakAllChains = (req, res, next) => {
//   Task.find({ owner: req.user.id })
//     .then(tasks => {
//       tasks.forEach(task => task[task.length - 1].breakChain())
//     })
//     .then(next)
// }
// router.use(breakAllChains)

// INDEX
// GET /tasks - now returns only users tasks
router.get('/tasks', requireToken, (req, res) => {
  Task.find()
    .then(tasks => {
      // filter only tasks owned by the user
      const myTasks = tasks.filter(task => req.user._id.equals(task.owner))

      // `tasks` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return myTasks.map(task => task.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(tasks => res.status(200).json({ tasks }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /tasks/5a7db6c74d55bc51bdf39793
router.get('/tasks/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Task.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(task => {
      if (req.user._id.equals(task.owner)) {
        return res.status(200).json({ task: task.toObject() })
      } else {
        return new Error('Task not owned by requesting user.')
      }
    })
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /tasks
// router.post('/tasks', requireToken, (req, res) => {
//   // set owner of new task to be current user
//   req.body.task.owner = req.user.id

//   // create a new task
//   Task.create(req.body.task)
//     .then(task => {
//       // make a new chain
//       const chain = new Chain() // ERROR IS HERE!!!!

//       // update the task with the new chain (IMPORTANT: you need to pass the {new: true})
//       // option for ths Promise to return the updated version of the task to the next
//       // step of the promise chain
//       return Task.findByIdAndUpdate(task._id, { $push: { chains: chain } }, { new: true })
//     })

//     // return the updated task data
//     .then(task => res.status(201).json({ task: task }))

//     // if an error occurs, pass it to the handler
//     .catch(err => handle(err, res))
// })

// CREATE
// POST /tasks
router.post('/tasks', requireToken, (req, res) => {
  Task.create(req.body.task)
    .then(task => Task.findByIdAndUpdate(task._id, { $push: { chains: new Chain() } }, { new: true }))
    .then(task => User.findByIdAndUpdate(req.user.id, { $push: { tasks: task } }, { new: true }))
    .then(user => res.status(201).json({ tasks: user.toObject().tasks }))
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /tasks/5a7db6c74d55bc51bdf39793

// data: {
//   task { 
//     id: <task id>
//   }
// }
router.patch('/tasks/:id', requireToken, (req, res) => {
  Chain.find({})
    .then(console.log)
  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, task)

      // for this task, find either only chain where dayBroken is null, or sort
      // chain and find last, which also should have unset dayBroken
      const latestChainIndex = task.chains.length - 1

      const chainId = task.chains[latestChainIndex].id

      // console.log(chainId)

      // Chain.findById(chainId).then((chain) => console.log('chain is ',chain)).catch(console.error)
      // console.log(chain.updateConcat)

      return chainId

      // // changes chain at latestChainIndex to have
      // // the date and time right now
      // task.chains[latestChainIndex].updateConcat()

      // // pass the result of Mongoose's `.update` to the next `.then`
      // return task.update(task)
    })
    .then(Chain.findById)
    .then(chain => {
      chain.updateConcat()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => {
      console.log('error')
      handle(err, res)
    })
})

// DESTROY
// DELETE /task/5a7db6c74d55bc51bdf39793
router.delete('/tasks/:id', requireToken, (req, res) => {
  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      // throw an error if current user doesn't own `task`
      requireOwnership(req, task)
      // delete the task ONLY IF the above didn't throw
      task.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
