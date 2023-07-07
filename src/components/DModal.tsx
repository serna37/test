import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Box, Grid, Typography} from '@mui/material'
import {Card, CardContent, CardMedia, CardActions} from '@mui/material'
import {Stack, Chip} from '@mui/material'
import {ImageList, ImageListItem} from '@mui/material'
import {Paper, BottomNavigation, BottomNavigationAction} from '@mui/material'
import {IconButton, Menu, MenuItem, ListItemIcon, ListItemText} from '@mui/material'
import {Close, Favorite, MoreVert, Edit, Delete} from '@mui/icons-material'
import {Contents} from './Tabs'

/** card component */
const DModal: React.FC<Contents> = (props): JSX.Element => {

  const {id, category: type, title, dataUrl, tags} = props
  const [viewCnt, setViewCnt] = useState(props.viewCnt)
  const [likeCnt, setLikeCnt] = useState(props.likeCnt)

  useEffect(() => {
    // get latest view/fav
    const targetDetailViewCnt: string = sessionStorage.getItem('viewCnt') ?? ""
    const targetDetailLikeCnt: string = sessionStorage.getItem('likeCnt') ?? ""
    setViewCnt(~~targetDetailViewCnt)
    setLikeCnt(~~targetDetailLikeCnt)
  }, [])


  // favorite
  function favo() {
    // set latest fav
    sessionStorage.setItem('likeCnt', likeCnt + 1 + "")
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
    <Box>
      {/** main */}
      {type === 'video'
        ? // video
        <Card variant='outlined'>
          {/** main */}
          <CardMedia component='video' sx={{objectFit: 'contain'}} title={title} src={dataUrl[0]} controls />
          <CardContent sx={{pt: 0, pb: 0, pr: 1, pl: 1}}>
            <Typography sx={{fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis'}} color='text.secondary'>
              {title}
            </Typography>
          </CardContent>
          {/** sub info */}
          <CardActions sx={{pt: 0, height: 140, display: "flex", flexFlow: "column"}}>
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
            <Grid container alignItems='center'>
              <Box sx={{p: 1}}>
                <Typography color='secondary'>tags</Typography>
                <Stack direction="row" spacing={1}>
                  {tags.length === 0 ? "no data" : tags.map((v, idx) => (
                    // XXX tag編集あとで
                    <Chip key={idx} label={v} onClick={() => console.log('click tag')} />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </CardActions>
        </Card>
        : // 2d
        <Box sx={{p: 1, display: "flex", justifyContent: "center", overflow: "scroll"}}>
          <ImageList cols={1} gap={8} variant="quilted" sx={{pb: 3, width: 400, height: 650}}>
            {dataUrl.map((v, idx) => (
              <ImageListItem key={idx}>
                <img src={v} object-fit="contain" loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
          <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation showLabels>
              {/** close */}
              <BottomNavigationAction label="close" icon={<Close />} onClick={() => {
                const cls: any = document.getElementById("detail-modal-close")
                cls.click()
              }} />
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
            </BottomNavigation>
          </Paper>
        </Box>
      }
    </Box >
  )
}
export default DModal
