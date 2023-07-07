import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {Avatar, Box, Button, Grid, Paper, TextField, Typography} from "@mui/material"
import {teal} from "@mui/material/colors"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Ajax, URLs } from '../util/Ajax'

type Props = {}

const Signin: React.FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const [loginid, setLoginid] = useState("")
  const [password, setPassword] = useState("")
  const [_, setCookie] = useCookies(["token"])
  const chgLoginid = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setLoginid(e.target.value)
  const chgPassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(e.target.value)

  function Signin() {
    const echo = (v:any) => console.log(v)
    Ajax.POST(URLs.Signin, {
      loginid: loginid,
      password: password
    }, echo, echo)
    return
    axios.post('https://neras-sta.com/mk6/signin', {
      //axios.post('http://localhost:8080/mk6/signin', {
      loginid: loginid,
      password: password
    })
      .then(res => {
        if (res.data.ok) {
          setCookie("token", res.data.cookie, res.data.options)
          navigate('/notes')
        }
      })
      .catch(e => console.log(e))
  }

  return (
    <Grid>
      <Paper elevation={0} sx={{height: "70vh", width: "300px", m: "50px auto", pt: "200px", backgroundColor: "inherit"}}>
        <Grid container direction="column" justifyContent="flex-start" alignItems="center" >
          <Avatar sx={{bgcolor: teal[200]}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant={"h5"} sx={{m: "30px"}}>
            Your Wiki
          </Typography>
        </Grid>
        <TextField label="Username" variant="standard" fullWidth required value={loginid} onChange={chgLoginid} />
        <TextField type="password" label="Password" variant="standard" fullWidth required value={password} onChange={chgPassword} />
        <Box mt={3}>
          <Button type="submit" color="primary" variant="contained" fullWidth onClick={Signin}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Signin

