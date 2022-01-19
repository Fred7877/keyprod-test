import axios from 'axios';

export const fetchData = async function (route = null, param =null) {
    if (route === null)
        throw 'the route is mandatory';

    let url = '/' + route;
    if(param !== null)
        url += '?id='+param

    const response = await axios.get(url);
    return response.data;
}