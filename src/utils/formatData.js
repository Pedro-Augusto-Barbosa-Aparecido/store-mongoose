const formatData = {
    formatDate: (date, message) => {
        return `${message}${ date.getUTCDate() } / ${ date.getUTCMonth() + 1 } / ${ date.getUTCFullYear() }`

    },

}

module.exports = formatData;
