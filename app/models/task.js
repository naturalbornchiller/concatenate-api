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

// taskSchema.virtual('chainLength').get(function () {
//   // stores most recent chain
//   const latestChain = this.chains[this.chains.length - 1]

//   // if dayBroken is TRUE return dayBroken minus dayStarted,
//   // else return Today's date minus dayStarted
//   // note: 86400000 = one day in milliseconds
//   return ((latestChain.dayBroken || new Date()) - latestChain.dayStarted) / 86400000
// })

// taskSchema.virtual('longestChain').get(function () {
//   // returns longest chain for this task
//   return Math.max.apply(null, this.tasks.map(chain => chain.chainLength))
// })

// taskSchema.virtual('totalDays').get(function () {
//   // returns all days inwhich task was completed
//   return this.chains.reduce((totalDays, currChain) => totalDays + currChain.chainLength, 0)
// })

taskSchema.virtual('taskStarted').get(function () {
  // returns date that task was first started
  return this.chains[0].dayStarted
})

taskSchema.virtual('breakChain').set(function () {
  // stores the most recent chain
  const latestChain = this.chains[this.chains.length - 1]

  // if chain is NOT broken - and the difference
  // between now and the latestConcat > than 1 day
  // note: one day is 1000ms * 60 * 60 * 24
  if (!latestChain.dayBroken &&
     (new Date() - latestChain.lastConcat) > 86400000) {

    // chain is broken on todays date
    latestChain.dayBroken = new Date()

    // and a new chain is started
    this.chains.push({
      dayStarted: new Date(),
      lastConcat: this.dayStarted
    })
  }
})

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
