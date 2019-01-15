const mongoose = require('mongoose')

const chainSchema = new mongoose.Schema(
  {
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
  }
)

// chainSchema.virtual("breakChain").set(function() {
//   // if chain is NOT broken - and the difference
//   // between now and the latestConcat > than 1 day
//   // note: one day is 1000ms * 60 * 60 * 24
//   if (!this.dayBroken && new Date() - this.lastConcat > 86400000) {
//     // chain is broken on todays date
//     this.dayBroken = new Date();
//     return true;
//   } else {
//     return false;
//   }
// });

// chainSchema.virtual("updateConcat").set(function() {
//   // if chain is NOT broken - and the difference
//   // between now and the latestConcat > than 1 day
//   // note: one day is 1000ms * 60 * 60 * 24
//   if (!this.dayBroken) {
//     // chain is broken on todays date
//     this.lastConcat = new Date();
//     return true;
//   } else {
//     return false;
//   }
// });

const Chain = mongoose.model('Chain', chainSchema)
module.exports = { Chain, chainSchema }
