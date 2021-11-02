import {
  FullHeightContent,
  Button,
  Avatar,
  Spacer,
  Heading,
  AddButton,
  Paragraph,
  Task
} from "@camiloamora/components";
import { useQuery, useQueryCache, useMutation, ReactQueryCacheProvider, queryCache, QueryCache } from "react-query";
import tasks from "../features/planning/api";
import { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const PRIORITY_TASK_QUANTITY = 3

//const queryCache = new QueryCache()
export async function getStaticProps() {
   const initialTasks = await tasks.getAll()
   return { props: { initialTasks }}
}

function splitTask(tasks) {
  const priorityTask = tasks.slice(0, PRIORITY_TASK_QUANTITY)
  const backlogTasks = tasks.slice(PRIORITY_TASK_QUANTITY, tasks.length)

  return {
    priorityTask,
    backlogTasks
  }
}

function Planning(props) {
  const [shouldStart,  setShouldStart] = useState(false)
  const cache = useQueryCache()
  const { isLoading, error, data } = useQuery("todos", () => tasks.getAll(), { initialData: props.initialTasks });

  const [addTask] = useMutation((params) => tasks.create(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

  const [updatePriorities] = useMutation(
    (params) => tasks.updatePriority(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

  const [deleteTask] = useMutation((params) => tasks.delete(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

  useEffect(() => {
    console.log('>>>',data)
    if(data?.length >= 1 ) {
      setShouldStart(true)
    } else {
      setShouldStart(false)
    }
  }, [data])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    console.log('result.source.index',result.source.index)
    console.log('result.destination.index',result.destination.index)

    updatePriorities({
      id: Number(result.draggableId),
      priority: result.destination.index
    })
    // updatePriorities(reorderTasks)
  }

  const reorderTasks = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result.map((task, index) => ({ ...task, priority: index }))
  }

  const getTaskType = (index) => {
    if(index >2 ) {
      return null
    }

    return index === 0 ? 'active': 'standby'
  }

  if (isLoading) return "Loading...";
  if (error) return `An error has ocurred ${error.message}`;

  // const { priorityTask, backlogTasks } = splitTask(data);

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
    <FullHeightContent
      content={
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Avatar src="http://placeimg.com/200/200/people"></Avatar>
            <Spacer.Vertical size="xs" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Heading size="lg">Hola, Camilo</Heading>
              <Heading size="md" color="primary">
                ¿Cómo quieres empezar?
              </Heading>
            </div>
          </div>
          <Spacer.Horizontal size="md" />
          <Heading size="lg">
            Ahora dime, ¿cuál es la primera tarea en la que trabajaras hoy?
          </Heading>
          <Spacer.Horizontal size="md" />
          <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="planning">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
          {
            data?.map((task, index) => {
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
                    onDelete={() => deleteTask({ id: task.id })}
                    isPending
                    type={getTaskType(index)}
                    >
                    {task.description}
                    </Task>
                   </div>
                  )}
                  </Draggable>
                  <Spacer.Horizontal size="xs"/>
                </>
              );
            })}
            <div style={{ height: 5, margin:'10px 0', background: 'tomato'  }} />
            {/* {provided.placeholder} */}
            </div>
               )}
            </Droppable>
            </DragDropContext>
            <Spacer.Horizontal size="md" />
            <AddButton onAdd={(value) => addTask({ description: value })}
          focusHelpText="Presiona enter"
          blurHelpText="Clic para continuar"
          type="primary"
          icon="plusCircle">
          Toca para agregar la tarea
          </AddButton>
        </div>
      }
      footer={ shouldStart ?
        <>
        <Spacer.Horizontal size="lg" />
        <Paragraph size="sm">
            Basados en la matriz de Elisenhover priorizamos tus tareas evitando
            listas de pendientes saturadas
        </Paragraph>
          <Spacer.Horizontal size="sm" />
          <Button isDisabled type="primary">Empieza ahora</Button>
        </>
      : null}
    />
    </ReactQueryCacheProvider>
    );
}

export default Planning;
