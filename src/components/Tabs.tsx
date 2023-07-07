import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {Grid, Box, AppBar, Paper, Tab, TextField} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import {AddCircle, Autorenew, Search, FlashAuto} from '@mui/icons-material'
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
    //      {
    //      Id: number
    //      ContentId: number
    //      TagId: number
    //      MstTags: {
    //        Id: number
    //        Name: string
    //      }
    //    }[]
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

  //  const [cookie, setCookie] = useCookies(["token"])
  //  const [dataContent, setDataContent] = useState<Contents[]>([])
  //  const [dataOrigin, setDataOrigin] = useState<Contents[]>([])
  //  const [dataDetail, setDataDetail] = useState<Contents>({
  //    id: -99,
  //    category: 'video',
  //    thumbnail: '_',
  //    title: '_',
  //    dataUrl: [''],
  //    tags: [''],
  //    viewCnt: 0,
  //    likeCnt: 0
  //  })

  // ini
  useEffect(() => getDatas(), [])

  function getDatas() {
    const Session = JSON.parse(window.sessionStorage.getItem("session") ?? "")
    Ajax.POST("/usr/getcatetag", {
      "id": Session.userid
    }, (data: any) => {
      if (data.status) {
        console.log(data.message)
        return
      }
      console.debug(data)
      setTagsall(data)
    }, (e: any) => {
      console.log(e.message)
    })
    Ajax.POST("/usr/getalldata", {
      "id": Session.userid
    }, (data: any) => {
      if (data.status) {
        console.log(data.message)
        return
      }
      console.debug(data)
      setDataall(data)
      setTagsPerCategory(tagsall.find(v => v.Id == dataall[~~tabIdx].Id))
    }, (e: any) => {
      console.log(e.message)
    })
    //axios.post('http://localhost:8080/mk6/getdata', {
    //    axios.post('https://neras-sta.com/mk6/getdata', {
    //      token: cookie.token,
    //    })
    //    //axios.get<Datas>('http://localhost:8080/mk6/getdata', {withCredentials: true})
    //      .then(res => {
    //        setDataContent(res.data.dataContent)
    //        setDataOrigin(res.data.dataContent)
    //        setTagsAll(res.data.tags)
    //      })
    //      .catch(e => {
    //        // TODO あとで消す
    //        console.log(e)
    //        let tes: Contents[] = [
    //          {id: 0, category: 'video', thumbnail: '00000', title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 1, category: 'video', thumbnail: 'test', title: 'aaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 2, category: 'video', thumbnail: 'test', title: 'bbb', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 7, category: 'video', thumbnail: 'test', title: 'ww', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 1, category: '2d', thumbnail: 'test', title: 'aaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 5, category: 'video', thumbnail: 'test', title: 'dddd', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 6, category: '2d', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //          {id: 7, category: '2d', thumbnail: 'test', title: 'ww', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
    //        ]
    //        let tasCnadidate = ["test1", "aa", "aaaa"]
    //
    //        setDataContent(tes)
    //        setDataOrigin(tes)
    //        setTagsAll(tasCnadidate)
    //      })
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
  //  // modal open
  //  function moddalOpen() {
  //    const targetDetail: Contents = JSON.parse(sessionStorage.getItem('detail') ?? "")
  //    setDataDetail(targetDetail)
  //    setModalOpen(true)
  //  }
  //
  //  // modal close
  function modalClose() {
    setModalOpen(false)
    // get latest fav
    //    const targetDetail: Contents = JSON.parse(sessionStorage.getItem('detail') ?? "")
    //    let elem: any = document.querySelector("#mk6v2-content-id-" + targetDetail.id + " > div > div > div > div:nth-child(3) > div > p")
    //    elem.innerHTML = sessionStorage.getItem('likeCnt') ?? ""
  }

  // search drawer
  const [searchOpen, setSearchOpen] = useState(false)
  const toggleDrawer = (flg: boolean) => (_: React.KeyboardEvent | React.MouseEvent) => {
    console.log(tagsPerCategory)
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

    console.log(tagsCondition)
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
    // XXX 追加画面を作る
    const cateId:number = dataall[~~tabIdx].Id

    setCntnt({...cntnt, categoryId:cateId})
    setModalOpen(true)
    console.log('add')
  }


  const [chatroomlistDisp, setChatroomlistDisp] = useState(false)
  function chatroomlistOpen() {
    setChatroomlistDisp(true)
  }

  function chatroomlistClose() {
    setChatroomlistDisp(false)
  }

  //  // order
  //  function order() {
  //    setDataContent(dataOrigin)
  //  }
  //
  //  // shuffle
  //  function shuffleDatas() {
  //    setDataContent(shuffle(dataContent))
  //  }
  //  const shuffle = ([...array]) => {
  //    for (let i = array.length - 1; i >= 0; i--) {
  //      const j = Math.floor(Math.random() * (i + 1));
  //      [array[i], array[j]] = [array[j], array[i]]
  //    }
  //    return array
  //  }

  // TODO めも publicへのアクセス
  // `${process.env.PUBLIC_URL}/logo512.png`

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
              {/**
//              {datacontent
//                .filter(v => tab.type === v.category) // tab type
//                .filter(v => { // tag search
//                  return tagscondition.length === 0
//                    ? true
//                    : tagscondition.every(s => v.tags.includes(s))
//                })
//                .map((v, idx) => (
//                  <grid id={"mk6v2-content-id-" + v.id} item xs={2} sm={4} md={3} key={idx} sx={{p: 1}}>
//                    <vcard {...v} />
//                  </grid>
//                ))}
//                */}
            </Grid>
          </TabPanel>
        ))}
      </TabContext>


      {/** app bar */}
      <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 2}} elevation={3}>
        <BottomNavigation showLabels>
          {/** XXX 追加機能はあとで
             TODO タグ追加/編集、カテゴリ追加/編集はbackendはある、フロントまだ
             TODO tagひもづけ機能が必要
          <BottomNavigationAction label="order" icon={<FlashAuto onClick={order} />} />
          <BottomNavigationAction label="shuffle" icon={<Autorenew onClick={shuffleDatas} />} />
            */}
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
              {tagsCondition.length === 0 ? "no data" : tagsCondition.map((v, idx) => (
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
                .map((v, idx) => (
                  <Chip key={v.Id} label={v.Name} onClick={() => search(v, true)} />
                ))}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/** detail modal */}
      {/**
      <Button id="detail-modal-open" sx={{display: "none"}} onClick={moddalOpen}></Button>
      <Button id="detail-modal-close" sx={{display: "none"}} onClick={modalClose}></Button>
        */}

      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={{...modalStyle, height:'80%', backgroundColor:'gray'}}>
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
