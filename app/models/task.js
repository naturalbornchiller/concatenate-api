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

// returns index of longest chain for this task
taskSchema.virtual('longestChainIndex').get(function () {
  // stores the length of the biggest chain in the array
  const maxLength = Math.max.apply(null, this.chains.map(c => c.length))

  // returns the index of that length
  // note: does not handle duplicate maxLengths
  return this.chains.findIndex(c => c.length === maxLength)
})

// returns all days inwhich task was completed
taskSchema.virtual('combinedLength').get(function () {
  return this.chains.reduce((total, chain) => total + chain.length, 0)
})

// returns date that task was first started
taskSchema.virtual('taskStarted').get(function () {
  return this.chains[0].dateStarted
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
