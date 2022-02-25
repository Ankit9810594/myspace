import httpService from "./httpService.js";
//import config from "../config.json";


export function getMovies() {
    return httpService.get(`${'/api'}/movies`);
}

export function getMovie(id) {
    return httpService.get(`${'/api'}/movies/${id}`);
}

export function saveMovie(data) {
    return httpService.post(`${'/api'}/movies`, data)
    //.then( () => console.log('success'))
    //.catch( e => console.log(e));
}

export function updateMovie(data, id) {
    return httpService.put(`${'/api'}/movies/${id}`, data);
}

export function deleteMovie(id) {
    return httpService.delete(`${'/api'}/movies/${id}`);
}