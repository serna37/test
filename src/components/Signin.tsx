import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography, Snackbar, IconButton, Alert} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import {Ajax} from '../util/Ajax'

type Props = {}

const Signin: React.FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const [loginid, setLoginid] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [open, setOpen] = useState(false)
  const [showUsername, setShowUsername] = useState("none")
  const [showSignupBtn, setshowSignupBtn] = useState("block")
  const [msg, setMsg] = useState("")

  const [_, setCookie] = useCookies(["authtoken"])
  const chgLoginid = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setLoginid(e.target.value)
  const chgPassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(e.target.value)
  const chgUsername = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setUsername(e.target.value)

  function Signin() {
    Ajax.POST("/usr/signin", {
      loginid: loginid,
      password: password
    }, (data: any) => {
      if (data.status) {
        setOpen(true)
        setMsg(data.message)
        return
      }
      const Session = {
        userid: data.userid,
        username: data.username
      }
      window.sessionStorage.setItem("session", JSON.stringify(Session))
      setCookie("authtoken", data.cookie, {path: "/"})
      setCookie("authtoken", data.cookie, {path: "/test/notes"})
      setCookie("authtoken", data.cookie, {domain: "neras-sta.com", path: "/"})
      navigate('/notes')

    }, (e: any) => {
      setOpen(true)
      setMsg(e.message)
    })
    return
  }


  function Signup() {
    setShowUsername("block")
    setshowSignupBtn("none")
  }
  function Signupgo() {
    Ajax.POST("/usr/signup", {
      name: username,
      loginid: loginid,
      password: password
    }, (data: any) => {
      if (data.status) {
        setOpen(true)
        setMsg(data.message)
        return
      }
      const Session = {
        userid: data.userid,
        username: username
      }
      window.sessionStorage.setItem("session", JSON.stringify(Session))
      setCookie("authtoken", data.cookie, {path: "/"})
      setCookie("authtoken", data.cookie, {path: "/test/notes"})
      setCookie("authtoken", data.cookie, {domain: "neras-sta.com", path: "/"})
      navigate('/notes')

    }, (e: any) => {
      setOpen(true)
      setMsg(e.message)
    })
  }



  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Grid>
      <Paper elevation={0} sx={{height: "70vh", width: "300px", m: "50px auto", pt: "200px", backgroundColor: "inherit"}}>
        <Grid container direction="column" justifyContent="flex-start" alignItems="center" >
          <Avatar sx={{bgcolor: teal[200]}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant={"h5"} sx={{m: "30px"}}>
            Your Notion
          </Typography>
          <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
          >
            <Alert onClose={handleClose} severity="warning" sx={{width: '100%'}}>
              {msg}
            </Alert>
          </Snackbar>
        </Grid>
        <TextField label="Loginid" variant="standard" fullWidth required value={loginid} onChange={chgLoginid} />
        <TextField type="password" label="Password" variant="standard" fullWidth required value={password} onChange={chgPassword} />
        <TextField sx={{display: showUsername}} label="username" variant="standard" fullWidth required value={username} onChange={chgUsername} />
        <Box mt={3}>
          <Button sx={{display: showSignupBtn}} type="submit" color="primary" variant="contained" fullWidth onClick={Signin}>
            Sign In
          </Button>
        </Box>
        <Box mt={3}>
          <Button sx={{display: showUsername}} type="submit" color="primary" variant="contained" fullWidth onClick={Signupgo}>
            Sign Up
          </Button>
        </Box>
        {/**
        <Box mt={3}>
          <Button sx={{display: showSignupBtn}} type="submit" color="secondary" variant="contained" fullWidth onClick={Signup}>
            OR Create Account
          </Button>
        </Box>
          */}
      </Paper>
    </Grid>
  )
}

export default Signin

