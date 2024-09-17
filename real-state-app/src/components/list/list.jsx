import './list.scss';
import Card from '../card/card';

const List = ({ posts }) => (
  <div className='list'>
    {posts.map((item) => (
      <Card key={item.id} item={item} />
    ))}
  </div>
);

export default List;
