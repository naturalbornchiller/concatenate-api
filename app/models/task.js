const mongoose = require('mongoose')

const chainSchema = new mongoose.Schema({
  dayStarted: {
    type: Date,
    default: new Date()
  },
  dayBroken: {
    type: Date,
    default: () => null
  },
  lastConcat: {
    type: Date,
    default: () => null
  }
})

chainSchema.virtual('breakChain').set(function () {
  // if chain is NOT broken - and the difference
  // between now and the latestConcat > than 1 day
  // note: one day is 1000ms * 60 * 60 * 24
  if (!this.dayBroken &&
     (new Date() - this.lastConcat) > 86400000) {
    // chain is broken on todays date
    this.dayBroken = new Date()
    return true
  } else {
    return false
  }
})

chainSchema.virtual('updateConcat').set(function () {
  // if chain is NOT broken - and the difference
  // between now and the latestConcat > than 1 day
  // note: one day is 1000ms * 60 * 60 * 24
  if (!this.dayBroken) {
    // chain is broken on todays date
    this.lastConcat = new Date()
    return true
  } else {
    return false
  }
})

const taskSchema = new mongoose.Schema({
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
})

// chainSchema.virtual('chainLength').get(function () {
//   // if dayBroken is TRUE return dayBroken minus dayStarted,
//   // else return Today's date minus dayStarted
//   // note: 86400000 = one day in milliseconds
//   return ((this.dayBroken || new Date()) - this.dayStarted) / 86400000
// })

// taskSchema.virtual('longestChain').get(function () {
//   // returns longest chain for this task
//   return Math.max.apply(null, this.chains.map(chain => chain.chainLength))
// })

// taskSchema.virtual('totalDays').get(function () {
//   // returns all days inwhich task was completed
//   return this.chains.reduce((totalDays, currChain) => totalDays + currChain.chainLength, 0)
// })

// taskSchema.virtual('taskStarted').get(function () {
//   // returns date that task was first started
//   return this.chains[0].dayStarted
// })

/*
chains: [
  {
    day_started: <day>,
    day_broken: <day e.g., 2019-10-10>,
    last_concat: <day e.g., 2019-10-10>
  },
  {
    day_started: <day>,
    day_broken: null,
    last_concat: <today>
  }
]
*/

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
