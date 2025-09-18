import React, { FC } from 'react'

export interface propsA {
    children: React.ReactNode
}

const Container:  FC<propsA> = ({children:children}) => {
  return (
    <div className='max-w-[1220px] p-[3px] m-auto'>{children}</div>
  )
}

export default Container