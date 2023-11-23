import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import './scss/TodoItem.scss';

//Main 할일 요소들 아이템으로 표현
const TodoItem = () => {
  return (
    <li className='todo-list-item'>
      <div className='check-circle'>
        <MdDone />
      </div>
      <span className='text'>할 일 어쩌고~~~</span>
      <div className='remove'>
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;
