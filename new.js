const { string } = require('joi');
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/animalShelter');
    console.log('Database connected');
}

main().catch(e => console.log(e));

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [{
        street: String,
        city: String,
        state: String,
        country: String
    }]
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    })

    u.addresses.push({
        street: '123 Sesame',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })

    const res = await u.save();
    console.log(res);
}

makeUser();


