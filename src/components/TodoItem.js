import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import cn from 'classnames';

import './scss/TodoItem.scss';

//Main 할일 요소들 아이템으로 표현
const TodoItem = ({ item, remove, check }) => {
  const { id, title, done } = item;
  //아이템 프록스로 받아서 아이템에서 타이틀 꺼내주면된다.

  return (
    <li className='todo-list-item'>
      <div
        className={cn('check-circle', { active: done })}
        onClick={() => check(id)}
      >
        <MdDone />
      </div>
      <span className={cn('text', { finish: done })}>{title}</span>
      <div
        className='remove'
        onClick={() => remove(id)}
      >
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;
