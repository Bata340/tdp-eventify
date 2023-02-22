import AppConstants from '../constants/AppConstants';
import { postDataToURL } from './FetchAPI';

const API_URL = AppConstants.API_URL;

export const login = async (email, password) => {
    return postDataToURL(`${API_URL}/login`, {}, { email: email, password: password })
}