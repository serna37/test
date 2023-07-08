import React, {useState} from 'react'
import {Box, Grid, Typography, Modal, TextField, Button} from '@mui/material'
import Divider from '@mui/material/Divider';
import {Msg} from './Chatroomlist'

type Props = {
  roomid: number
  roomname: string
  openFlg: boolean
  flgUpd: any
  msglist: Msg[]
  sendFunc: any
}

const Chatroom: React.FC<Props> = (props): JSX.Element => {
  const [msgenter, setMsgenter] = useState("")
  if (!props.openFlg) {
    return (<Grid> </Grid>)
  }

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    height: '80%',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgb(128, 128, 128, 1)'
  }

  function send() {
    props.sendFunc.fn(msgenter)
    setMsgenter("")
    setTimeout(() => {
      const list = document.getElementById('chatbody')
      list?.scrollTo(0, list?.scrollHeight)
    }, 300)
  }

  return (
    <Modal open={props.openFlg} onClose={props.flgUpd}>
      <Grid sx={{...modalStyle}} container direction="column" spacing={0}>
        {/** title */}
        <Grid item xs="auto">
          <Typography color='primary' variant={'h5'} sx={{textAlign: "center"}}>
            {`RoomName: ${props.roomname}`}
          </Typography>
          <Divider />
        </Grid>

        {/** body */}
        <Grid id="chatbody" item xs sx={{height: '100%',overflow: 'scroll'}}>
          {props.msglist.map((v, i) => (
            <Box key={i}>
              <Grid container direction="row" spacing={1}>
                <Grid item xs={2}>{`Id:${v.FromId}`}</Grid>
                <Grid item xs={6}>{`@${new Date(v.FromAt).toLocaleString()}`}</Grid>
              </Grid>
              <Grid container direction="row" spacing={1}>
                <Grid item xs={7}>{v.Msg}</Grid>
              </Grid>
              <Divider></Divider>
              <br />
            </Box>
          ))}
        </Grid>

        {/** send area */}
        <Grid item xs="auto">
          <Grid container direction="row" spacing={1}>
            <Grid item xs={9}>
              <TextField label="message" variant="standard" fullWidth value={msgenter} onChange={e => setMsgenter(e.target.value)} />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" onClick={send}>Send</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default Chatroom
