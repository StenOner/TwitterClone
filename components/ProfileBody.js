import { memo } from 'react'
import TweetFilter from './TweetFilter'
import Tweets from './Tweets'

const ProfileBody = ({ myProfile, profile }) => {
    return (
        <div className='flex self-center mt-4 w-[85%] flex-col sm:flex-row'>
            <TweetFilter />
            <Tweets profile={profile} />
        </div>
    )
}

export default memo(ProfileBody)