import './feed.css';
import { Posts } from '../../fakeData';
import { Share } from '@material-ui/icons';
import Post from '../../components/post/Post';

export default function Feed() {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
