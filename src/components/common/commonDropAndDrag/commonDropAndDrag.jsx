import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTask from '../../../assets/icons/Add.png'
import CommonTaskCard from '../commonTaskCard/commonTaskCard';
import { getExcomTask, UpdateExcomTaskStatus } from '../../../redux/actions/task';



const CommonDropAndDrag = ({ id, project, excom, refresh }) => {
  const [data, setData] = useState([]);
  const [taskArray, setTaskArray] = useState([]);


  useEffect(() => {
    getExcomTask(id, (res) => {
      if (res?.status == 200) {
        convertTaskIntoDropdown(res?.data?.data?.content);
        setTaskArray(res?.data?.data?.content)
      }
    })
  }, [refresh]);


  function convertTaskIntoDropdown(tasksArray) {
    let data = tasksArray.map((item) => ({
      id: item.taskId.toString(),
      ...item,
    }));
    const task = data.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});
    let initialData = {
      tasks: task,
      columns: {
        'TODO': {
          id: 'TODO',
          title: 'To do',
          taskIds: filterTaskIdByStatus('TODO', data) || [],
        },
        'PROGRESS': {
          id: 'PROGRESS',
          title: 'Progress',
          taskIds: filterTaskIdByStatus('PROGRESS', data) || [],
        },
        'COMPLETE': {
          id: 'COMPLETE',
          title: 'Completed',
          taskIds: filterTaskIdByStatus('COMPLETE', data) || [],
        },
      },
      columnOrder: ['TODO', 'PROGRESS', 'COMPLETE'],
    };
    setData(initialData);
  }






  function filterTaskIdByStatus(status, tasks) {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => task.id);
  }

  const onDragEnd = result => {
    const { source, destination, draggableId } = result;

    updateTaskStaus(result);

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        },
      };

      setData(newState);
    }
  };

  function updateTaskStaus(result) {
    const task_id = parseInt(result?.draggableId);
    const status = result?.destination?.droppableId;
    UpdateExcomTaskStatus(task_id, status, (res) => {

    })

  }

  return (
    <>
    <div className='d-flex flex-column'>
    <div className='d-flex justify-content-between'>
        <DragDropContext onDragEnd={onDragEnd}>
          {data?.columnOrder?.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column?.taskIds?.map(taskId => data.tasks[taskId]);

            return (
              <Droppable key={column.id} droppableId={column.id} >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='d-flex flex-column align-items-center m-3 p-4 rounded-3 overflow-scroll overflow-x-hidden custom-scrollbar'
                    style={{ backgroundColor: "#EEF2F5", width: 330, maxHeight: 1000 }}

                  >
                    <div className='d-flex justify-content-between align-items-center w-100'>
                      <div>
                        <h5 style={{ color: column.id == "TODO" ? "#5F6A6A" : column.id == "PROGRESS" ? "#00629B" : column.id == "COMPLETE" ? "#229954" : "black" }}>{column.title}</h5>
                      </div>

                    </div>
                    <div className='d-flex mt-4 flex-column justify-content-center gap-4'>
                      {tasks.map((task, index) => (
                        <CommonTaskCard project={project} excom={excom} task={task} key={index} />
                      ))}
                    </div>

                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
      {taskArray?.length > 0 ? null : (
        <div className='text-center w-100'>No tasks found</div>
      )}
    </div>
    
     

    </>

  );
};

export default CommonDropAndDrag;