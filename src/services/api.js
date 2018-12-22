import axios from "axios";
import { getAccessToken } from "./tokens";

export default function requestApi(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      if (options.method === "auth") {
        options.method = "post";
        options.url = process.env.REACT_APP_AUTH_URL + url;
        options.headers = {
          "content-type": "application/x-www-form-urlencoded"
        };
      } else {
        options.url = process.env.REACT_APP_API_URL + url;
        if (!options.headers) {
          options.headers = {};
        }
        let accessToken = getAccessToken();
        if (accessToken) {
          options.headers = Object.assign({}, options.headers, {
            Authorization: "Bearer " + accessToken
          });
        }
      }

      axios(options)
        .then(response => {
          resolve(response);
        })
        .catch(reason => {
          reject(reason);
        });
    } catch (error) {}
  });
}
