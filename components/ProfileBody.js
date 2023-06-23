import { memo } from 'react'
import Tweets from '@/components/Tweets'

const ProfileBody = ({ myProfile, profile }) => {
    return (
        <div className='flex self-center mt-4 w-[85%] flex-col sm:flex-row'>
            <Tweets myProfile={myProfile} profile={profile} isFilterMode={true} />
        </div>
    )
}

export default memo(ProfileBody)