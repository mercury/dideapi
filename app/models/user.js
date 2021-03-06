var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// set up a mongoose model
var UserSchema = new Schema({
  	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
  	password: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	online: {
		type: Number
	},
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	}
});

UserSchema.pre('save', function (next) {

	var _self = this;

	if (this.isModified('password') || this.isNew) {

		bcrypt.genSalt(10, function (err, salt) {

			if (err) {
				return next(err);
			}

			bcrypt.hash(_self.password, salt, function (err, hash) {

				if(err)
					return next(err);

				_self.password = hash;
				next();

			});
		});

	} else {
		return next();
	}

});

UserSchema.methods.comparePassword = function (password, cb) {

	bcrypt.compare(password, this.password, function (err, isMatch) {

		if (err)
			return cb(err);

		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);