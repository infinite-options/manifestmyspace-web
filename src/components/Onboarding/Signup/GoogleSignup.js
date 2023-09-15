import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Modal, Row, Button } from "react-bootstrap";
import axios from "axios";
import { formatPhoneNumber } from "../helper";
import UserAlreadyExistsModal from "./UserAlreadyExistsModal";
import { boldSmall } from "../styles";

let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN = process.env.REACT_APP_GOOGLE_LOGIN;
let SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile";

function GoogleSignup(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialId, setSocialId] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessExpiresIn, setAccessExpiresIn] = useState("");
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

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
                        first_name: firstName,
                        last_name: lastName,
                        role: "",
                        phone_number: phoneNumber,
                        google_auth_token: at,
                        google_refresh_token: rt,
                        social_id: si,
                        access_expires_in: String(ax),
                      };
                      axios
                        .post(
                          "https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/UserSocialSignUp/MYSPACE",
                          user
                        )
                        .then((response) => {
                          console.log(response);
                          if (response.data.message == "User already exists") {
                            setUserAlreadyExists(!userAlreadyExists);
                            return;
                            // add validation
                          } else {
                            setSignupSuccessful(true);
                          }
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
  const onCancel = () => {
    setUserAlreadyExists(false);
  };
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center ">
      <UserAlreadyExistsModal
        isOpen={userAlreadyExists}
        onCancel={onCancel}
        email={email}
      />
      <Row className="mt-5 mb-3">Google Signup</Row>
      {signupSuccessful ? (
        <div>
          <Row>
            <div className="d-flex flex-column justify-content-start mt-5">
              <div className="text-center">
                <p style={boldSmall} className="mb-1">
                  Signup Successful
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="mb-4"
                >
                  Login
                </Button>
              </div>
            </div>
          </Row>
        </div>
      ) : (
        <Row className="w-100">
          <Col></Col>
          <Col>
            <Form>
              <Row>
                {" "}
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="First Name"
                      name="email"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Last Name"
                      name="email"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  placeholder="(xxx)xxx-xxxx"
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(formatPhoneNumber(e.target.value))
                  }
                />
              </Form.Group>
            </Form>
            <div></div>
            <div id="signUpDiv">
              <Button
                class="btn btn-outline-dark"
                onClick={() => getAuthorizationCode()}
                role="button"
                style={{ textTransform: "none", borderRadius: "50px" }}
              >
                <img
                  width="20px"
                  style={{
                    marginBottom: "3px",
                    marginRight: "5px",
                  }}
                  alt="Google sign-in"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                />
                Sign Up with Google
              </Button>
            </div>
          </Col>
          <Col></Col>
        </Row>
      )}
    </Container>
  );
}

export default GoogleSignup;
