import mongoose, { Document, Model } from "mongoose";

/**
 * An interface that describe data types stored by a coordinate
 */
interface Coordinate {
    latitude: Number;
    longitude: Number;
    altitude: Number;
    accuracy: Number;
    heading: Number;
    speed: Number;
}

/**
 * An interface that describe the data type stored in a Point object
 */
interface Point {
    timestamp: number;
    coords: Coordinate;
}

/**
 * An interface that describe the attributes required to create a Track
 */
interface TrackAttributes {
    userId: string;
    met: number;
    timeRecorded: number;
    name: string;
    locations: Point[];
}

/**
 * An interface that describe the data type and structure that will be stored in MongoDB database
 */
interface TrackDocument extends Document {
    userId: string;
    met: number;
    timeRecorded: number;
    name: string;
    locations: Point[];
    dateCreated: string;
    dateUpdated: string;
}

/**
 * An interface that describe to build track based on TrackAttributes
 * and store it as TrackDocument in MongoDB
 */
interface TrackModel extends Model<TrackDocument> {
    build(attributes: TrackAttributes): TrackDocument;
}

const pointSchema = new mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number,
    },
});

const trackSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        met: { type: Number, required: true },
        timeRecorded: { type: Number, required: true },
        name: {
            type: String,
            default: "",
        },
        locations: [pointSchema],
        dateCreated: { type: Date, default: Date.now },
        dateUpdated: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret._v;
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

trackSchema.statics.build = (attributes: TrackAttributes) => {
    return new Track(attributes);
};

const Track = mongoose.model<TrackDocument, TrackModel>("Track", trackSchema);
export { Track };
