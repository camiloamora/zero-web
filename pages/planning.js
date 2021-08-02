import {
  FullHeightContent,
  Button,
  Avatar,
  Spacer,
  Heading,
  AddButton,
  Paragraph
} from "@camiloamora/components";
import { useQuery, useQueryCache, useMutation, ReactQueryCacheProvider, queryCache, QueryCache } from "react-query";
import tasks from "../features/planning/api";

//const queryCache = new QueryCache()
// export async function getStaticProps() {
//   const initialTasks = await tasks.getAll()
//   return { props: { posts }}
// }

function Planning(props) {
  const cache = useQueryCache()
  const { isLoading, error, data } = useQuery("todos", () => tasks.getAll(), { initialData: props.initialTasks });

  const [addTask] = useMutation((params) => tasks.create(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

  const [deleteTask] = useMutation((params) => tasks.delete(params), {
    onSuccess: () => {
      cache.invalidateQueries('todos')
    }
  })

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


          {data &&
            data.map((task) => {
              return (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  key={task.id}>
                  <Heading>{task.id}</Heading>
                  <Spacer.Vertical size="xs" />
                  <Heading>{task.description}</Heading>
                  <Button type="secondary"
                  isInline
                  onClick={() => deleteTask({ id: task.id })}>
                    X
                  </Button>
                </div>
              );
            })}
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
      footer={
        <div>
        <Paragraph size="sm">
            Basados en la matriz de Elisenhover priorizamos tus tareas evitando
            listas de pendientes saturadas
        </Paragraph>
          <Spacer.Horizontal size="sm" />
          <Button type="primary">Empieza ahora</Button>
        </div>
      }
    />
    </ReactQueryCacheProvider>
    );
}

export default Planning;
