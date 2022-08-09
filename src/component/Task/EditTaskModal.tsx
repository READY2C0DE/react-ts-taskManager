import React from 'react';

import { ITask, ISubtask } from '../../types/task';
import { useActions } from '../../redux/hooks/useActions';

import Button from '../ui/Button';
import Subtask from '../Subtask';

interface TaskModalProps {
  task: ITask;
  spanStyle: string;
  removeTask: () => void;
  closeModal: () => void;
  setEditMode: (value: boolean) => void;
}

const EditTaskModal: React.FC<TaskModalProps> = ({
  task,
  spanStyle,
  closeModal,
  removeTask,
  setEditMode,
}) => {
  const [newTaskValue, setNewTaskValue] = React.useState<ITask>({ ...task });

  const [newSubtask, setNewSubtask] = React.useState<ISubtask>({
    title: '',
    completed: false,
    dateBy: 0,
  });
  const [newSubtasks, setNewSubtasks] = React.useState<ISubtask[]>(task.subtasks || []);

  const { updateTask } = useActions();
  const onClickToSave = () => {
    updateTask(newTaskValue);
    setEditMode(false);
  };

  const addSubtasks = (subtask: ISubtask) => {
    setNewSubtasks([...newSubtasks, subtask]);
    setNewTaskValue({ ...newTaskValue, subtasks: newSubtasks });
    setNewSubtask({ title: '', completed: false, dateBy: 0 });
  };

  return (
    <div className="fixed w-full h-full bg-black/10 top-0 left-0" onClick={closeModal}>
      <div
        className="fixed h-screen max-h-screen w-1/2 bg-slate-200 bottom-0 right-0 py-6 px-4 "
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <div className="grid grid-cols-5 grid-rows-1 mb-4 items-center">
          <h2 className="font-bold text-4xl col-start-1 col-end-4">{task.title}</h2>
          <div className="col-start-5">
            <Button
              title={'Save'}
              color={'bg-green-500'}
              className="self-end mr-2"
              size="text-lg"
              onClick={onClickToSave}
            />
            <Button
              title="Delete"
              color="bg-red-500"
              className="self-end"
              size="text-lg"
              onClick={removeTask}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-y-3 text-lg 	">
          <span className={spanStyle}>Status:</span>

          <select
            className="border rounded border-gray-400 py-2 px-3 w-max"
            value={newTaskValue.completed ? 'Completed' : 'Active'}
            onChange={() =>
              setNewTaskValue({ ...newTaskValue, completed: !newTaskValue.completed })
            }>
            <option>Active</option>
            <option>Completed</option>
          </select>

          <span className={spanStyle}>Created date:</span>
          <p className="col-start-2 col-end-5">
            {new Date(task.dateBy).toISOString().split('.')[0].replace('T', ' ')}
          </p>

          <span className={spanStyle}>Description:</span>
          <textarea
            className="col-start-2 col-end-5 h-24 resize-none px-2 py-1 rounded"
            value={newTaskValue.description}
            onChange={(e) => {
              setNewTaskValue({ ...task, description: e.target.value });
            }}
          />

          <span className={spanStyle}>Deadline:</span>
          <input
            type="date"
            className="col-start-2 px-2 py-1 rounded"
            value={newTaskValue.deadline}
          />
          <input
            type="time"
            className="col-start-3 px-2 py-1 ml-4 rounded"
            value={newTaskValue.deadline}
          />

          <span className={spanStyle}>Subtasks:</span>
          <input
            type="text"
            className="col-start-2 col-end-5 px-2 py-1 rounded self-start"
            placeholder="Text subtask..."
            value={newSubtask.title}
            onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
          />
          <p
            className="text-3xl font-black cursor-pointer pl-4 relative"
            onClick={() => addSubtasks({ ...newSubtask, dateBy: Date.now() })}>
            <span className="absolute bottom-1">+</span>
          </p>
          <div className="col-start-1 col-end-6">
            {newSubtasks?.map((subtask) => (
              <Subtask {...subtask} key={subtask.dateBy} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;