import { Schema, model } from 'mongoose'

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  chains: [{
    dayStarted: {
      type: Date,
      default: new Date(),
      required: true
    },
    dayBroken: {
      type: Date,
      default: () => null
    },
    latestConcat: {
      type: Date,
      required: true
    }
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  toObject: { virtuals: true }
})

taskSchema.virtual('chainLength').get(function () {
  // stores most recent chain
  const latestChain = this.chains[this.chains.length - 1]

  // if dayBroken is TRUE return dayBroken minus dayStarted,
  // else return Today's date minus dayStarted
  return (latestChain.dayBroken || Date.now) - latestChain.dayStarted
})

taskSchema.virtual('longestChain').get(function () {
  // returns longest chain for this task
  return Math.max.apply(this.chains, this.map(chain => chain.chainLength))
})

taskSchema.virtual('totalDays').get(function () {
  // returns all days inwhich task was completed
  return this.chains.reduce((totalDays, currChain) => totalDays + currChain.chainLength, 0)
})

taskSchema.virtual('taskStarted').get(function () {
  // returns date that task was first started
  return this.chains[0].dayStarted
})

taskSchema.virtual('breakChain').set(function () {
  // stores the most recent chain
  const latestChain = this.chains[this.chains.length - 1]

  // if chain is NOT broken - and the difference
  // between now and the latestConcat > than 1 day
  if (!latestChain.dayBroken &&
     (new Date() - latestChain.latestConcat) > 24) {

    // chain is broken on todays date
    latestChain.dayBroken = new Date()

    // and a new chain is started
    this.chains.push({
      dayStarted: new Date(),
      dayBroken: null,
      latestConcat: this.dayStarted
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

const Task = model('Task', taskSchema)

export default Task
