import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Box, Grid, Typography} from '@mui/material'
import {Card, CardContent, CardMedia, CardActions} from '@mui/material'
import {Stack, Chip} from '@mui/material'
import {ImageList, ImageListItem} from '@mui/material'
import {Paper, BottomNavigation, BottomNavigationAction} from '@mui/material'
import {IconButton, Menu, MenuItem, ListItemIcon} from '@mui/material'
import {Close, Favorite, MoreVert, Edit, Delete} from '@mui/icons-material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment'
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import Divider from '@mui/material/Divider';
import {Ajax} from '../util/Ajax'
import Chatroom from './Chatroom'
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

type Props = {}
type Rooms = {
  Id: number
  Name: string
}
export type Msg = {
  Id: number
  FromId: number
  FromAt: string
  Msg: string
}
const Chatroomlist: React.FC<Props> = (props): JSX.Element => {

  //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const [rooms, setRooms] = useState<Rooms[]>([])

  useEffect(() => {
    Ajax.POST("/chatroom/read", {
      "userId": JSON.parse(window.sessionStorage.getItem("session") ?? "")?.userid
    }, (data: any) => {
      if (data.status) {
        console.log(data.message)
        return
      }
      console.log(data)
      setRooms(data)
    }, (e: any) => {
      console.log(e)
    })
  }, [])

  const [openRoomId, setOpenRoomId] = useState(0)
  const [openRoomName, setOpenRoomName] = useState("")
  const [openFlg, setOpenFlg] = useState(false)
  const [sendfunc, setSendfunc] = useState({fn: (_: string) => {}})

  const [msglist, setMsglist] = useState<Msg[]>([])

  function openRoom(v: Rooms) {
    setOpenRoomId(v.Id)
    setOpenRoomName(v.Name)
    setOpenFlg(true)

    let host = window.location.host.startsWith("localhost") ? "localhost:8181" : "neras-sta.com"
    const ws = new WebSocket(`ws://${host}/mk6v2/msg/${v.Id}`)
    const userId: string = JSON.parse(window.sessionStorage.getItem("session") ?? "0").userid + ""

    // sync
    ws.onmessage = (msg) => {
      console.log('onmessage start')
      let msgJson = JSON.parse(msg.data)
      console.log(msgJson)

      // shot message
      if (msgJson[0] === undefined) {
        console.log(msglist)
      let arr = JSON.parse(window.sessionStorage.getItem(`chat${v.Id}`) ?? "")
    console.log(arr)
    arr.push({
      Id: 0,
      FromId: msgJson.userId,
      FromAt: new Date() + "",
      Msg: msgJson.msg
    })
    window.sessionStorage.setItem(`chat${v.Id}`, JSON.stringify(arr))
    setMsglist(arr)
    const list = document.getElementById('chatbody')
    list?.scrollTo(0, list?.scrollHeight)
        console.log('onmessage shot end')
        return
      }

      // initiate get message
      setMsglist(msgJson)
      // store session
      window.sessionStorage.setItem(`chat${v.Id}`, JSON.stringify(msgJson))
    const list = document.getElementById('chatbody')
    list?.scrollTo(0, list?.scrollHeight)
      console.log('onmessage ini end')
    }

    // send
    setSendfunc({fn: (msg: string) => ws.send(JSON.stringify({userId: userId, msg: msg}))})
  }



  return (
    <Grid sx={{width: '90%', maxWidth: 360, height: '85%'}}>
      <Typography color='primary' variant={'h5'} sx={{m: "30px", textAlign: "center"}}>
        chatroom list
      </Typography>
      <List sx={{width: '100%', maxWidth: 360, bgcolor: 'lightcoral'}}>
        {rooms.map((value) => (
          <Grid key={value.Id} >
            <ListItem
              key={value.Id}
              secondaryAction={
                <IconButton aria-label="comment">
                  <CommentIcon />
                </IconButton>
              }
              value={value.Id}
              onClick={() => openRoom(value)}
            >
              <ListItemText key={value.Id} primary={`RoomName: ${value.Name}`} />
            </ListItem>
            <Divider />
          </Grid>
        ))}
      </List>
      <Chatroom roomid={openRoomId} roomname={openRoomName} openFlg={openFlg} flgUpd={() => setOpenFlg(false)} msglist={msglist} sendFunc={sendfunc} />
    </Grid>
  )
}
export default Chatroomlist

