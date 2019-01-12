// pull in Mongoose model for tasks
import Task from '../models/task'

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
https://stormpath.com/blog/how-to-write-middleware-for-express-apps
https://expressjs.com/en/guide/using-middleware.html
const breakAllChains = (req, res, next) => {
  Task.find({ owner: req.user.id })
    .then(tasks => {
      tasks.forEach(task => task.breakChain())
    })
    .then(next)
}

const thisThing = () => {
  Task.find({ owner: })
    .then(tasks => {
       tasks.forEach(task => task.breakChain())
    })
}

// INDEX
// GET /tasks
router.get('/tasks', requireToken, breakAllChains, (req, res) => {
  Task.find()
    .then(tasks => {
      // `tasks` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return tasks.map(task => task.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(tasks => res.status(200).json({ tasks }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /tasks/5a7db6c74d55bc51bdf39793
router.get('/tasks/:id', requireToken, breakAllChains, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Task.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(task => res.status(200).json({ task: task.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /tasks
router.post('/tasks', requireToken, breakAllChains, (req, res) => {
  // set owner of new task to be current user
  req.body.task.owner = req.user.id

  Task.create(req.body.task)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(task => res.status(201).json({ task: task.toObject() }))
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /tasks/5a7db6c74d55bc51bdf39793

// data: {
//   task { 
//     id: <task id>
//   }
// }
router.patch('/tasks/:id', requireToken, breakAllChains, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.task.owner

  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, task)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.task).forEach(key => {
        if (req.body.task[key] === '') {
          delete req.body.task[key]
        }
      })

      // for this task, find either only chain where dayBroken is null, or sort
      // chain and find last, which also should have unset dayBroken
      const latestChainIndex = this.chains.length - 1

      // make a copy of task and mutate the chain at latestChainIndex to have
      // the date and time right now
      const now = new Date()
      const updatedTask = { ...task }
      updatedTask.chains[latestChainIndex].lastConcat = now

      // pass the result of Mongoose's `.update` to the next `.then`
      return task.update(updatedTask)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /task/5a7db6c74d55bc51bdf39793
router.delete('/tasks/:id', requireToken, breakAllChains, (req, res) => {
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
