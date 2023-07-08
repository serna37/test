import React, {useEffect, useState} from 'react'
import {Grid, Box, AppBar, Paper, Tab, TextField} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import {AddCircle, Search} from '@mui/icons-material'
import ChatIcon from '@mui/icons-material/Chat'
import {Drawer, Typography, Button, Stack, Chip, Modal} from '@mui/material'
import VCard from './VCard'
import DModal from './DModal'
import Chatroomlist from './Chatroomlist'
import {Ajax} from '../util/Ajax'

export type Contents = {
  categoryId: number
  id: number
  title: string
  content: string
  tags: ContentTags[]
}

type DataAll = {
  Id: number
  UsrId: number
  Name: string
  DelFlg: boolean
  AllContent: {
    Id: number
    UsrId: number
    Title: string
    Contents: string
    Tags: ContentTags[]
  }[]
}
type ContentTags = {
  Id: number
  ContentId: number
  TagId: number
  MstTags: Tag
}

type TagsAll = {
  Id: number
  MstTags: Tag[]
}
type Tag = {
  Id: number
  Name: string
}

type Props = {}
const Tabs: React.FC<Props> = (): JSX.Element => {

  // all datas
  const [dataall, setDataall] = useState<DataAll[]>([])

  // candidate tags (each category)
  const [tagsall, setTagsall] = useState<TagsAll[]>([])

  const [tagsPerCategory, setTagsPerCategory] = useState<TagsAll>()
  const [tagsCondition, setTagsCondition] = useState<Tag[]>([])


  // free search word
  const [searchword, setSearchword] = useState("")

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

  // ini
  useEffect(() => getDatas(), [])

  function getDatas() {
    const Session = JSON.parse(window.sessionStorage.getItem("session") ?? "")
    Ajax.POST("/usr/getcatetag", {
      "id": Session.userid
    }, (data: any) => {
      if (data.status) {
        console.debug(data.message)
        return
      }
      console.debug(data)
      setTagsall(data)
    }, (e: any) => {
      console.debug(e.message)
    })
    Ajax.POST("/usr/getalldata", {
      "id": Session.userid
    }, (data: any) => {
      if (data.status) {
        console.debug(data.message)
        return
      }
      console.debug(data)
      setDataall(data)
      setTagsPerCategory(tagsall.find(v => v.Id == dataall[~~tabIdx].Id))
    }, (e: any) => {
      console.debug(e.message)
    })
  }

  // tab
  const [tabIdx, setTabIdx] = useState('0')
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    //order()
    setTabIdx(newValue)
    setTagsPerCategory(tagsall.find(v => v.Id == dataall[~~newValue].Id))
    setTagsCondition([])
    setSearchword("")
  }

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    justifyContent: 'center'
  }
  // modal close
  function modalClose() {
    setModalOpen(false)
  }

  // search drawer
  const [searchOpen, setSearchOpen] = useState(false)
  const toggleDrawer = (flg: boolean) => (_: React.KeyboardEvent | React.MouseEvent) => {
    if (tagsPerCategory === undefined) {
      setTagsPerCategory(tagsall.find(v => v.Id == dataall[~~tabIdx].Id))
    }
    setSearchOpen(!flg)
  }

  // search
  function search(tag: Tag, vector: boolean) {
    if (vector) { // add condition
      setTagsPerCategory({
        Id: tagsPerCategory?.Id ?? 0,
        MstTags: tagsPerCategory?.MstTags.filter(v => v.Id !== tag.Id) ?? []
      })
      setTagsCondition([...tagsCondition, tag])
    } else { // remove condition
      let arr = tagsPerCategory?.MstTags ?? []
      arr.push(tag)
      setTagsPerCategory({
        Id: tagsPerCategory?.Id ?? 0,
        MstTags: arr
      })
      setTagsCondition(tagsCondition.filter(v => v.Id !== tag.Id))
    }
  }

  // search reset
  function searchReset() {
    setTagsPerCategory(tagsall.find(v => v.Id == dataall[~~tabIdx].Id))
    setTagsCondition([])
  }


  // text search
  function textSearch(newValue: string) {
    setSearchword(newValue)
  }

  // add
  function add() {
    const cateId: number = dataall[~~tabIdx].Id
    setCntnt({...cntnt, categoryId: cateId})
    setModalOpen(true)
  }


  const [chatroomlistDisp, setChatroomlistDisp] = useState(false)
  function chatroomlistOpen() {
    setChatroomlistDisp(true)
  }

  function chatroomlistClose() {
    setChatroomlistDisp(false)
  }

  return (
    <Box>
      <TabContext value={tabIdx}>

        {/** tab bar */}
        <AppBar>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <TabList onChange={handleChange} centered>
              {dataall
                .sort((x, y) => x.Id - y.Id)
                .map((v, i) => (
                  <Tab key={v.Id} label={v.Name} value={i + ""} />
                ))}
            </TabList>
          </Box>
        </AppBar>


        {/** body */}
        {dataall.map((v, i) => (
          <TabPanel key={v.Id} value={i + ""} sx={{pt: 8, pb: 8}}>
            <Grid container columns={{xs: 4, sm: 8, md: 12}} justifyContent='center' alignItems='center'>
              {v.AllContent
                .sort((x, y) => x.Id - y.Id)
                .filter(content => { // title search
                  return searchword === undefined || searchword == ""
                    ? true
                    : content.Title.toLowerCase().includes(searchword.toLowerCase())
                })
                .filter(content => { // tag search
                  return tagsCondition.length === 0
                    ? true
                    : tagsCondition.some(s => content.Tags.findIndex(tt => tt.MstTags.Id == s.Id) != -1)
                })
                .map((content, idx) => (
                  <Grid item xs={2} sm={4} md={3} key={idx} sx={{p: 1}}>
                    <VCard categoryId={0} id={content.Id} title={content.Title} content={content.Contents} tags={content.Tags} />
                  </Grid>
                ))}
            </Grid>
          </TabPanel>
        ))}
      </TabContext>


      {/** app bar */}
      <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 2}} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction label="chat" icon={<ChatIcon />} onClick={chatroomlistOpen} />
          <BottomNavigationAction label="search" icon={<Search onClick={toggleDrawer(false)} />} />
          <BottomNavigationAction label="add" icon={<AddCircle />} onClick={add} />
        </BottomNavigation>
      </Paper>

      {/** search drawer */}
      <Drawer anchor='bottom' open={searchOpen} onClose={toggleDrawer(searchOpen)}>
        <Box sx={{pt: 1, pr: 1, pl: 1, pb: 7}}>
          <Box sx={{p: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography color='secondary'>
                title fuzzy search
              </Typography>
            </Box>
            <TextField label="" variant="standard" fullWidth value={searchword} onChange={e => textSearch(e.target.value)} />

          </Box>
          <Box sx={{p: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography color='secondary'>
                search condition
              </Typography>
              <Button variant='text' onClick={searchReset}>
                tag reset
              </Button>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {tagsCondition.length === 0 ? "no data" : tagsCondition.map((v) => (
                <Chip key={v.Id} label={v.Name} onClick={() => search(v, false)} />
              ))}
            </Stack>
          </Box>
          <Box sx={{p: 1}}>
            <Typography color='secondary'>
              candidate
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" >
              {tagsPerCategory?.MstTags.length === 0 ? "no data" : tagsPerCategory?.MstTags
                .sort((x, y) => x.Id - y.Id)
                .map((v) => (
                  <Chip key={v.Id} label={v.Name} onClick={() => search(v, true)} />
                ))}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/** detail modal */}
      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={{...modalStyle, height: '80%', backgroundColor: 'gray'}}>
          <DModal {...cntnt} />
        </Box>
      </Modal>

      <Modal open={chatroomlistDisp} onClose={chatroomlistClose}>
        <Box sx={{...modalStyle, height: '50%', width: '90%', backgroundColor: 'rgb(128, 128, 128, 0.8)'}}>
          <Chatroomlist />
        </Box>
      </Modal>
    </Box>
  )
}
export default Tabs
