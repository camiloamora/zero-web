import React from "react";
import {
  Spacer,
  Task
} from "@camiloamora/components";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import PropTypes from 'prop-types';
import { getTaskType } from "../helpers";

import { PRIORITY_TASK_QUANTITY } from "../constants";

const TaskList = ({ tasks, onDragEnd, onDeleteTask }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="planning">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks?.map((task, index) => {
              return (
                <>
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        <Task
                          key={task.id}
                          onDelete={() => onDeleteTask({ id: task.id })}
                          isPending
                          type={getTaskType(index)}
                        >
                          {task.description}
                        </Task>
                        {index === PRIORITY_TASK_QUANTITY - 1 && (
                          <div
                            style={{
                              height: 5,
                              margin: "10px 0",
                              background: "tomato",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                  <Spacer.Horizontal size="xs" />
                </>
              );
            })}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

TaskList.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired
  })),
}

export default TaskList
