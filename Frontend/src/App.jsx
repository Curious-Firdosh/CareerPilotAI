import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { InterviewProvider } from './features/Interview/Interview.context.jsx'



const App = () => {
  return (
    <>
      <InterviewProvider>
          <RouterProvider router={router} />
      </InterviewProvider>
    </>
  )
}

export default App
