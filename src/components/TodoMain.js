import React from 'react';
import TodoItem from './TodoItem';
import './scss/TodoMain.scss';

const TodoMain = ({ todoList }) => {
  // 프록스 distructuring {todoList}
  return (
    <ul className='todo-list'>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          item={todo}
        /> // 각각의 컴포넌트 구분할 수 있는 키값 줘야함
      ))}
    </ul>
  );
};

export default TodoMain;
