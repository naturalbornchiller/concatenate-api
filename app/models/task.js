import { Schema, model } from 'mongoose'

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  chains: {
    type: Array,
    default: [],
    require: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

taskSchema.set('toObject', {virtuals: true})

taskSchema.virtual('chainLength').get(function () {
  return this.chains[this.chains.length - 1]
})

taskSchema.virtual('longestChain').get(function () {
  return Math.max.apply(this.chains, this.map(chain => chain.length))
})

taskSchema.virtual('totalDays').get(function () {
  return this.chains[this.chains.length - 1].length
})

// lat = north south
// long = east west
placeSchema.virtual('isWesternHemisphere?').get(function () {
  if (this.longitude.includes('W')) {
    return true
  } else {
    return false
  }
})

const Place = model('Place', placeSchema)


// time stamp not needed - just need to look at day_started of first chain

// chains concept:
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
