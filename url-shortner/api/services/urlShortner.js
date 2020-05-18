var TinyURL = require('tinyurl');


const shorten = async (url) => {
    const shortenedUrl = await TinyURL.shorten(url).then(async function (res, err) {
        if (err)
            console.log(err);
        return res;
    });
    return shortenedUrl;
}

const unshorten = async (url) => {
    const unshortenedUrl = await TinyURL.resolve(url).then(
        function (res) {
            // console.log(res); //Returns http://google.com, the full URL located at http://tinyurl.com/2tx
            return res;
        },
        function (err) {
            console.log(err);
        }
    );
    return unshortenedUrl;
}

module.exports = {
    shorten,
    unshorten
};

// awaitshorten('https://www.google.com').then(data => console.log(data));
// unshorten('http://tinyurl.com/bjnwp7u').then(data => console.log(data));

