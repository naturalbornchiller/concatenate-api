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
  const today = moment().hours(0)
  const lastConcat = moment(this.lastConcat).hours(0)

  // difference between today and the last concat (in days)
  return today.diff(lastConcat, 'days')
})

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
