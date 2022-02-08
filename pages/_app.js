import 'minireset.css'
import { Container } from '@camiloamora/components'
import '@camiloamora/components/styles/globals.css'
import '@camiloamora/components/styles/tokens.css'

import { ReactQueryDevtools } from 'react-query-devtools'
import { ReactQueryCacheProvider, QueryCache } from 'react-query'
import ToogleColorScheme from '../features/common/components/ToogleColorScheme'
import '../styles/globals.css'


 // Create a client
 const queryCache = new QueryCache()

function MyApp({ Component, pageProps }) {

  return (
    <>
      <ToogleColorScheme />
      <Container>
        <ReactQueryCacheProvider queryCache={queryCache}>
        <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryCacheProvider>
      </Container>
    </>
  )
}

export default MyApp
