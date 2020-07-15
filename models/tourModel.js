const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']
  },
  slug: {
    type: String
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    // required: [true, 'A tour must have a difficulty'],
    required: {
      value: true,
      message: 'A tour must have a difficulty'
    },
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is etiher:easy,medium or difficult'
    }
  },
  price: {
    type: Number,
    required: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A rating must be above 1'],
    max: [5, 'A rating must be below 5']
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: true,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// virtual properties will is not persisted in DB,
// here a new virtual property is created 
// which count the duration in weeks
// and send to the client every time we query  

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7
})


//NOTE:DOCUMENT Middleware only runs with .save() and .create() methods.

//👇this is a 'pre' save doc middleware which will run before saving the current data into the DB
// here we can access the current process data with 'this' keyword.
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next()
});

// tourSchema.pre('save', function (next) {
//   console.log('pre save hook ')
//   next();
// });


//👇 this is a 'post' save hook which will run,
// after all the 'pre' save hooks are finished
// here we don't have acces to 'this' keyword,
//we can access the processed data with doc keyword

// tourSchema.post('save', function (doc,next) {
//   console.log('post save hook')
// })


// 👇QUERY MiddleWare

tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } })

  next()
})

// tourSchema.pre('findOne', function (next) {
//   console.log('hiya');
//   next()
// })

//👇POST QUERY MIDDLEWARE 
// tourSchema.post(/^find/, function (docs) {
//   console.log(docs)
// })


//👇 AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  next()
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
