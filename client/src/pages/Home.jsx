import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { getPosts, getTags, sortPosts } from '../redux/slices/postsSlice';

export const Home = () => {
  const dispatch = useDispatch();
  const {posts, tags, sortType} = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(getPosts(sortType));
  }, [sortType])
  React.useEffect(() => {
    dispatch(getTags())
  }, [])

  const setSortedPosts = (type) => {
    dispatch(sortPosts(type))
  }

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={sortType === 1 ? 0 : 1} aria-label="basic tabs example">
        <Tab onClick={() => setSortedPosts(1)} label="New" />
        <Tab onClick={() => setSortedPosts(-1)} label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((item, idx) =>
          isPostsLoading ? (
            <Post key={idx} isLoading={true} />
          ) : <Post
          id={item._id}
          title={item.title}
          imageUrl={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : ""}
          user={item.user}
          createdAt={item.createdAt}
          viewsCount={item.viewsCount}
          commentsCount={3}
          tags={item.tags}
          isLoading={false}
          isEditable={userData?._id === item.user._id}
        /> )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
