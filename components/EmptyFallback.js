import { v4 as uuidv4 } from 'uuid'

const EmptyFallback = ({ messages }) => {
    return (
        <div className='flex flex-col bg-white rounded-lg px-4 py-10 justify-center items-center'>
            {messages.map((message) => (
                <span key={uuidv4()}>{message}</span>
            ))}
        </div>
    )
}

export default EmptyFallback