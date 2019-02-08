const mongoose = require('mongoose')
const moment = require('moment')

const chainSchema = new mongoose.Schema(
  {
    dateStarted: {
      type: Date,
      default: () => new Date()
    },
    dateBroken: {
      type: Date,
      default: () => null
    },
    lastConcat: {
      type: Date,
      default: () => new Date()
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  },
  {
    toObject: { virtuals: true }
  }
)

// gets the length of the chain (in days)
chainSchema.virtual('length').get(function () {
  // today and last concat floored
  const chainStart = moment(this.dateStarted).hours(0)
  const chainEnd = moment(this.lastConcat).hours(0)

  // difference between today and the last concat (in days)
  return chainStart.diff(chainEnd, 'days')
})

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
