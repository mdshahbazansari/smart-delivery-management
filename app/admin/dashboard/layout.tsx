import { layoutInterface } from '@/util/Interface'
import React, { FC } from 'react'

const layout: FC<layoutInterface> = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default layout
