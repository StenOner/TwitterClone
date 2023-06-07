import { memo } from 'react'

const Trend = ({ trend }) => {
    return (
        <div className='flex flex-col space-y-1'>
            <span className='font-semibold text-lg'>{trend.trend}</span>
            <span className='font-medium text-xs text-gray-400'>{trend.tweets.length} tweet{trend.tweets.length !== 1 && 's'}</span>
        </div>
    )
}

export default memo(Trend)