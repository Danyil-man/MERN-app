import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import instanceApi from '../../redux/api';

export const AddPost = () => {
  const { isAuth } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState(null);
  const {id} = useParams();
  const isEditting = Boolean(id)

  const inputRef = React.useRef(null)

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append('image', file);
      const {data} = await instanceApi.post("/upload", formData);
      setImageUrl(data.url)
    } catch (error) {
      console.log(error);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        text, 
        tags
      }
      const { data } = isEditting ?  await instanceApi.patch(`/posts/${id}`, fields) :  await instanceApi.post('/posts', fields);
      const _id = isEditting ? id : data._id;
      navigate(`/posts/${_id}`)
    } catch (error) {
      console.log(error);      
    }
  }

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  React.useEffect(() => {
    if(id){
      instanceApi.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(','))
      })
    }
  }, [])

  if(!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputRef.current.click()} variant="outlined" size="large">
        Load preview
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Delete
        </Button>
        <img className={styles.image} src={`http://localhost:5000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Header of article..."
        value={title}
        onChange={ e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField value={tags} onChange={ e => setTags(e.target.value)} classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditting ? "Save" : "Post"}
        </Button>
        <Link to="/">
          <Button size="large">Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
