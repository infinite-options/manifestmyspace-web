import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const cardWidth = 250;
const cardHeight = 70;

export default function CardSlider(props) {
    const buttonSize = 30;

    const cards = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];
    let baseArray = [true];
    for (let i = 1; i < cards.length; i++) {
        baseArray.push(false);
    }
    const [cardSelection,] = useState(baseArray);
    const [cardIndex, setCardIndex] = useState(0);
    const [position, setPosition] = useState((cardWidth * cardSelection.length / 2) - (cardWidth / 2));

    function leftClicked() {
        if (0 !== cardIndex) {
            for (let i = 0; i < cardSelection.length; i++) {
                if (cardIndex - 1 === i) {
                    cardSelection[i] = true;
                } else {
                    cardSelection[i] = false;
                }
            }
            setCardIndex(cardIndex - 1);
            setPosition(position + cardWidth);
        }
    }
    function rightClicked() {
        if (cardSelection.length - 1 !== cardIndex) {
            for (let i = 0; i < cardSelection.length; i++) {
                if (cardIndex + 1 === i) {
                    cardSelection[i] = true;
                } else {
                    cardSelection[i] = false;
                }
            }
            setCardIndex(cardIndex + 1);
            setPosition(position - cardWidth);
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
                    {cards.map((contents, i) => (
                        <Card key={i} selection={[cardSelection, i, cardIndex]}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '5px',
                                borderColor: '#3D5CAC',
                                color: '#160449',
                                padding: '5px',
                                width: 'inherit',
                                height: 'inherit',
                                boxShadow: '0px 4px 4px #00000019',
                            }}>
                                <Box sx={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                }}>
                                    Alert
                                </Box>
                                <Box sx={{
                                    marginLeft: '10px',
                                }}>
                                    <Box sx={{
                                        fontSize: '7px',
                                        fontStyle: 'italic',
                                        marginTop: '5px',
                                        marginBottom: '5px',
                                    }}>
                                        From
                                    </Box>
                                    <Box sx={{
                                        fontSize: '9px',
                                    }}>
                                        Get Notification Via Text Messages
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: 'auto',
                                    marginBottom: '10px',
                                }}>
                                    <Box sx={{
                                        textAlign: 'center',
                                        fontSize: '6px',
                                        borderRadius: '10px',
                                        borderWidth: '0.3px',
                                        borderStyle: 'solid',
                                        backgroundColor: '#D9D9D943',
                                        width: '60px',
                                    }}>
                                        Update settings 
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
                            <path d="M18.75 7.5L11.25 15L18.75 22.5" stroke="#160449" stroke-width="4" />
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
                            <path d="M11.25 22.5L18.75 15L11.25 7.5" stroke="#160449" stroke-width="4" />
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

    useEffect(() => {
        setTrasparency(() => (selected[i] ? '1.0' : lowOpacity));
    }, [selected, cardIndex]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#99ee88',
            width: cardWidth,
            height: cardHeight,
            margin: '2px',
            opacity: transparency,
        }}>
            {props.children}
        </Box>
    );
}