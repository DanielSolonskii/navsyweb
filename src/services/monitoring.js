export class MonitoringService {
    static connectionWS() {
        const token = localStorage.getItem('access_token');
        return new WebSocket(process.env.VUE_APP_WS_SERVER, [token]);
        // return new WebSocket(process.env.VUE_APP_WS_SERVER);
    }
}