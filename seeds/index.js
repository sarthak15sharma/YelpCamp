const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const axios = require('axios');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Database Connected")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const getImg = async() => {
    return await axios.get('https://api.unsplash.com/collections/483251/photos?client_id=59TMTvJgfpaEO41-Q9jV8PSWySZyYgesgG-9CAPMPXs&per_page=50');
};


const seedDB = async () => {
    await campground.deleteMany({});
    const image = await getImg();
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '637e6433f5fb850e1d30eec7',
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo possimus eum, numquam culpa, dolores corrupti quasi quibusdam architecto explicabo voluptatibus blanditiis, quidem veniam. Blanditiis labore vitae fugiat saepe ut iusto.'
        })
        camp.images.push({
            url: image.data[i].urls.full
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.disconnect();
});