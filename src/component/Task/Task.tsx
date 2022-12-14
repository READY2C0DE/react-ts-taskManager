import React from 'react';
import { Transition } from 'react-transition-group';

import { ITask, IBox } from '../../types/types';

import { dndContext } from '../../dndContext';
import { useActions } from '../../redux/hooks/useActions';

import Button from '../ui/Button';
import TaskModal from './TaskModal';

interface Props {
  task: ITask;
  box?: IBox;
}

const Task: React.FC<Props> = ({ task, box }) => {
  const { removeTask, completeTask, updateTask } = useActions();

  const dndCtx = React.useContext(dndContext);

  const [visibleModal, setVisibleModal] = React.useState(false);

  const onClickDelete = (e: Event) => {
    e.stopPropagation();
    removeTask({ dateBy: task.dateBy });
  };

  const onChangeComplete = (e: any) => {
    e.stopPropagation();
    completeTask(task);
  };

  const closeModal = () => {
    setVisibleModal(false);
  };

  const openModal = () => {
    setVisibleModal(true);
  };

  //измененмие статуса задачи в "просроченна"
  React.useEffect(() => {
    if (task.deadline) {
      if (task.deadline.valueOf() < task.dateBy) {
        const newStatusTask = {
          ...task,
          status: 'overdue',
        };
        updateTask(newStatusTask);
      }
    }
  }, [task, updateTask]);

  return (
    <>
      <div
        draggable={true}
        onDragOver={(e) => dndCtx.dragOverHandler(e)}
        onDragStart={(e) => dndCtx.dragStartHandler(e, box, task)}
        onDrop={(e) => dndCtx.dropHandler(e)}
        className="task taskBox py-2 px-4 rounded flex justify-between items-center mb-2 bg-slate-300 hover:bg-slate-400 transition-all cursor-grab"
        onClick={openModal}>
        <h3
          className={`text-xl ${task.status === 'completed' && 'text-green-600'} ${
            task.status === 'overdue' && 'text-red-600'
          } truncate`}>
          {task.title}
        </h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 w-4 h-4"
            checked={task.status === 'completed'}
            onChange={(e) => onChangeComplete(e)}
          />
          <Button
            title="Delete"
            color="bg-red-500"
            size="text-sm"
            onClick={(e) => onClickDelete(e)}
          />
        </div>
      </div>
      <Transition in={visibleModal} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <TaskModal
            transitionState={state}
            closeModal={closeModal}
            removeTask={(e) => onClickDelete(e)}
            task={task}
          />
        )}
      </Transition>
    </>
  );
};

export default Task;
