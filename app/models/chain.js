const mongoose = require('mongoose')

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

// get if chain can be concated
chainSchema.virtual('concatAvailable').get(function () {
  return !this.dateBroken && (new Date() - this.lastConcat > 86400000)
})

// gets the length of the chain (in days)
chainSchema.virtual('length').get(function () {
  // time difference in ms between dateChainWasStarted
  // and dateOfLastConcat, divided by number of ms in a day,
  // and floored for convenience
  return Math.floor((this.lastConcat - this.dateStarted) / 86400000)
})

// gets the countdown until the chain breaks (in hrs)
chainSchema.virtual('hoursToBreak').get(function () {
  const { lastConcat, dateBroken } = this
  if (!dateBroken) {
    return Math.ceil(48 - ((new Date() / 86400000) - (new Date(lastConcat) / 86400000)) * 24)
  } else {
    return false
  }
})

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
