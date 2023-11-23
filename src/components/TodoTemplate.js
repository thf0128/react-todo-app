import React, { useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

const TodoTemplate = () => {
  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함. -> 나중에 하자

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([
    // 상태변수를 바꿀 수 있는건 본인밖에안댐
    // todo input에서 입력한 텍스트를 갖고와서 상태값 변경해야함
    // 자식이 부모한테는 함수로 이용 , 부모가 자식한테는 프록스
    {
      id: 1,
      title: '아침 산책하기',
      done: true,
    },
    {
      id: 2,
      title: '오늘 주간 신문 읽기',
      done: true,
    },
    {
      id: 3,
      title: '샌드위치 사먹기',
      done: true,
    },
    {
      id: 4,
      title: '리액트 복습하기',
      done: false,
    },
  ]);

  // id값 시퀀스 함수 (DB 연동시키면 필요없게 됨.)
  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; // 맨 마지막 할일 객체의 id보다 하나 크게
  };

  /*
    todoInput에게 todoText를 받아오는 함수
    자식 컴포넌트가 부모컴포넌트에게 데이터를 전달할 때는
    일반적인 props 사용이 불가능.
    부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
    자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  */
  const addTodo = (todoText) => {
    const newTodo = {
      id: makeNewId(),
      title: todoText,
      done: false,
    }; // fetch를 이용해서 백엔드에 insert 요청 보내야됨.

    // todos.push(newTodo); (x) -> useState 변수는 setter로 변경
    // setTodos(newTodo); (x)
    // react의 상태변수는 불변성(immutable)을 가지기 때문에
    // 기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경해야 한다.

    setTodos((oldTodos) => {
      return [...oldTodos, newTodo]; //oldTodos 치우고 newTodo 갈아끼우기
      //안에 원하는 변수로 선언하면됨
    });
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    //id가 2이면 2 삭제해주면 되는 것
    //TodoMain에게 보내야 함.
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴.
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className='TodoTemplate'>
      <TodoHeader />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
