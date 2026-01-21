import React from 'react';
import type { Message } from '../../types/message';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar?: boolean;
    senderAvatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar, senderAvatar }) => {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group mb-1`}>
            {!isOwn && (
                <div className="w-8 mr-2 flex-shrink-0 flex items-end">
                    {showAvatar ? (
                        <img
                            src={senderAvatar || `https://ui-avatars.com/api/?name=${message.first_name || 'U'}&background=random`}
                            className="w-8 h-8 rounded-full object-cover"
                            alt="avatar"
                        />
                    ) : <div className="w-8" />}
                </div>
            )}

            <div className={`max-w-[70%] md:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base break-words ${isOwn
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
                        }`}
                >
                    {message.content}
                </div>

                <div className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1`}>
                    <span>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isOwn && (
                        <span>
                            {message.delivery_status === 'read' ? (
                                <span className="text-blue-500">✓✓</span>
                            ) : message.delivery_status === 'delivered' ? (
                                <span className="text-gray-400">✓✓</span>
                            ) : (
                                <span className="text-gray-400">✓</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
