/* eslint-disable padded-blocks */
// pull in Mongoose model for taskss
const mongoose = require('mongoose')

const Task = require('../models/task')
const { Chain } = require('../models/chain')
const User = require('../models/user')
const moment = require('moment')

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

//TODO convert to momentJS logic 

// this middleware breaks chains that haven't been updated
const breakOldChains = (req, res, next) => {

  // find all tasks
  Task.find({ owner: req.user._id })
    // convert to a stream-compatible interface
    .cursor()
    // loop through each task in the stream
    .eachAsync(task => {
      // if task has chains
      if (task.chains.length > 0) {

        // index of last chain in task.chains
        const latestChainIdx = task.chains.length - 1

        // today and last concatenation, floored
        const today = moment().hours(0)
        const lastConcat = moment(task.chains[latestChainIdx].lastConcat).hours(0)

        // if they haven't concatenated in over 2 days
        if (today.diff(lastConcat, 'days') > 2) {
          // get the day after last concat
          const newDay = task.chains[latestChainIdx].lastConcat
          newDay.setDate(task.chains[latestChainIdx].lastConcat.getDate() + 1)

          // break the chain
          task.chains[latestChainIdx].dateBroken = newDay

          // save the modified task
          return task.save()
        }
      }
    })
    .then(() => console.log('Broke old chains.'))
    .then(() => next())
    .catch(err => handle(err, res))
}

router.use(requireToken, breakOldChains)

// INDEX
// GET /tasks - now returns only users tasks
router.get('/tasks', (req, res) => {
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
router.get('/tasks/:id', (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Task.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(task => {
      requireOwnership(req, task)
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
router.post('/tasks', (req, res) => {
  // set owner of new task to be current user
  req.body.task.owner = req.user.id

  // create a new task
  Task.create(req.body.task)
    // return the updated task data
    .then(task => res.status(201).json({ task: task }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /tasks/5a7db6c74d55bc51bdf39793
router.patch('/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then(handle404)
    .then(task => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, task)

      // index of latest chain
      let latestChainIdx = task.chains.length - 1

      // if there are no chains OR chain is broken,
      if (task.createChainAvailable) {

        // create a new chain and push it to the array
        task.chains = task.chains.concat([new Chain()])
        return task.save()

      // if it's been over 24 hrs
      // since the last concat,
      } else if (task.concatAvailable) {
        // add a link to the chain
        task.chains[latestChainIdx].lastConcat = new Date()
        return task.save()

      // otherwise,
      } else {
        // throw meaningful error
        return new Error('A full day must pass before next concat!')
      }
    })
    // if that succeeded, return 204 and no JSON
    .then(msg => {
      console.log(msg)
      res.sendStatus(204)
    })
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /task/5a7db6c74d55bc51bdf39793
router.delete('/tasks/:id', (req, res) => {
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
