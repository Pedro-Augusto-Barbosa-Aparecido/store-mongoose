const listFunctions = {
    paginate: (data, start, limit) => {
        if ((parseInt(start) + parseInt(limit) > parseInt(data.length))) {
            let vet = [];

            for (let index = parseInt(start); index < data.length; index++) {
                vet.push(data[index]);

            }

            data = vet;

        } else {
            data = data.slice(parseInt(start), (parseInt(start) + parseInt(limit)));

        }

        return data;

    },

    filter: (filters, data) => {
        const keys = Object.keys(filters);
        let __data = [];

        keys.forEach((key, index) => {
            data.forEach((item, _index) => {
                if (filters[key].includes)
                    if (item[key].toString().includes(filters[key].value))
                        __data.push(item);

                else
                    if (item[key] === filters[key].value)
                        __data.push(item);

            });

        });

        return __data;

    }

}

module.exports = listFunctions;
