import React, {useState, useRef} from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FilePreviewDialog = ({file, onClose }) => {

    const previewRef = useRef(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        const preview = previewRef.current;
        if (preview) {
          const shiftX = e.clientX - preview.getBoundingClientRect().left;
          const shiftY = e.clientY - preview.getBoundingClientRect().top;
    
          setDragOffset({ x: shiftX, y: shiftY });
    
          const onMouseMove = (e) => {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
    
            preview.style.left = `${newX}px`;
            preview.style.top = `${newY}px`;
          };
    
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
    
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }
      };

    return (
        <Box
            ref={previewRef}
            sx={{
                position: 'fixed',
                top: '100px',
                left: '65%',
                width: '500px',
                height: '500px',
                backgroundColor: 'white',
                boxShadow: 3,
                borderRadius: 2,
                zIndex: 130,
                cursor: 'move',
            }}
            onMouseDown={handleMouseDown}
        >
        <Box
            sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding:"10px",
            backgroundColor: '#f0f0f0',
            }}
        >
            <Typography variant="h6">{file?.filename || 'File Preview'}</Typography>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Box>
        <Box
            sx={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            // padding: "1px",
            }}
        >
            {file ? (
                <iframe
                    src={file.link}
                    width="100%"
                    height="100%"
                    title="File Preview"
                />
            ) : (
                <Typography>No file selected</Typography>
            )}
        </Box>
        </Box>
    );
};



  export default FilePreviewDialog;