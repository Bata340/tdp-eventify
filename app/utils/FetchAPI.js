import { Alert } from 'react-native';
import axios from 'axios';

const TIMEOUT = 10000 //Milliseconds
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.request?._timedOut) {
            Alert.alert(
                'Error de conexión',
                'No se ha podido establecer la conexión con el servidor luego de varios intentos. Por favor, intente luego',
                [{ text: 'Entendido' }]
            );
        }

        return Promise.reject(error);
    }
)

export const fetchFromURL = async (url, params = {}, timeOutTime = TIMEOUT) => {
    return axiosInstance.get(url, {
        params: params,
        timeout: timeOutTime
    })
    .then(response => response)
    .catch(e => handleError(e, url, params));
}

export const postDataToURL = async (url, params = {}, strBody = "", timeOutTime = TIMEOUT) => {
    return axiosInstance.post(buildFullPath(url, params), strBody, {
        timeout: timeOutTime,
    })
    .then(response => response)
    .catch(e => handleError(e, url, params));
}

export const putDataToURL = async (url, params = {}, content = {}, timeOutTime = TIMEOUT) => {
    return axiosInstance.put(buildFullPath(url, params), content, {
        timeout: timeOutTime
    })
    .then(response => response)
    .catch(e => handleError(e, url, params));
}

export const deleteDataFromURL = async (url, params = {}, content = {}, timeOutTime = TIMEOUT) => {
    return axiosInstance.delete(buildFullPath(url, params), { data: content }, {
        timeout: timeOutTime
    })
    .then(response => response)
    .catch(e => handleError(e, url, params));
}

const buildFullPath = (url, params) => {
    let urlParams = [];
    Object.keys(params).map(k => {
        urlParams.push(`${k}=${encodeURIComponent(params[k])}`);
    });

    return `${url}?${urlParams.join('&')}`;
}

const handleError = (error, url, params) => {
    console.log(`Error requesting ${buildFullPath(url, params)}`);
    console.log(error);
    throw error;
}