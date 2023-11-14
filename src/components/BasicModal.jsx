import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const modal = ({open, onClose, text}) => {
    const style = {
        position: 'absolute',
        top: '40%',
        left: '40%',
        transform: 'translate(-50%, - 50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
  return (
    <div>
        <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
Sorry          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {text}
          </Typography>
        </Box>
        </Modal>
    </div>
  )
}

export default modal