import { postDataToURL } from './FetchAPI';

const API_URL = 'http://localhost:8000'

export const login = async (email, password) => {
    return postDataToURL(`${API_URL}/login`, {}, { email: email, password: password })
}