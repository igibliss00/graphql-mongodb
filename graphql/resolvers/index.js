const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcryptjs');

const user = userId => {
    User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)        
            };
        })
        .catch(err => {
            throw err;
        });
};

const events = eventIds => {
    return Event.find({_id: { $in: eventIds }})
        .then(events => {
            events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    creator: user.bind(this, event.creator)
                };
            });
        })
        .catch(err => {
            throw err;
        });
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: () => {
      return Event.find()
          .then(events => {
              return events.map(event => {
                  return { 
                      ...event._doc, 
                      _id: event.id, 
                      creator: user.bind(this, event._doc.creator) 
                    };
              });
          })
          .catch(err => {
              console.log("Error occurred during Event.Find()", err);
              throw err;
          });
    },
    createEvent: args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5cbf7d3e162c3609e0a7da2c'
      });
      let createdEvent;
      return event
        .save()
        .then(result => {
          createdEvent = { ...result._doc, _id: result._doc._id.toString() };
          return User.findById('5cbf7d3e162c3609e0a7da2c');
        })
        .then(user => {
          if (!user) {
            throw new Error('User not found.');
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(result => {
          return createdEvent;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    createUser: args => {
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error('User exists already.');
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save();
        })
        .then(result => {
          return { ...result._doc, password: null, _id: result.id };
        })
        .catch(err => {
          throw err;
        });
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: "5cbf7d3e162c3609e0a7da2c",
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({ id: args.bookingId });
            return event;
        } catch (err) {
            throw err
        }
    }
  }

 