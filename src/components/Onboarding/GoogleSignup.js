import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";

let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
let SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile";

const GoogleSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [socialId, setSocialId] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessExpiresIn, setAccessExpiresIn] = useState("");

  let codeClient = {};

  //   run onclick for authorization and eventually sign up
  function getAuthorizationCode() {
    // Request authorization code and obtain user consent,  method of the code client to trigger the user flow
    codeClient.requestCode();
  }

  useEffect(() => {
    /* global google */

    if (window.google) {
      // initialize a code client for the authorization code flow.
      codeClient = google.accounts.oauth2.initCodeClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          // gets back authorization code
          if (tokenResponse && tokenResponse.code) {
            let auth_code = tokenResponse.code;
            let authorization_url =
              "https://accounts.google.com/o/oauth2/token";

            var details = {
              code: auth_code,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              redirectUri: "postmessage",
              grant_type: "authorization_code",
            };
            var formBody = [];
            for (var property in details) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(details[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            // use authorization code, send it to google endpoint to get back ACCESS TOKEN n REFRESH TOKEN
            fetch(authorization_url, {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: formBody,
            })
              .then((response) => {
                return response.json();
              })

              .then((data) => {
                let at = data["access_token"];
                let rt = data["refresh_token"];
                let ax = data["expires_in"];
                //  expires every 1 hr
                setAccessToken(at);
                // stays the same and used to refresh ACCESS token
                setRefreshToken(rt);
                setAccessExpiresIn(ax);
                //  use ACCESS token, to get email and other account info
                axios
                  .get(
                    "https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=" +
                      at
                  )
                  .then((response) => {
                    let data = response.data;

                    let e = data["email"];
                    let si = data["id"];

                    setEmail(e);

                    setSocialId(si);
                    const socialGoogle = async () => {
                      const user = {
                        email: e,
                        password: GOOGLE_LOGIN,
                        first_name: data["given_name"],
                        last_name: data["family_name"],
                        google_auth_token: at,
                        google_refresh_token: rt,
                        social_id: si,
                        access_expires_in: ax,
                      };
                      navigate("/selectRole", {
                        state: {
                          user: user,
                        },
                      });
                    };
                    socialGoogle();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                return (
                  accessToken, refreshToken, accessExpiresIn, email, socialId
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    }
  }, [getAuthorizationCode]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "5%",
      }}
    >
      <div className="w-100">
        <div></div>
        <div>
          <div></div>
          <div id="signUpDiv">
            <Button
              onClick={() => getAuthorizationCode()}
              role="button"
              style={{ textTransform: "none", borderRadius: "50px" }}
            >
              <img
                style={{
                  width: "2rem",
                }}
                alt="Google sign-up"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default GoogleSignup;
