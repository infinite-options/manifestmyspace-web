import { TextField } from "@mui/material";


export default function PhoneNumberField({phoneNumber, setPhoneNumber}){

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    return (
        <TextField
        fullWidth
        sx={{
            backgroundColor: 'white',
            borderColor: 'black',
            borderRadius: '7px',
        }}
        size="small"
        onChange={handlePhoneNumberChange}
        />
    )
}