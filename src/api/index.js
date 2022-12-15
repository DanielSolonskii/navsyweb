import axios from 'axios'
import { cacheAdapterEnhancer } from 'axios-extensions';
import store from "@/store";
import router from "@/router";
import AuthService from "@/services/auth";

let baseUrl = 'http://localhost:8081'
let versionApi = '/api/'
let token = localStorage.getItem('access_token');

const cacheConfig = {
    enabledByDefault: false,
    cacheFlag: 'useCache'
};

const httpClient = axios.create({
    baseURL: `${baseUrl + versionApi}`,
    headers: {
        common: {
            'Cache-Control': 'no-cache',
            Authorization: `Bearer ${token}`
        }
    },
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, cacheConfig)
});


let refreshTokenRequest = null;
httpClient.interceptors.response.use(undefined,  (error) => {
    const originalRequest = error.config;
    return new Promise((resolve, reject) => {
        if (error.response.status === 401 && error.config.url !== '/auth/logout') {
            store.dispatch('auth/logout');
            if (router.currentRoute.name !== 'Login') {
                router.push('/login');
            }
        }
        if (error.response.status === 422 && error.response.data.message === "Signature has expired" &&
            error.config.url !== '/auth/refresh' && !originalRequest._retry) {
            originalRequest._retry = true;
            if (refreshTokenRequest) {
                refreshTokenRequest.then((data) => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
                    httpClient(originalRequest).then(resolve, reject);
                    return data
                }).catch(() => {
                    throw 'error refresh token'
                });
            } else {
                if (originalRequest.headers['Authorization'] !== 'Bearer ' + localStorage.getItem('access_token')) {
                    originalRequest.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
                    httpClient(originalRequest).then(resolve, reject);
                } else {
                    refreshTokenRequest = AuthService.refresh_authorization()
                        .then((data) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
                            httpClient(originalRequest).then(resolve, reject);
                            return data;
                        })
                        .catch(() => {
                            store.dispatch('notification/close');
                            store.dispatch('auth/logout');
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            if (router.currentRoute.name !== 'Login') {
                                router.push('/login');
                            }
                        }).finally(() => {
                            refreshTokenRequest = null;
                        });
                }
            }
        } else {
            throw error;
        }
    });

});

httpClient.api = {
    updatepass: (currentpass, id, newpass) => httpClient.post('/updatePassword', {currentpass: currentpass, id: id, newpass: newpass}),
    deleteMarker: (marker, id) => httpClient.post('/deleteMarker', {marker: marker, id: id}),
    //getCar: () => httpClient.get('/data/cars.json'),
    login: (name, password) => httpClient.post('/auth/login', {username: name, password: password}),
    signUp: (name, password, email, role) => httpClient.post('/auth/signup', {username: name, password: password, email: email, role: role}),
    logout: () => httpClient.post('/auth/logout'),
    updateUser: (id, name, surname, phone, email, active) => httpClient.post('/updateUser', {id: id, name: name, surname: surname, phone: phone, email: email, active: active}),
    getCarsTables: (name) => httpClient.post('/getCarsTables', {username: name}),
    refreshToken: () => httpClient.post('/auth/refresh'),
    getAccountInfo: (name) => httpClient.post('/getAccountInfo', {username: name}),
    getCar: () => httpClient.get('/cars'),
    getDevices: () => httpClient.get('/devices'),
    catalogBrands: () => httpClient.get('/brands-options'),
    catalogModels: () => httpClient.get('/models-options'),
    catalogVehicles: () => httpClient.get('/cars-options'),
    catalogFreeVehicle: () => httpClient.get('/cars-options/free'),
    catalogDevices: () => httpClient.get('/devices-options'),
    catalogGroups: () => httpClient.get('/motorcade-options'),
    catalogVoltage: () => httpClient.get('/voltage-options', {useCache: true}),
    addCar: (car) => httpClient.post('/cars',  car),
    updateCar: (car) => httpClient.put('/cars', car),
    addGroup: (name) =>  httpClient.post('/motorcades', {name: name}),
    updateGroup: (id, groupId) => httpClient.put('/cars/install-motorcade', {vehicleId: id, groupId: groupId}),
    addBrand: (name) => httpClient.post('/brands', {name: name}),
    addBlock: (block) => httpClient.post('/devices',  block),
    updateBlock: (block) => httpClient.put('/devices', block),
    addModel: (brandId, name) => httpClient.post('/models', {brandId: brandId, typeId: 1, name: name}),
    mountBlock: (deviceId, vehicleId) => httpClient.put('/devices/install', {deviceId: deviceId, vehicleId: vehicleId}),
    unmountBlock: (deviceId) => httpClient.put('/devices/uninstall', {deviceId: deviceId}),
    getTreeCars: () => httpClient.get('/cars/tree')
};

export default httpClient;