var TinyURL = require('tinyurl');

const shorten = async (url) => {
    const shortenedUrl = await TinyURL.shorten(url).then(async function (res, err) {
        if (err)
            console.log(err);
        return res;
    });
    return shortenedUrl;
}

module.exports = { shorten };
