import axios from "axios";
import AuthHandler from "./authHandler";
import { accountBackendUrl, authBaseURL } from "../utils/urls";

export default class AccountHandler {
    static logInUser = () => {
        if (!this.isUserLoggedIn()){
            window.location.href = `${authBaseURL}/auth/login?redirect_to=` + window.location;
        } 
        
    };

    static logOutUser = () => {
        if (this.isUserLoggedIn()) {
            AuthHandler.clearAllTokens();
            window.localStorage.removeItem("accessToken");
            window.location.href = `${authBaseURL}/auth/logout?redirect_to=` + window.location;
        }
    };

    static isUserLoggedIn = () => {
        return AuthHandler.getRefreshToken() != null;
    };

    static asyncGetUserProfile = async () => {
        let profile = null;
        if (this.isUserLoggedIn()) {
            let access_token = await AuthHandler.aysncGetAccessToken();
            if (access_token != null) {
                try {
                    let res = await axios.get(`${accountBackendUrl}/profile`, {
                        headers: { Authorization: `Bearer ${access_token}` },
                    });
                    // console.log(res)
                    if (res.status === 200) profile = res.data;
                } catch (err) {
                    console.log("Failed to fetch user profile");
                }
            }
        }

        return profile;
    };
}