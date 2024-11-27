import React from 'react'

function Skeleton() {
  return (
    <div className="flex items-center sm:w-40 md:w-[500px] lg:w-full gap-4 bg-gray-200 bg-opacity-10 backdrop-blur-lg p-2 rounded-2xl">
        <div className="skeleton sm:h-20 sm:w-36 md:h-32 md:w-56 lg:h-40 lg:w-72"></div>
        
        <div className="flex flex-col gap-4 w-full">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>

        <div className="skeleton h-12 w-20 shrink-0 rounded-xl">
        </div>
        
    </div>
  )
}

export default Skeleton
