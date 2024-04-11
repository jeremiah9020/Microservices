import http from 'k6/http';


let access_token;
export function post(port, path, body) {
    const params = { headers: { 'Content-Type': 'application/json' } }    

    if (access_token) {
        params.headers['Authorization'] = access_token
    }

    const response = http.post(`http://localhost:${port}/${path}`, JSON.stringify(body), params);

    const setCookie = response.headers['Set-Cookie'];
    if (setCookie) {
        const [name,token] = setCookie.split('=');

        if (name == 'ACCESSTOKEN') {
            access_token = token.split(';')[0];
        }
    }

    return response;
}

export function patch(port, path, body) {
    const params = { headers: { 'Content-Type': 'application/json' } }      

    if (access_token) {
        params.headers['Authorization'] = access_token
    }

    return http.patch(`http://localhost:${port}/${path}`, JSON.stringify(body), params);
}

export function get(port, path) {
    const params = { headers: { } }    

    if (access_token) {
        params.headers['Authorization'] = access_token
    }

    return http.get(`http://localhost:${port}/${path}`, params);;
}