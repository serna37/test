import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signin from '../components/Signin'
import Tabs from '../components/Tabs'

export default function Router() {
  return (
    <div>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Signin />}></Route>
          <Route path='/notes' element={<Tabs />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
