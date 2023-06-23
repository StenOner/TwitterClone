import { memo } from 'react'
import Tweets from './Tweets'

const ProfileBody = ({ myProfile }) => {
    return (
        <div className='flex self-center mt-4 w-[85%] flex-col sm:flex-row'>
            <Tweets profile={myProfile} isFilterMode={true} />
        </div>
    )
}

export default memo(ProfileBody)