import { DbSong } from '../../db.ts'
import { ListItem } from './ListItem.tsx'
import { Link } from 'react-router'
import { navigationPaths } from '../../navigationPaths.ts'
import { SvgIconButton } from '../../components/SvgIcon.tsx'
import classes from './styles.module.css'

export const SongItem = ({song, onDelete}: { song: DbSong, onDelete: () => void }) => {
  return (
    <ListItem
      className={classes.listLi}
      clickable
    >
      <Link
        className="link--disabled"
        to={navigationPaths.songs.single(song.id)}
        style={{
          flex: 1,
          textAlign: 'left',
          padding: '12px',
        }}
      >
        {song.name}
      </Link>

      <SvgIconButton
        size={20}
        name={'delete'}
        cursor="pointer"
        onClick={() => onDelete()}
        style={{
          marginRight: '12px',
        }}
      />
    </ListItem>
  )
}