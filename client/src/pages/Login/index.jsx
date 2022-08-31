import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./Login.module.scss";
import { authUser } from "../../redux/slices/authSlice";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch()
  const { isAuth } = useSelector(state => state.auth)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const data = await dispatch(authUser(values))
    if(!data.payload){
      return alert('Some problem with authentication')
    }
    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
    } 
  };

  if(isAuth) {
    return <Navigate to="/" />
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Sign In to account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", { required: "Write your email" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register("password", { required: "Write your password" })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Sign In
        </Button>
      </form>
    </Paper>
  );
};
