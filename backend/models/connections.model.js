import monogoose from 'mongoose';

const ConnectionRequest = new monogoose.Schema({
    userId: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    connectionId: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type : Boolean,
        default: null, //pending: null, accepted: true, rejected: false
    },
});

const Connection = monogoose.model('Connection', ConnectionRequest);

export default Connection;