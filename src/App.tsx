import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { SongListView } from './views/SongListView/SongListView'
import { SongShowView } from './views/SongShowView/SongShowView'
import { useInitDb } from './db'
import { navigationPaths } from './navigationPaths'

const App = () => {
  const dbReady = useInitDb()
  if (!dbReady) return 'Loading...'

  return (
    <BrowserRouter>
      <Routes>
        <Route path={navigationPaths.songs.root} element={<SongListView/>} />
        <Route path={navigationPaths.songs.single(':id')} element={<SongShowView/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
