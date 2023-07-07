import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {Grid, Box, AppBar, Paper, Tab} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import {AddCircle, Autorenew, Search, FlashAuto} from '@mui/icons-material'
import {Drawer, Typography, Button, Stack, Chip, Modal} from '@mui/material'
import VCard from './VCard'
import DModal from './DModal'

// TODO 1. モデル テーブルカラムを作る
// TODO 2. 入力時のonChangeイベントで、URLサムネをOGPで取得
// TODO 3. タグ追加、検索
// TODO 4. カテゴリ追加モーダルのボタン、下のバー
// TODO 5. 検索モーダル、下のバー
export type Contents = {
  id: number
  category: string
  thumbnail?: string
  title: string
  dataUrl: string[]
  tags: string[]
  viewCnt: number
  likeCnt: number
}

type Datas = {
  dataContent: Contents[]
  tags: string[]
}

type Props = {}
const Tabs: React.FC<Props> = (): JSX.Element => {

  const [cookie, setCookie] = useCookies(["token"])
  const [dataContent, setDataContent] = useState<Contents[]>([])
  const [dataOrigin, setDataOrigin] = useState<Contents[]>([])
  const [dataDetail, setDataDetail] = useState<Contents>({
    id: -99,
    category: 'video',
    thumbnail: '_',
    title: '_',
    dataUrl: [''],
    tags: [''],
    viewCnt: 0,
    likeCnt: 0
  })
  const [tagsCondition, setTagsCondition] = useState<string[]>([])
  const [tagsAll, setTagsAll] = useState<string[]>([])

  // ini
  useEffect(() => getDatas(), [])

  function getDatas() {
    //axios.post('http://localhost:8080/mk6/getdata', {
    axios.post('https://neras-sta.com/mk6/getdata', {
      token: cookie.token,
    })
    //axios.get<Datas>('http://localhost:8080/mk6/getdata', {withCredentials: true})
      .then(res => {
        setDataContent(res.data.dataContent)
        setDataOrigin(res.data.dataContent)
        setTagsAll(res.data.tags)
      })
      .catch(e => {
        // TODO あとで消す
        console.log(e)
        let tes: Contents[] = [
          {id: 0, category: 'video', thumbnail: '00000', title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 1, category: 'video', thumbnail: 'test', title: 'aaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 2, category: 'video', thumbnail: 'test', title: 'bbb', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 6, category: 'video', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 7, category: 'video', thumbnail: 'test', title: 'ww', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 1, category: '2d', thumbnail: 'test', title: 'aaaa', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 5, category: 'video', thumbnail: 'test', title: 'dddd', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 6, category: '2d', thumbnail: 'test', title: 'eeeee', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
          {id: 7, category: '2d', thumbnail: 'test', title: 'ww', dataUrl: ['test'], tags: ["aa"], viewCnt: 0, likeCnt: 0},
        ]
        let tasCnadidate = ["test1", "aa", "aaaa"]

        setDataContent(tes)
        setDataOrigin(tes)
        setTagsAll(tasCnadidate)
      })
  }

  // tab
  const [tabIdx, setTabIdx] = useState('3')
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    order()
    setTabIdx(newValue)
  }

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    justifyContent: 'center'
  }
  // modal open
  function moddalOpen() {
    const targetDetail: Contents = JSON.parse(sessionStorage.getItem('detail') ?? "")
    setDataDetail(targetDetail)
    setModalOpen(true)
  }

  // modal close
  function modalClose() {
    setModalOpen(false)
    // get latest fav
    const targetDetail: Contents = JSON.parse(sessionStorage.getItem('detail') ?? "")
    let elem: any = document.querySelector("#mk6v2-content-id-" + targetDetail.id + " > div > div > div > div:nth-child(3) > div > p")
    elem.innerHTML = sessionStorage.getItem('likeCnt') ?? ""
  }

  // search drawer
  const [searchOpen, setSearchOpen] = useState(false)
  const toggleDrawer = (flg: boolean) => (_: React.KeyboardEvent | React.MouseEvent) => setSearchOpen(!flg)

  // search
  function search(tag: string, vector: boolean) {
    if (vector) { // add condition
      setTagsAll(tagsAll.filter(v => v !== tag))
      setTagsCondition([...tagsCondition, tag])
    } else { // remove condition
      setTagsAll([...tagsAll, tag])
      setTagsCondition(tagsCondition.filter(v => v !== tag))
    }
  }

  // search reset
  function searchReset() {
    setTagsAll([...tagsAll, ...tagsCondition])
    setTagsCondition([])
  }

  // add
  function add() {
    // XXX 追加画面を作る
    console.log('add')
  }

  // order
  function order() {
    setDataContent(dataOrigin)
  }

  // shuffle
  function shuffleDatas() {
    setDataContent(shuffle(dataContent))
  }
  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  // TODO めも publicへのアクセス
  // `${process.env.PUBLIC_URL}/logo512.png`

  return (
    <Box>
      <TabContext value={tabIdx}>
        {/** tab bar */}
        <AppBar>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <TabList onChange={handleChange} centered>
              <Tab label="video" value="1" />
              <Tab label="2d" value="2" />
              <Tab label="dummmy" value="3" />
            </TabList>
          </Box>
        </AppBar>

        {/** body */}
        {Array.from([{idx: "1", type: "video"}, {idx: "2", type: "2d"}]).map((tab, idx) => (
          <TabPanel key={idx} value={tab.idx} sx={{pt: 8, pb: 8}}>
            <Grid container columns={{xs: 4, sm: 8, md: 12}} justifyContent='center' alignItems='center'>
              {dataContent
                .filter(v => tab.type === v.category) // tab type
                .filter(v => { // tag search
                  return tagsCondition.length === 0
                    ? true
                    : tagsCondition.every(s => v.tags.includes(s))
                })
                .map((v, idx) => (
                  <Grid id={"mk6v2-content-id-" + v.id} item xs={2} sm={4} md={3} key={idx} sx={{p: 1}}>
                    <VCard {...v} />
                  </Grid>
                ))}
            </Grid>
          </TabPanel>
        ))}
      </TabContext>

      {/** app bar */}
      <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 2}} elevation={3}>
        <BottomNavigation showLabels>
          {/** XXX 追加機能はあとで
          <BottomNavigationAction label="add" icon={<AddCircle />} onClick={add} />
            */}
          <BottomNavigationAction label="order" icon={<FlashAuto onClick={order} />} />
          <BottomNavigationAction label="search" icon={<Search onClick={() => setSearchOpen(true)} />} />
          <BottomNavigationAction label="shuffle" icon={<Autorenew onClick={shuffleDatas} />} />
        </BottomNavigation>
      </Paper>

      {/** search drawer */}
      <Drawer anchor='bottom' open={searchOpen} onClose={toggleDrawer(searchOpen)}>
        <Box sx={{pt: 1, pr: 1, pl: 1, pb: 7}}>
          <Box sx={{p: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Typography color='secondary'>search condition</Typography>
              <Button variant='text' onClick={searchReset}>reset</Button>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {tagsCondition.length === 0 ? "no data" : tagsCondition.map((v, idx) => (
                <Chip key={idx} label={v} onClick={() => search(v, false)} />
              ))}
            </Stack>
          </Box>
          <Box sx={{p: 1}}>
            <Typography color='secondary'>candidate</Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" >
              {tagsAll.length === 0 ? "no data" : tagsAll.map((v, idx) => (
                <Chip key={idx} label={v} onClick={() => search(v, true)} />
              ))}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/** detail modal */}
      <Button id="detail-modal-open" sx={{display: "none"}} onClick={moddalOpen}></Button>
      <Button id="detail-modal-close" sx={{display: "none"}} onClick={modalClose}></Button>
      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={{...modalStyle}}>
          <DModal {...dataDetail} />
        </Box>
      </Modal>
    </Box>
  )
}
export default Tabs
