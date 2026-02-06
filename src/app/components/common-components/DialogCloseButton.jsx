'use client'

//Mui Imports
import { styled } from '@mui/material'
import Button from '@mui/material/Button'

const DialogCloseButton = styled(Button)({
  top: 0,
  right: 0,
  color: '#6b6b6b',
  position: 'absolute',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06)',
  transform: 'translate(9px, -10px)',
  borderRadius: '4px',
  backgroundColor:"#FFFFFF",
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  blockSize: 30,
  inlineSize: 30,
  minInlineSize: 0,
  padding: 0,
  '&:hover, &:active': {
    transform: 'translate(7px, -5px) !important',
    backgroundColor: "#FFFFFF  !important",
  },
  '& i, & svg': {
    fontSize: '1.25rem'
  }
})

export default DialogCloseButton
