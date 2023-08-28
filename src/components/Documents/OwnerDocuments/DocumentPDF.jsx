import { Box } from '@mui/system';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';

import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useLocation, useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

function DocumentPDF(props) {
    const [numPages, setNumPages] = useState(null);
    const location = useLocation();
    const link = location.state.link;
    // console.log(location);
    const navigate = useNavigate();

    // Disabling right click
    // document.addEventListener("contextmenu", (event) => {
    //     event.preventDefault();
    // });
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <Box sx={{
            backgroundColor: '#D6D5DA',
            borderRadius: '10px',
            margin: '20px',
            padding: '20px',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: '10px',
                marginBottom: '10px',

                color: '#160449',
                fontSize: '20px',
                fontWeight: 'bold',
            }}>
                <Box onClick={() => {
                    navigate('/ownerDocuments');
                }}>
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7L1.58579 8.41421L0.171572 7L1.58579 5.58579L3 7ZM8 20C6.89543 20 6 19.1046 6 18C6 16.8954 6.89543 16 8 16L8 20ZM6.58579 13.4142L1.58579 8.41421L4.41421 5.58579L9.41421 10.5858L6.58579 13.4142ZM1.58579 5.58579L6.58579 0.585787L9.41421 3.41421L4.41421 8.41421L1.58579 5.58579ZM3 5L13.5 5L13.5 9L3 9L3 5ZM13.5 20L8 20L8 16L13.5 16L13.5 20ZM21 12.5C21 16.6421 17.6421 20 13.5 20L13.5 16C15.433 16 17 14.433 17 12.5L21 12.5ZM13.5 5C17.6421 5 21 8.35786 21 12.5L17 12.5C17 10.567 15.433 9 13.5 9L13.5 5Z" fill="#160449" />
                    </svg>
                </Box>
                <Box>
                    Viewing Document PDF
                </Box>
                <Box onClick={() => {
                    window.open(link, '_newtab');
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 15L3.75 8.75L5.5 6.9375L8.75 10.1875V0H11.25V10.1875L14.5 6.9375L16.25 8.75L10 15ZM2.5 20C1.8125 20 1.22375 19.755 0.733752 19.265C0.243752 18.775 -0.000831211 18.1867 2.12224e-06 17.5V13.75H2.5V17.5H17.5V13.75H20V17.5C20 18.1875 19.755 18.7762 19.265 19.2662C18.775 19.7562 18.1867 20.0008 17.5 20H2.5Z" fill="#3D5CAC" />
                    </svg>
                </Box>
            </Box>
            <Document
                file={link}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Box sx={{
                        marginBottom: '10px',
                    }}>
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    </Box>
                ))}
            </Document>
        </Box>
    )
}

export default DocumentPDF;