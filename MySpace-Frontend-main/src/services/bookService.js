import httpService from "./httpService.js";
//import config from "../config.json";


export function getBooks() {
    return httpService.get(`${'/api'}/books`);
}

export function getBook(id) {
    return httpService.get(`${'/api'}/books/${id}`);
}

export function saveBook(data) {
    return httpService.post(`${'/api'}/books`, data)
    //.then( () => console.log('success'))
    //.catch( e => console.log(e));
}

export function updateBook(data, id) {
    return httpService.put(`${'/api'}/books/${id}`, data);
}

export function deleteBook(id) {
    return httpService.delete(`${'/api'}/books/${id}`);
}