import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConstants from '../constants/AppConstants';

var instance = null;
export default class Session {
    static getInstance() {
        if (instance == null) {
            instance = new Session();
        }

        return instance;
    }

    constructor() {
        this.clean();
    }

    isLoggedIn = () => {
        return this.user != undefined;
    }

    getUserId = () => {
        return this.user?.id;
    }

    getUserEmail = () => {
        return this.user?.email;
    }

    getUserFullName = () => {
        return this.user?.name;
    }

    getUserAvatar = () => {
        return 'https://www.pngkey.com/png/detail/121-1219231_user-default-profile.png'
        //return this.user?.profilePic ?? 'https://www.pngkey.com/png/detail/121-1219231_user-default-profile.png';
    }

    getUserMoney = () => {
        return this.user?.money;
    }

    clean() {
        this.user = undefined;
    }

    async load() {
        await AsyncStorage.getItem(AppConstants.ASYNC_STORAGE_KEYS.LOGGED_USER)
            .then(data => {
                if (data != undefined) {
                    this.user = JSON.parse(data);
                }
            })
            .catch(e => console.log(e));

        return this;
    }

    logIn = async (user) => {
        return this.saveUserInfo(user)
            .then(() => Promise.resolve(true))
            .catch(e => console.log(e));
    }

    logOut = async () => {
        return AsyncStorage.removeItem(AppConstants.ASYNC_STORAGE_KEYS.LOGGED_USER)
            .then(() => {
                this.clean();
                
                return Promise.resolve(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    saveUserInfo = async (user) => {
        return AsyncStorage.setItem(AppConstants.ASYNC_STORAGE_KEYS.LOGGED_USER, JSON.stringify(user))
            .then(() => {
                this.user = user;
            });
    }

    saveCurrentUserInfo = () => {
        return this.saveUserInfo(this.user);
    }
}