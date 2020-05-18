const { v4: uuidv4 } = require('uuid');

const homePage = (req, res) => {
    res.view('pages/homePage');
};

const getAllUrlsPage = (req, res) => {
    res.view('pages/allUrlsPage');
}


const fetchAllUrls = async (req, res) => {
    try {
        const urls = await Urls.find({ select: ['shortened_url', 'createdAt'] });

        await urls.forEach(async (item, index) => {

            const totalVisits = await Visits.find({ key: item.id });
            const count = totalVisits.length;
            item.count = count;


            const presetTimeStamp = new Date().getTime();
            const lastHourTimeStamp = presetTimeStamp - 3600000;

            const lastHourVisits = await Visits.find({ key: item.id, createdAt: { '>': lastHourTimeStamp } });
            const lastHourVisitsCount = lastHourVisits.length;

            item.lastHourCount = lastHourVisitsCount;


            if (index === urls.length - 1) {
                res.ok({
                    success: true,
                    message: 'Returning all the shortened URLs data',
                    data: urls
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.badRequest({
            success: false,
            message: "Urls could not be fetched",
            data: {},
            error_code: 404
        });
    }

};

const postCreateShortenedUrl = async (req, res) => {
    try {

        const actualUrl = req.body.actualUrl;

        if (!actualUrl) {
            res.badRequest({
                success: false,
                message: 'Input data is not set',
                error_code: 404
            });
        }

        const uid = uuidv4();

        const serverUrl = 'http://localhost:1337/url/' + uid;

        const shortenedUrl = await urlShortner.shorten(serverUrl);

        const dbObject = {
            uid: uid,
            shortened_url: shortenedUrl,
            actual_url: actualUrl,
        };

        Urls.create(dbObject)
            .fetch()
            .then(data => {
                if (data) {
                    res.ok({
                        success: true,
                        message: "Url successfully shortened",
                        data: data
                    });
                }
            })
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err);
        res.badRequest({
            success: false,
            message: "Url could not be shortened",
            data: {},
            error_code: 404
        });
    }
};

const getRedirection = async (req, res) => {
    try {
        const uid = req.params.id;

        Urls.findOne({ uid: uid })
            .then(data => {
                const id = data.id;
                Visits.create({ key: id })
                    .fetch()
                    .then(result => {
                        if (result) {
                            res.redirect(data.actual_url);
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err);
        res.badRequest({
            success: false,
            message: "Could not perform redirection",
            data: {},
            error_code: 404
        });
    }
};

module.exports = {
    homePage,
    getAllUrlsPage,
    fetchAllUrls,
    postCreateShortenedUrl,
    getRedirection
};