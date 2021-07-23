import {
  FullHeightContent,
  Button,
  Avatar,
  Spacer,
  Heading,
} from "@camiloamora/components";
import { useQuery } from "react-query";
import tasksApi from "../features/planning/api";

function Start() {
  const { isLoading, error, data } = useQuery("tasks", () => tasksApi.getAll());
  if (isLoading) return "Loading...";
  if (error) return `An error has ocurred ${error.message}`;
  return (
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
          <Heading size="lg">
            Ahora dime, ¿cuál es la primera tarea en la que trabajaras hoy?
          </Heading>
          <button onClick={() => {}}>Toca para agregar la tarea</button>
          {data &&
            data.map((task) => {
              return (
                <div>
                  <span>{task.id}</span>
                  <span>{task.description}</span>
                </div>
              );
            })}
        </div>
      }
      footer={
        <div>
          <p>
            Basados en la matriz de Elisenhover priorizamos tus tareas evitando
            listas de pendientes saturadas
          </p>
          <Button type="primary">Empieza ahora</Button>
        </div>
      }
    />
  );
}

export default Start;
