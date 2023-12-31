import React, { useEffect, useState } from 'react';

// 새로운 전역 컨텍스트 생성
const AuthContext = React.createContext({
  isLoggedIn: false, // 로그인 했는지의 여부 추적
  userName: '',
  onLogout: () => {}, // 함수의 형태다 표현
  onLogin: (email, password) => {},
});

// 위에서 생성한 Context를 제공할 수 있는 provider
// 이 컴포넌트를 통해 자식 컴포넌트에게 인증 상태와 관련된 함수들을 전달할 수 있음.
export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(''); // 초기값은 비어있음.

  //컴포넌트가 렌더링 될 떄 localStorage에서 로그인 정보를 가지고 와서 상태를 설정.
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === '1') {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem('LOGIN_USERNAME'));
    }
  }, []);

  //로그아웃 핸들러
  const logoutHandler = () => {
    localStorage.clear(); // 로컬스토리지 내용 전체 삭제
    setIsLoggedIn(false);
    setUserName('');
  };

  // 로그인 핸들러
  const loginHandler = (token, userName, role) => {
    localStorage.setItem('isLoggedIn', '1'); // 데이터가 있으면 로그인중이다를 표현
    //json에 담긴 인증정보를 클라이언트에 보관
    // 1. 로컬 스토리지 - 브라우저가 종료되어도 보관됨.
    // 2. 세션 스토리지 - 브라우저가 종료되면 사라짐.
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('LOGIN_USERNAME', userName);
    localStorage.setItem('USER_ROLE', role);
    setIsLoggedIn(true);
    setUserName(userName);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        onLogout: logoutHandler,
        onLogin: loginHandler, // 이 함수 쓰기위해 뽑아냄
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
//export 해주어야 다른곳에서 임포트 가능
