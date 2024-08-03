import React from "react";
import { Typography, Box, Paper, Grid } from "@mui/material";
import theme from "../../theme/theme";
import ManifestWhite from "../../images/onboarding/manifest_white.png";
import { ReactComponent as Logo } from "../../images/logo.svg";

export default function PrivacyPolicy() {

    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Paper style={{
                backgroundColor: theme.palette.primary.main,
                width: "98%",
                boxShadow: "none",
                borderRadius: "10px",
                margin: "auto",
            }}>
                <Grid container sx={{ margin: '15px' }}>
                    <Grid item md={7.5}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginTop: '5px' }}>
                            My Space Privacy Policy
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'left', marginTop: '5px' }}>
                            Last updated: August 1, 2024
                        </Typography>
                    </Grid>
                    <Grid item md={4}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "auto",
                                backgroundColor:'#160449',
                                height:'50px'
                            }}
                        >
                            <Logo />
                        </div>
                    </Grid>
                    <Grid item md={11.5}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Privacy Policy
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px', }}>
                            Infinite Options, LLC (”us”, "we", or "our") operates Manifest My Space (the “Application"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the mobile application and web applications (the “Platforms”).
                            <br />
                            <br />
                            We use your Personal Information only for providing and improving the Application. By using the Application, you agree to the collection and
                            use of information in accordance with this policy.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Information Collection And Use
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            While using our Application, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name, email, social id (if you used social media to log in), street address, phone number, and payment information ("Personal Information”). This data is stored within our secure databases and we use this data to identify you with your account and purchases. We also use this data to pre-populate the information into your Application profile.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Log Data
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            Like many application operators, we collect information that your Platform sends whenever you visit our Application ("Log Data").
                            <br /><br />
                            This Log Data may include information such as your phone’s Internet Protocol ("IP") address, phone type, software version, the pages of our Application that you visit, the time and date of your visit, the time spent on those pages and other statistics. <br /><br />
                            In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this information to improve the Application.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Communications
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information regarding the mobile application.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Security
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Your Rights to Your Data
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            We believe that your personal data is your data. As such, should you ever request to be removed from our email lists or database you need only send us an email at info@infiniteoptions.com stating your request. We will comply within 5 working days of receiving your email.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Changes To This Privacy Policy
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            This Privacy Policy is effective as of August 1, 2024 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page. <br /> <br />
                            We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.  <br /> <br />
                            If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our mobile application.
                        </Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginTop: '10px' }}>
                            Contact Us
                        </Typography>
                        <Typography sx={{ fontSize: '14px', textAlign: 'justify', marginTop: '10px' }}>
                            If you have any questions about this Privacy Policy, please contact us: <br /><br />
                            Infinite Options, LLC <br />
                            info@infiniteoptions.com
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}