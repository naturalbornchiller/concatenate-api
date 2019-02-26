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
  const chainStart = moment(this.dateStarted)
    .hours(0).minutes(0).seconds(0).milliseconds(0)
  const chainEnd = moment(this.dateBroken || this.lastConcat)
    .hours(0).minutes(0).seconds(0).milliseconds(0)

  // difference between date started and the last concat (in days)
  return chainEnd.diff(chainStart, 'days') + 1
})

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
