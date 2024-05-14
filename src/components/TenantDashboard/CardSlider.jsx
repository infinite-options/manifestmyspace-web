import { Box } from "@mui/material";
import { useEffect, useState } from "react";


const cardWidth = 500;
const cardHeight = 120;

export default function CardSlider(props) {
    const buttonSize = 30;
  
    // const cardsData = props.data;    
    
    // const [cards, setCards] = useState(['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5', 'Card 6', 'Card 7', 'Card 8', 'Card 9', 'Card 10', 'Card 11', 'Card 12', 'Card 13', 'Card 14', 'Card 15']);
    // let baseArray = [true];
    // for (let i = 1; i < cardsData.length; i++) {
    //     baseArray.push(false);
    // }    
    // const [cardSelection, setCardSelection] = useState(baseArray);
    // const [cardIndex, setCardIndex] = useState(0);
    // const [position, setPosition] = useState((cardWidth * cardSelection.length / 2) - (cardWidth / 2));
    const [cards, setCards] = useState([]);
    const [cardSelection, setCardSelection] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        let cardsData = props.data;
        console.log("In CardSlider - cardsData - ", cardsData);
        setCards(cardsData);
        let baseArray = [true];
        for (let i = 1; i < cardsData.length; i++) {
            baseArray.push(false);
        }
        setCardSelection(baseArray);
        setCardIndex(0);
        // setPosition((cardWidth * baseArray.length / 2) - (cardWidth / 0.75))
        setPosition(10)
    }, [props.data]);


    function leftClicked() {
        if (0 !== cardIndex) {
            const newCardSelection = [...cardSelection]; 
            for (let i = 0; i < newCardSelection.length; i++) {
                newCardSelection[i] = cardIndex - 1 === i;
            }
            setCardSelection(newCardSelection); 
            setCardIndex(cardIndex - 1);
            setPosition(position + cardWidth / 2);
        }
    }
    
    function rightClicked() {
        if (cardSelection.length - 1 !== cardIndex) {
            const newCardSelection = [...cardSelection];
            for (let i = 0; i < newCardSelection.length; i++) {
                newCardSelection[i] = cardIndex + 1 === i;
            }
            setCardSelection(newCardSelection);
            setCardIndex(cardIndex + 1);
            setPosition(position - cardWidth / 2);
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    position: 'relative',
                    left: position,
                    transition: 'left 0.5s',
                }}>
                    {cards.map((announcement, i) => (
                        <Card key={i} selection={[cardSelection, i, cardIndex]}>
                            <Box sx={{
                                // display: 'flex',
                                // flexDirection: 'column',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '5px',
                                borderColor: '#3D5CAC',
                                padding: '5px',
                                // width: 'auto',
                                // height: 'auto',
                                // boxShadow: '0px 4px 4px #00000019',
                            }}>
                                <Box sx={{
                                    fontSize: '16px',
                                    fontWeight: '800',
                                }}>
                                    {/* Alert */}
                                    {announcement.announcement_title}
                                </Box>
                                <Box sx={{
                                    marginLeft: '10px',
                                }}>
                                    <Box sx={{
                                        fontSize: '14px',
                                        marginTop: '5px',
                                        marginBottom: '5px',
                                    }}>
                                        From {announcement.sender_role === "Business" && (announcement.announcement_sender).startsWith('600') ? "Property Manager" : ""}
                                        {announcement.sender_role === "Owner" ? "Property Owner" : ""}
                                        {" "}{announcement.sender_first_name}
                                    </Box>
                                    <Box sx={{
                                        fontSize: '14px',
                                    }}>
                                        {announcement.announcement_msg}
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    ))}
                </Box>

            </Box>
            <Box sx={{
                position: 'relative',
                bottom: cardHeight / 2 + buttonSize / 2,
                width: '100%',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: '2',
                    }}
                        onClick={() => leftClicked()}
                    >
                        <svg width={buttonSize} height={buttonSize} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.75 7.5L11.25 15L18.75 22.5" stroke="#160449" strokeWidth="4" />
                        </svg>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: '2',
                    }}
                        onClick={() => rightClicked()}
                    >
                        <svg width={buttonSize} height={buttonSize} viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.25 22.5L18.75 15L11.25 7.5" stroke="#160449" strokeWidth="4" />
                        </svg>
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}

function Card(props) {
    const [selected, i, cardIndex] = props.selection;
    const lowOpacity = '0.8';
    const [transparency, setTrasparency] = useState(lowOpacity);
    const isDoubleWidth = i === 0; // Check if the card is the first one

    useEffect(() => {
        setTrasparency(() => (selected[i] ? '1.0' : lowOpacity));
    }, [selected, cardIndex, i]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF', //'#99ee88',
            maxWidth: "500px", // Double the width for the first card
            height: "200px",
            margin: '2px',
            opacity: transparency,
            boxShadow: '0px 4px 4px #00000019',
        }}>
            {props.children}
        </Box>
    );
}