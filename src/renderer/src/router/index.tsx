import { HomeView } from '@renderer/view/Home'
import { Route, RouteProps, Routes } from 'react-router-dom'

const viewList: RouteProps[] = [{ path: '/home', element: <HomeView /> }]

const BasicRoute = () => (
  <Routes>
    {viewList.map((props, i) => (
      <Route key={i} {...props} />
    ))}
  </Routes>
)

export default BasicRoute
