import React, {useState} from 'react'
import {Box, Grid} from '@mui/material'
import {Paper, BottomNavigation, BottomNavigationAction} from '@mui/material'
import {IconButton, } from '@mui/material'
import {Contents} from './Tabs'
import CheckIcon from '@mui/icons-material/Check';
import {TextField} from '@mui/material'
import {Ajax} from '../util/Ajax'
import {Button, Snackbar, Alert} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

/** card component */
const DModal: React.FC<Contents> = (props): JSX.Element => {

  const {categoryId, id, title, content, tags} = props

  const [editTitle, setEditTitle] = useState(title)
  const [editBody, setEditBody] = useState(content)

  // msg
  const [resmsg, setResmsg] = useState("")
  const [openm, setOpenm] = useState(false)
  function commit() {
    // commit
    console.debug(tags)

    if (id == 0) {
      const userId: number = ~~JSON.parse(window.sessionStorage.getItem("session") ?? "0").userid
      Ajax.POST("/contents/create",
        {
          "userId": userId, "categoryId": categoryId, "title": editTitle, "contents": editBody
        },
        (data: any) => {
          if (data.status) {
            setResmsg(data.message)
            setOpenm(true)
            return
          }
          setResmsg(data.message)
          setOpenm(true)
        }, (e: any) => {
          setResmsg(e.message)
          setOpenm(true)
        }
      )

      return
    }



    Ajax.POST("/contents/update",
      {
        "contentsId": id, "title": editTitle, "contents": editBody
      },
      (data: any) => {
        if (data.status) {
          setResmsg(data.message)
          setOpenm(true)

          return
        }
        setResmsg(data.message)
        setOpenm(true)

      }, (e: any) => {
        setResmsg(e.message)
        setOpenm(true)
      }
    )
  }


  const handleClose2 = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenm(false);
  }


  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose2}>
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose2}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  return (
    <Box sx={{width: '100%'}}>

      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={openm}
        autoHideDuration={6000}
        onClose={handleClose2}
        action={action}
      >
        <Alert onClose={handleClose2} severity="success" sx={{width: '100%'}}>
          {resmsg}
        </Alert>
      </Snackbar>


      <Box sx={{p: 1, height: '100%', display: "flex", justifyContent: "center", overflow: "scroll"}}>
        <Grid container direction="column" justifyContent="flex-start" alignItems="center" sx={{height: '100%'}}>
          <Grid item sx={{width: '100%'}} xs={2}>
            <TextField label="title" variant="outlined" fullWidth value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          </Grid>
          <Grid item sx={{width: '100%', overflow: 'scroll'}} xs={10}>
            <TextField sx={{width: '100%', height: '100%'}}
              multiline
              maxRows={1000}
              label="contents" variant="outlined" fullWidth value={editBody} onChange={e => setEditBody(e.target.value)} />
          </Grid>
        </Grid>
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
          <BottomNavigation showLabels>
            <BottomNavigationAction label="commit" icon={<CheckIcon />} onClick={commit} />
          </BottomNavigation>
        </Paper>
      </Box>
    </Box >
  )
}
export default DModal
