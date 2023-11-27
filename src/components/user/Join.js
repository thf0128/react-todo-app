import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  // 리다이렉트 사용하기
  const redirection = useNavigate();
  const API_BASE_URL = BASE + USER;

  // 상태변수로 회원가입 입력값 관리
  const [userValue, setUserValue] = useState({
    userName: '',
    password: '',
    email: '',
  });

  // 검증 메세지에 대한 상태변수 관리
  // 입력값과 메세지는 따로 상태 관리(메세지는 백엔드로 보내줄 필요 없음.)
  // 메세지 영역이 각 입력창마다 있기 때문에 객체를 활용해서 한 번에 관리.
  const [message, setMessage] = useState({
    userName: '', //이름쪽 프로퍼티
    password: '',
    passwordCheck: '',
    email: '',
  });

  // 검증완료 체크에 대한 상태변수 관리
  // 각각의 입력창마다 검증 상태를 관리해야 하기 때문에 객체로 선언.
  // 상태를 유지하려는 이유 -> 마지막에 회원 가입 버튼을 누를 때 까지 검증 상태를 유지해야 하기 때문.
  const [correct, setCorrect] = useState({
    userName: false,
    password: false,
    passwordCheck: false,
    email: false,
  });

  // 검증된 데이터를 각각의 상태변수에 저장해 주는 함수.
  const saveInputState = ({ key, inputValue, flag, msg }) => {
    // 입력값 세팅
    // 패스워드 확인 입력값은 굳이 userValue 상태로 유지할 필요가 없기 떄문에
    // 임의의 문자열 'pass'를 넘기고 있습니다. -> pass가 넘어온다면 setUserValue()를 실행하지 않겠다.
    inputValue !== 'pass' &&
      setUserValue((oldVal) => {
        return { ...oldVal, [key]: inputValue };
      });

    // 메세지 세팅
    setMessage((oldMsg) => {
      return { ...oldMsg, [key]: msg }; // key 변수의 값을 프로퍼티 이름으로 활용.
    });

    // 입력값 검증 상태 세팅
    setCorrect((oldCorrect) => {
      return { ...oldCorrect, [key]: flag };
    });
  };

  // 이름 입력창 체인지 이벤트 핸들러
  const nameHandler = (e) => {
    const nameRegex = /^[가-힣]{2,5}$/; // (/^ 시작) ($ 끝) 한글최소 2자 최대5자
    const inputValue = e.target.value;

    // 입력값 검증
    let msg; // 검증 메세지를 저장할 변수
    let flag = false; // 입력값 검증 여부 체크 변수 true로 바뀌어야 검증이 됨

    if (!inputValue) {
      // undefined, null, NaN, ""이면 논리표현식에서 false로 해석됨
      msg = '유저 이름은 필수입니다.';
    } else if (!nameRegex.test(inputValue)) {
      msg = '2~5글자 사이의 한글로 작성하세요!';
    } else {
      msg = '사용 가능한 이름입니다.';
      flag = true;
    }

    // 객체  프로퍼티에서 세팅하는 변수의 이름과 키값이 동일한 경우에는
    // 콜론 생략이 가능.
    saveInputState({
      key: 'userName',
      inputValue, // 프로퍼티명 써줄 필요없음 하나만 쓰면됨
      msg,
      flag,
    });
  };

  // 이메일 중복 체크 서버 통신 함수
  const fetchDuplicateCheck = (email) => {
    let msg = '',
      flag = false;
    fetch(`${API_BASE_URL}/check?email=${email}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((json) => {
        // console.log(json);
        if (json) {
          msg = '이메일이 중복되었습니다.';
        } else {
          msg = '사용 가능한 이메일 입니다.';
          flag = true;
        }
        saveInputState({
          key: 'email',
          inputValue: email,
          msg,
          flag,
        });
      })
      .catch((err) => {
        console.log('서버 통신이 원활하지 않습니다.');
      });
  }; // 요청은 GET방식으로 보낼 것

  // 이메일 입력창 체인지 이벤트 핸들러
  const emailHandler = (e) => {
    const inputValue = e.target.value;
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    let msg;
    let flag = false;

    if (!inputValue) {
      msg = '이메일은 필수값 입니다!';
    } else if (!emailRegex.test(inputValue)) {
      msg = '이메일 형식이 올바르지 않습니다.';
    } else {
      // 이메일 중복 체크
      fetchDuplicateCheck(inputValue);
    }

    saveInputState({
      key: 'email',
      inputValue,
      msg,
      flag,
    });
  };

  // 패스워드 입력창 체인지 이벤트 핸들러
  const passwordHandler = (e) => {
    // 패스워드가 변경됐다? -> 패스워드 확인란을 비우고 시작하자.
    document.getElementById('password-check').value = ''; // 이벤트 내부 렌더링 되고 난 다음 지목
    // 동작 시점은 렌더링되고 사용자가 입력할 때 document 실행될 것
    setMessage({ ...message, passwordCheck: '' });
    setCorrect({ ...correct, passwordCheck: false }); // 아까 그검증은 무효 다시 false로 바꿔야됨

    const inputValue = e.target.value;
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/; //8~20자의 영문, 특수문자 숫자

    let msg,
      flag = false;
    if (!inputValue) {
      msg = '비밀번호는 필수입니다.';
    } else if (!pwRegex.test(inputValue)) {
      msg = '8글자 이상의 영문, 숫자, 특수문자를 포함해 주세요.';
    } else {
      msg = '사용 가능한 비밀번호 입니다.';
      flag = true;
    }

    saveInputState({
      key: 'password',
      inputValue,
      msg,
      flag,
    });
  };

  // 비밀번호 확인란 체인지 이벤트 핸들러
  const pwCheckHandler = (e) => {
    let msg;
    let flag = false;
    if (!e.target.value) {
      msg = '비밀번호 확인란은 필수입니다.';
    } else if (userValue.password !== e.target.value) {
      msg = '비밀번호가 일치하지 않습니다.';
    } else {
      msg = '패스워드가 일치합니다.';
      flag = true;
    }

    saveInputState({
      key: 'passwordCheck',
      inputValue: 'pass', // 얘는 굳이 보내고싶지 않음
      msg,
      flag,
    });
  };

  // 4개의 입력칸이 모두 검증에 통과했는지 여부를 검사
  const isValid = () => {
    for (const key in correct) {
      //correct 객체를 선언할때 변수에 key값이 온다.
      const flag = correct[key];
      if (!flag) return false;
    }
    return true; // 반복문 4개를 돌 때 (username, password, email, check) 하나라도 false면 통과 안시켜주겠다.
  };

  // 회원 가입 처리 서버 요청
  const fetchSignUpPost = () => {
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(userValue), // json 문자열화
    }).then((res) => {
      if (res.status === 200) {
        alert('회원가입에 성공했습니다.');
        // 로그인 페이지로 리다이렉트
        // window.location.href = '/login';
        redirection('/login'); // useNavigate()로 자연스럽게 경로 이동 처리
      } else {
        alert('서버와의 통신이 원활하지 않습니다. 관리자에게 문의하세요.');
      }
    });
  };

  // 회원가입 버튼 클릭 이벤트 핸들러
  const joinButtonClickHandler = (e) => {
    e.preventDefault(); // submit 동작시키지 못하게끔

    if (isValid()) {
      // 통과
      //회원 가입 서버 요청
      fetchSignUpPost();
    } else {
      alert('입력란을 다시 확인해 주세요!');
    }
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <form noValidate>
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
              계정 생성
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              autoComplete='fname'
              name='username'
              variant='outlined'
              required
              fullWidth
              id='username'
              label='유저 이름'
              autoFocus
              onChange={nameHandler}
            />
            <span
              style={
                correct.userName
                  ? { color: 'green' } //true면 초록 false면 빨간색
                  : { color: 'red' }
              }
            >
              {message.userName}
            </span>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='이메일 주소'
              name='email'
              autoComplete='email'
              onChange={emailHandler}
            />
            <span
              style={
                correct.email // correct 상태변수 안에있는 email이 true면 green false면 red
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {message.email}
            </span>
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
              label='패스워드'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={passwordHandler}
            />
            <span
              id='check-span'
              style={
                correct.passwordCheck ? { color: 'green' } : { color: 'red' }
              }
            >
              {message.password}
            </span>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password-check'
              label='패스워드 확인'
              type='password'
              id='password-check'
              autoComplete='check-password'
              onChange={pwCheckHandler}
            />
            <span
              id='check-span'
              style={correct.password ? { color: 'green' } : { color: 'red' }}
            >
              {message.passwordCheck}
            </span>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
              onClick={joinButtonClickHandler} // 회원가입 버튼
            >
              계정 생성
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify='flex-end'
        >
          <Grid item>
            <Link
              href='/login'
              variant='body2'
            >
              이미 계정이 있습니까? 로그인 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
