import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import './scss/TodoItem.scss';

//Main 할일 요소들 아이템으로 표현
const TodoItem = ({ item }) => {
  //아이템 프록스로 받아서 아이템에서 타이틀 꺼내주면된다.
  return (
    <li className='todo-list-item'>
      <div className='check-circle'>
        <MdDone />
      </div>
      <span className='text'>{item.title}</span>
      <div className='remove'>
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;
