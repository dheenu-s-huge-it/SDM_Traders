import { ClickAwayListener, Fade, Paper, Popper, Typography } from '@mui/material'

// Emoji Picker Component for selecting emojis
const ContactPopper = ({ open, setOpen, anchorRef }) => {
  return (
    <>
      <Popper
        open={open}
        transition
        disablePortal
       placement="bottom-start"
        sx={{ zIndex: 20 }}
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <Typography variant='h6' component='p' color='text.primary'>
                    Office Contact Number
                  </Typography>
                  <Typography variant='body1' component='p' color='text.secondary'>
                    9865044455
                  </Typography>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default ContactPopper
