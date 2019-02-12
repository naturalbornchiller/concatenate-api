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
taskSchema.virtual('longestChain').get(function () {
  // stores the length of the biggest chain in the array
  const maxLength = Math.max.apply(null, this.chains.map(c => c.length))

  // store the index of that length
  // or -1 if the chains array is empty
  // note: does not handle duplicate maxLengths
  const chainIdx = this.chains.findIndex(c => c.length === maxLength)

  // if the task has no chains return false
  if (chainIdx === -1) return false

  // store start/end of longest chain
  const start = moment(this.chains[chainIdx].dateStarted)
  const end = moment(this.chains[chainIdx].dateBroken || this.chains[chainIdx].lastConcat)

  // return formatted string
  return start.format('MM/DD/YY') + ' - ' + end.format('MM/DD/YY')
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
  // if the task has chains and the last chain isn't broken
  if (this.chains.length > 0 && !this.createChainAvailable) {
    // index of the last chain
    const latestChainIdx = this.chains.length - 1

    // today and lastConcat with floored hours
    const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    const lastConcat = moment(this.chains[latestChainIdx].lastConcat).hours(0).minutes(0).seconds(0).milliseconds(0)

    // return boolean: has it's been 1day since lastConcat?
    return today.diff(lastConcat, 'days') === 1
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
  if (this.chains.length > 0 && !this.createChainAvailable) {
    // last concatenation
    const lastConcat = moment(this.chains[latestChainIdx].lastConcat)
    // 2 days after last concatenation
    const lastConcatPlusTwoDays = lastConcat.add(2, 'days').hours(0).minutes(0).seconds(0).milliseconds(0)
    // today
    const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    
    // difference, in hours, between today
    // and 2 days from last concatenation
    return lastConcatPlusTwoDays.diff(today, 'hours')
  } else {
    // otherwise send false
    return false
  }
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
