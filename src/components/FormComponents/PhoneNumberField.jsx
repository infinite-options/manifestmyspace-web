import { TextField } from "@mui/material";
import { useEffect } from "react";


export default function PhoneNumberField(props){
    let setPhoneNumber = props.setPhoneNumber;
    let phoneNumber = props.phoneNumber;
    let setErrorFlag = props.setErrorFlag;
    let errorFlag = props.errorFlag;

    useEffect(() => {
        if (phoneNumber.length > 14) {setErrorFlag(true);}
        else {setErrorFlag(false);}
    }, [phoneNumber])


    const handlePhoneNumberChange = (event) => {
        let number = event.target.value;
        var formattedNumber = "";
        for (let i = 0; i < event.target.value.length; i++) {
            if (i === 0 && number[0] !== "(") {
                formattedNumber += "(";
            } else if (i === 4 && number[4] !== ")") {
                formattedNumber += ")";
            } else if (i === 5 && number[5] !== "-") {
                formattedNumber += "-";
            }
            else if (i === 9 && number[9] !== "-") {
                formattedNumber += "-";
            }
            formattedNumber += event.target.value[i];
        }
        setPhoneNumber(formattedNumber);
    };

    return (
        <>
            <TextField
                fullWidth
                sx={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderRadius: '7px',
                }}
                size="small"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
            />
            {errorFlag && <p style={{color: 'red'}}>Please enter a valid phone number</p>}
        </>
    )
}