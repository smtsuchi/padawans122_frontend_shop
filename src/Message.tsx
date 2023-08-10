import React from 'react'

interface MessageProps {
  message: string,
  color: string,
  resetMessage: ()=>void
}

const Message: React.FC<MessageProps> = ({ message, color, resetMessage }) => {
  return (
    <button style={{backgroundColor: color,}} onClick={resetMessage}>
      { message }
    </button>
  )
}

export default Message