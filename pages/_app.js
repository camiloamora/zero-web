import 'minireset.css'
import { Container } from '@camiloamora/components'
import '@camiloamora/components/styles/globals.css'
import '@camiloamora/components/styles/tokens.css'

import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'

 // Create a client
 const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {

  return (
  <Container>
    <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
       <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Container>
  )
}

export default MyApp
