const moment = require('moment')
const mongoose = require('mongoose')
const { chainSchema } = require('./chain')

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    chains: [chainSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toObject: { virtuals: true }
  }
)

// get index of longest chain for this task
taskSchema.virtual('longestChainIndex').get(function () {
  // stores the length of the biggest chain in the array
  const maxLength = Math.max.apply(null, this.chains.map(c => c.length))

  // returns the index of that length
  // or -1 if the chains array is empty
  // note: does not handle duplicate maxLengths
  return this.chains.findIndex(c => c.length === maxLength)
})

// get all days inwhich task was completed
taskSchema.virtual('combinedChainLength').get(function () {
  return this.chains.reduce((total, chain) => total + chain.length, 0)
})

// get date that task was first started
taskSchema.virtual('taskStarted').get(function () {
  return this.chains.length ? this.chains[0].dateStarted : false
})

// get whether or not a new chain can be made
taskSchema.virtual('createChainAvailable').get(function () {
  // index of the last chain
  const latestChainIdx = this.chains.length - 1

  // if the task has no chains or if the last chain is broken, can add chain
  return this.chains.length === 0 || this.chains[latestChainIdx].dateBroken
})

// get if last chain can be concated
taskSchema.virtual('concatAvailable').get(function () {
  // if the task has chains the concat is available
  if (this.chains.length > 0) {
    // index of the last chain
    const latestChainIdx = this.chains.length - 1

    // today and lastConcat with floored hours
    const today = moment().hours(0)
    const lastConcat = moment(this.chains[latestChainIdx].lastConcat).hours(0)

    // whether the latest chain is NOT broken AND it's been over 24hrs since the last concat
    return !this.chains[latestChainIdx].dateBroken && today.diff(lastConcat, 'days') === 1
  } else {
    // otherwise concat is NOT available
    return false
  }
})

// gets the countdown until the latest chain breaks (in hrs)
taskSchema.virtual('hoursToBreak').get(function () {
  // index of the last chain
  const latestChainIdx = this.chains.length - 1

  // if the task has chains AND the latest chain is not broken
  if (this.chains.length > 0 && !this.chains[latestChainIdx].dateBroken) {
    // return the time until it breaks
    return Math.ceil(48 - ((new Date() / 86400000) - (new Date(this.chains[latestChainIdx].lastConcat) / 86400000)) * 24)
  } else {
    // otherwise send false
    return false
  }
})

// gets the countdown until user can concat (in hrs)
taskSchema.virtual('hoursToConcat').get(function () {
  // index of the last chain
  const latestChainIdx = this.chains.length - 1

  // if the task has chains AND the latest chain is not broken
  if (this.chains.length > 0 && !this.chains[latestChainIdx].dateBroken) {
    // return the time until it user can concat
    return Math.ceil(24 - ((new Date() / 86400000) - (new Date(this.chains[latestChainIdx].lastConcat) / 86400000)) * 24)
  } else {
    // otherwise send false
    return false
  }
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
