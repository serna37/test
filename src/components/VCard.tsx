import React, {useState} from 'react'
import {Box, Grid, Typography} from '@mui/material'
import {Card, CardContent, CardActionArea, CardActions} from '@mui/material'
import {IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Stack, Chip} from '@mui/material'
import Divider from '@mui/material/Divider';
import {MoreVert, Edit, Delete} from '@mui/icons-material'
import {Contents} from './Tabs'
import {Modal} from '@mui/material'
import DModal from './DModal'

type EditCon = Contents & {
  refresh: any
}

/** card component */
const VCard: React.FC<EditCon> = (props): JSX.Element => {

  const {categoryId, id, title, content, tags} = props
  const [modalOpen, setModalOpen] = useState(false)
  function modalClose() {
    setModalOpen(false)
    props.refresh()
    console.debug("detail modal close")
  }

  // menu open/close
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // edit
  function edit() {
    console.debug(categoryId)
    console.debug(id)
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
              <Chip key={tag.MstTags.Id} label={tag.MstTags.Name} onClick={() => console.debug(tag.MstTags.Name)} />
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
