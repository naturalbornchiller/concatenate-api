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

// gets the length of the chain (in days)
chainSchema.virtual('length').get(function () {
  // time diff in ms between dateChainWasStarted
  // and dateOfLastConcat, divided by number of ms in a day,
  // and floored for convenience
  return Math.floor((this.lastConcat - this.dateStarted) / 86400000)
})

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
