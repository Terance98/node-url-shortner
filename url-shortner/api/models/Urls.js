/**
 * Urls
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        uid : {
            type: 'string',
            required: true
        },
        shortened_url: {
            type: 'string',
            required: true
        },
        actual_url: {
            type: 'string',
            required: true
        },
        visits: {
            collection: 'visits',
            via: 'key'
        },
    }
}