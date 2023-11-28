import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config'; // host-configs에서 가져옴
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';

const Login = () => {
  const redirection = useNavigate();

  const { onLogin } = useContext(AuthContext);

  const REQUEST_URL = BASE + USER + '/signin';

  // 서버에 비동기 로그인 요청(AJAX 요청)
  // 함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다.
  // async로 감싸주어야 await 함수 사용 가능
  const fetchLogin = async () => {
    // 이메일, 비밀번호 입력 태그 얻어오기
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    // awate는 async로 선언된 함수에서만 사용이 가능합니다.
    // awate는 프로미스 객체가 처리될 때까지 기다립니다.
    // 프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
    // then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽습니다.
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });

    if (res.status === 400) {
      const text = await res.text(); // 반환값 바로 활용
      alert(text);
      return;
      // await 함수는 순서를 보장받을 수 있음 위부터 실행되지 않으면 밑에거 절대 실행되지 않음
    }

    const { token, userName, email, role } = await res.json(); // 서버에서 온 json 읽기

    // Context API를 사용하여 로그인 상태를 업데이트 합니다.
    onLogin(token, userName, role);

    // json에 담긴 인증정보를 클라이언트에 보관
    // 1. 로컬 스토리지 - 브라우저가 종료되어도 보관됨 - 로그인 되어있음
    // 2. 세션 스토리지 - 브라우저가 종료되면 사라짐 - 로그인 다시해야됨
    // localStorage.setItem('ACCESS_TOKEN', token);
    // localStorage.setItem('LOGIN_USERNAME', userName);
    // localStorage.setItem('USER_ROLE', role);

    //홈으로 리다이렉트
    redirection('/');

    // 위에 await 코드가 밑에 있는 코드 그대로 대체할 수 있음

    // fetch(REQUEST_URL, {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify({
    //     email: $email.value, // 전달하고자 하는 데이터 email, password // DTO와 동일한 이름이여야함
    //     password: $password.value,
    //   }),
    // })
    //   .then((res) => {
    //     //response객체를 받아서 성공 혹은 실패 구분
    //     if (res.status === 400) {
    //       // 가입이 안되어있거나, 비번 틀린 경우
    //       return res.text(); // 에러메세지는 text이기 때문에 text()를 리턴.
    //       // Promise<String>객체를 가지고 있으면 .then 한번더 쓸수있음
    //     }
    //     return res.json(); // 400 에러가 아니라면 로그인 성공이기 떄문에 json을 리턴.
    //   })
    //   .then((result) => {
    //     //이 result에 첫 .then 값의 결과가 옴
    //     if (typeof result === 'string') {
    //       alert(result);
    //       return;
    //     }
    //     console.log(result);
    //   });
  };

  // 로그인 요청 핸들러
  const loginHandler = (e) => {
    e.preventDefault(); // submit 막기

    // 서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            component='h1'
            variant='h5'
          >
            로그인
          </Typography>
        </Grid>
      </Grid>

      <form
        noValidate
        onSubmit={loginHandler}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='email address'
              name='email'
              autoComplete='email'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='on your password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              로그인
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
