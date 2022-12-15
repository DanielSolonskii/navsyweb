import store from '@/store'
import router from "@/router";
import httpClient from '@/api'

export default class AuthService {
    static restore_authorization() {
        const username = localStorage.getItem('username');
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        if (access_token && refresh_token) {
            store.dispatch('auth/login', {
                username: username
            })
            store.dispatch('notification/open', {
                msg: 'Ваша сессия востановлена',
                timeout: 3000
            })
        } else {
            store.dispatch('auth/logout');
            router.push('/login');
        }
    }
    static authorization(credentials) {
        store.dispatch('auth/login_request');
        return httpClient.api.login(credentials.name, credentials.password)
            .then(resp => {
                console.log(resp.data);
                const access_token = resp.data.token;
                const refresh_token = resp.data.refresh_token;
                const username = resp.data.username;
                localStorage.setItem('username', username);
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
                store.dispatch('auth/login', {
                    username: username
                });
                router.push('/start-page');
            })
            .catch((err) => {
                store.dispatch('auth/login_error');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                throw err.response.data.message;
            })
    }
    static refresh_authorization() {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
            return router.push('/login');
        }
        store.dispatch('auth/login_request');
        httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + refresh_token;
        return httpClient.api.refreshToken()
            .then(resp => {
                const new_access_token = resp.data.access_token;
                const new_refresh_token = resp.data.refresh_token;
                localStorage.setItem('access_token', new_access_token);
                localStorage.setItem('refresh_token', new_refresh_token);
                httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + new_access_token;
                store.dispatch('auth/login', {
                    username: store.getters["auth/getUsername"]
                });
                return resp.data
            })
            .catch((err) => {
                store.dispatch('auth/login_error');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                throw err.response.data.message;
            });
    }
    static logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        store.dispatch('auth/logout');
        store.dispatch('notification/open', {
            msg: 'Вы покинули сессию',
            timeout: 3000
        })
        router.push('/login');
    }
}