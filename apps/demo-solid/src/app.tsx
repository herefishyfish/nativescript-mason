import { Route, RouteDefinition, StackRouter } from 'solid-navigation'
import Home from './components/home'
import Typography from './components/typography'
import Flexbox from './components/flexbox'
import Grid from './components/grid'
import Shadows from './components/shadows'
import Transforms from './components/transforms'
import Backgrounds from './components/backgrounds'
import QA from './components/qa'

declare module 'solid-navigation' {
  export interface Routers {
    Default: {
      Home: RouteDefinition
      Typography: RouteDefinition
      Flexbox: RouteDefinition
      Grid: RouteDefinition
      Shadows: RouteDefinition
      Transforms: RouteDefinition
      Backgrounds: RouteDefinition
      QA: RouteDefinition
    }
  }
}

const App = () => {
  return (
    <StackRouter initialRouteName="Home">
      <Route name="Home" component={Home} />
      <Route name="Typography" component={Typography} />
      <Route name="Flexbox" component={Flexbox} />
      <Route name="Grid" component={Grid} />
      <Route name="Shadows" component={Shadows} />
      <Route name="Transforms" component={Transforms} />
      <Route name="Backgrounds" component={Backgrounds} />
      <Route name="QA" component={QA} />
    </StackRouter>
  )
}

export { App }
