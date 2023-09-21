import React from 'react'
import {
  FullHeightContent,
  Button,
  Avatar,
  Spacer,
  Heading,
  AddButton,
  Paragraph
} from "@camiloamora/components";
import TaskList from "../components/TaskList";
import { reorderTasks } from '../helpers';
import {
  useQuery,
  useQueryCache,
  useMutation,
  ReactQueryCacheProvider,
  queryCache,
  QueryCache,
} from "react-query";
import { useState, useEffect } from "react";
import tasks from "../api";

const PlanningContainer = ({ initialData }) => {

  const [shouldStart,  setShouldStart] = useState(false)
  const cache = useQueryCache()
  const { isLoading, error, data } = useQuery("todos", () => tasks.getAll(), { initialData });

  const [addTask] = useMutation((params) => tasks.create(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

  const [updatePriorities] = useMutation(
    (params) => tasks.updatePriorities(params), {
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

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    const orderTask = reorderTasks(data, sourceIndex, destinationIndex)
    updatePriorities({ tasks: orderTask })
  }

  if (isLoading) return "Loading...";
  if (error) return `An error has ocurred ${error.message}`;

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
            <TaskList tasks={data} onDragEnd={onDragEnd} onDeleteTask={deleteTask}/>
            <Spacer.Horizontal size="md" />
            <AddButton onAdd={(value) =>
            addTask({ description: value,
            priority:  data.length })}
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
  )
}

export default PlanningContainer
