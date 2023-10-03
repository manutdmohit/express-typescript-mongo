import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  title: string | null;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  password: string | undefined;
  isAdmin: 'yes' | 'no';
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  phone: string | undefined;
  gender: string | undefined;
  nationality: string | undefined;
  favourites: mongoose.Types.ObjectId[];
  recentStays: mongoose.Types.ObjectId[];
  fax: string | null;
  postalCode: string | null;
  passport: string | null;
  website: string | null;
  image: string | null;
  email: string;
  verificationToken: string | undefined;
  verified: boolean;
  verifiedDate: Date | undefined;
  status: 'yes' | 'no' | ' ';
  dob: string | null;
  address: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  centralName: string | undefined;
  role: 'super admin' | 'admin' | 'customer' | 'guest' | 'partner';
  provider: string | undefined;
  assignStays: mongoose.Types.ObjectId[];
  permissions: string[];
  commission: number | null;
  appliedFor: {
    appliedFor: string | null;
    name: string | null;
  };
  facebook_id: string | undefined;
  last_login: Date | undefined;
  customerCreatedBy: mongoose.Types.ObjectId | null;
  guestCreatedBy: mongoose.Types.ObjectId | null;
  partnerCreatedBy: mongoose.Types.ObjectId | null;
  passwordToken: string | undefined;
  passwordTokenExpirationDate: Date | undefined;

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    title: {
      type: String,
      default: null,
    },
    fullName: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    displayName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    password: {
      type: String,
      // minlength: 6,
    },
    isAdmin: {
      type: String,
      enum: {
        values: ['yes', 'no'],
        message: '{VALUE} is not supported',
      },
      default: 'no',
    },
    guestFullName: {
      type: String,
      maxlength: 20,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
    },
    guestPhone: {
      type: String,
      minlength: 10,
    },
    phone: {
      type: String,
      // minlength: 10,
      // required: [true, 'Please provide phone number'],
    },
    gender: {
      type: String,
      // enum: ['male', 'female', 'other'],
    },
    nationality: String,
    favourites: {
      type: [mongoose.Types.ObjectId],
      ref: 'Stay',
    },
    recentStays: {
      type: [mongoose.Types.ObjectId],
      ref: 'Stay',
      default: [],
    },
    fax: {
      type: String,
      minlength: 10,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
    passport: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide email'],
      validate: {
        validator: (email: string) => {
          return validator.isEmail(email);
        },
        message: 'Please provide a valid email',
      },
    },
    verificationToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedDate: Date,

    status: {
      type: String,
      enum: {
        values: ['yes', 'no', ' '],
        message: '{VALUE} is not supported',
      },
    },
    dob: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    address1: {
      type: String,
      default: null,
    },
    address2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    centralName: {
      type: String,
    },
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      enum: {
        values: ['super admin', 'admin', 'customer', 'guest', 'partner'],
        message: '{VALUE} is not supported',
      },
    },
    provider: String,
    assignStays: {
      type: [mongoose.Types.ObjectId],
      ref: 'Stay',
    },
    permissions: {
      type: [String],
      enum: {
        values: [
          'addStay',
          'editStay',
          'deleteStay',
          'addRoom',
          'editRoom',
          'deleteRoom',
          'addBooking',
          'editBooking',
          'deleteBooking',
          'addLocation',
          'editLocation',
          'deleteLocation',
          'addTours',
          'editTours',
          'deleteTours',
          'addCars',
          'editCars',
          'deleteCars',
          'addRentals',
          'editRentals',
          'deleteRentals',
        ],
        message: '{VALUE} is not supported',
      },
    },
    commission: {
      type: Number,
      default: null,
    },
    appliedFor: {
      appliedFor: {
        type: String,
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
    },
    facebook_id: String,
    last_login: {
      type: Date,
    },
    customerCreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    guestCreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    partnerCreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Hashing Password
UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password!, salt);
  this.password = hashedPassword;
});

// Comparing Password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

// Reverse populate stays with virtuals
UserSchema.virtual('stays', {
  ref: 'Stay',
  localField: '_id',
  foreignField: 'createdBy',
  justOne: false,
});

// Reverse populate bookings with virtuals
UserSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'booking_user',
  justOne: false,
});

export default mongoose.model<UserDocument>('User', UserSchema);
