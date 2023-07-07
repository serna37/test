import React, {useState} from 'react'
import axios from 'axios'
import {Box, Grid, Typography} from '@mui/material'
import {Card, CardContent, CardActionArea, CardMedia, CardActions} from '@mui/material'
import {IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Stack, Chip} from '@mui/material'
import Divider from '@mui/material/Divider';
import {Favorite, MoreVert, Edit, Delete} from '@mui/icons-material'
import {Contents} from './Tabs'
import {Modal} from '@mui/material'
import DModal from './DModal'


/** card component */
const VCard: React.FC<Contents> = (props): JSX.Element => {

  const {categoryId, id, title, content, tags} = props



  // for modal
  const [cntnt, setCntnt] = useState<Contents>({
    categoryId: 0,
    id: 0,
    title: "",
    content: "",
    tags: [{
      Id: 0,
      ContentId: 0,
      TagId: 0,
      MstTags: {
        Id: 0,
        Name: ""
      }
    }]
  })




  const [modalOpen, setModalOpen] = useState(false)
  function modalClose() {
    setModalOpen(false)
  }

  //  const {id, category: type, thumbnail, title} = props
  //  const [viewCnt, setViewCnt] = useState(props.viewCnt)
  //  const [likeCnt, setLikeCnt] = useState(props.likeCnt)

  // view detail
  function view() {
    // XXX view on modal = 
    //    // view + 1
    //    axios.post('https://neras-sta.com/mk6/view', {id: id}, {withCredentials: true})
    //    //axios.post('http://localhost:8080/mk6/view', {id: id}, {withCredentials: true})
    //      .then(_ => setViewCnt(viewCnt + 1))
    //    // modal open
    //    sessionStorage.setItem('detail', JSON.stringify(props))
    //    // set latest view/fav
    //    sessionStorage.setItem('viewCnt', viewCnt + 1 + "")
    //    sessionStorage.setItem('likeCnt', likeCnt + "")
    //    const dmodal: any = document.getElementById('detail-modal-open')
    //    dmodal.click()
  }

  // favorite
  function favo() {
    //    axios.post('https://neras-sta.com/mk6/fav', {id: id}, {withCredentials: true})
    //    //axios.post('http://localhost:8080/mk6/fav', {id: id}, {withCredentials: true})
    //      .then(_ => setLikeCnt(likeCnt + 1))
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
    setCntnt(props) // TODO いらんくね
    setModalOpen(true)
    handleClose()
  }

  // delete
  function del() {
    // XXX 削除確認ダイアログ作る、確定でDBに削除
    console.log("delete")
    handleClose()
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
    backgroundColor: 'gray'
  }


  return (
    <Card variant='outlined'>
      {/** main */}

      <CardActionArea onClick={edit}>
        <CardContent sx={{pt: 0, pb: 0, pr: 1, pl: 1}}>
          <Typography variant={'h5'} sx={{fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis'}} color='text.secondary'>
            {title}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent sx={{pt: 0, pb: 0, pr: 1, pl: 1}}>
          <Typography sx={{fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis'}} color='text.secondary'>
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/** sub info */}
      <CardActions sx={{pt: 0, height: 20}}>
        <Grid container alignItems='center'>
          {/** view */}
          {tags.map((tag, tidx) => (
            <Stack key={tidx} direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip key={tag.MstTags.Id} label={tag.MstTags.Name} onClick={() => console.log(tag.MstTags.Name)} />

            </Stack>
          ))}
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


      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={{...modalStyle}}>
          <DModal {...props} />
        </Box>
      </Modal>


    </Card>
  )
}
export default VCard
