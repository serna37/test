import React, {useState} from 'react'
import axios from 'axios'
import {Box, Grid, Typography} from '@mui/material'
import {Card, CardContent, CardActionArea, CardMedia, CardActions} from '@mui/material'
import {IconButton, Menu, MenuItem, ListItemIcon, ListItemText} from '@mui/material'
import {Favorite, MoreVert, Edit, Delete} from '@mui/icons-material'
import {Contents} from './Tabs'

const heightDef = new Map<string, number>([['2d', 250], ['video', 110]])

/** card component */
const VCard: React.FC<Contents> = (props): JSX.Element => {

  const {id, category: type, thumbnail, title} = props
  const [viewCnt, setViewCnt] = useState(props.viewCnt)
  const [likeCnt, setLikeCnt] = useState(props.likeCnt)
  const height = heightDef.get(type)

  // view detail
  function view() {
    // view + 1
    axios.post('https://neras-sta.com/mk6/view', {id: id}, {withCredentials: true})
    //axios.post('http://localhost:8080/mk6/view', {id: id}, {withCredentials: true})
      .then(_ => setViewCnt(viewCnt + 1))
    // modal open
    sessionStorage.setItem('detail', JSON.stringify(props))
    // set latest view/fav
    sessionStorage.setItem('viewCnt', viewCnt + 1 + "")
    sessionStorage.setItem('likeCnt', likeCnt + "")
    const dmodal: any = document.getElementById('detail-modal-open')
    dmodal.click()
  }

  // favorite
  function favo() {
    axios.post('https://neras-sta.com/mk6/fav', {id: id}, {withCredentials: true})
    //axios.post('http://localhost:8080/mk6/fav', {id: id}, {withCredentials: true})
      .then(_ => setLikeCnt(likeCnt + 1))
  }

  // menu open/close
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // edit
  function edit() {
    // XXX 編集画面作る, 追加画面と同じコンポーネント、確定でDBにいく
    console.log('edit')
    handleClose()
  }

  // delete
  function del() {
    // XXX 削除確認ダイアログ作る、確定でDBに削除
    console.log("delete")
    handleClose()
  }

  return (
    <Card variant='outlined'>
      {/** main */}
      <CardActionArea onClick={view}>
        <CardMedia component='img' sx={{objectFit: 'contain', height: {height}}} title={title} image={thumbnail} />
        <CardContent sx={{pt: 0, pb: 0, pr: 1, pl: 1}}>
          <Typography sx={{fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis'}} color='text.secondary'>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/** sub info */}
      <CardActions sx={{pt: 0, height: 20}}>
        <Grid container alignItems='center'>
          {/** view */}
          <Grid item xs={6}>
            <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
              <Typography color='secondary'>{viewCnt}views</Typography>
            </Box>
          </Grid>
          {/** fav */}
          <Grid item xs={2}>
            <IconButton aria-label='add to favorites' onClick={favo}>
              <Favorite color='primary' />
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Typography color='secondary'>{likeCnt}</Typography>
            </Box>
          </Grid>
          {/** crud action */}
          <Grid item xs={2}>
            <IconButton aria-label='edit' onClick={handleClick}>
              <MoreVert color='action' />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{style: {maxHeight: 216, width: '20ch', }, }} >
              <MenuItem onClick={edit}>
                <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                <ListItemText>edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={del}>
                <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                <ListItemText>delete</ListItemText>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
export default VCard
