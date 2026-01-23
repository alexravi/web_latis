import React from 'react';

const MessageSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 w-full animate-pulse">
            {/* Incoming message skeleton */}
            <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                <div className="rounded-2xl rounded-bl-sm p-4 bg-gray-200 dark:bg-gray-700 w-48 h-16"></div>
            </div>

            {/* Outgoing message skeleton */}
            <div className="flex items-end gap-2 max-w-[80%] self-end flex-row-reverse">
                <div className="rounded-2xl rounded-br-sm p-4 bg-blue-100 dark:bg-blue-900/30 w-64 h-24"></div>
            </div>

            {/* Incoming short message */}
            <div className="flex items-end gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                <div className="rounded-2xl rounded-bl-sm p-3 bg-gray-200 dark:bg-gray-700 w-32 h-10"></div>
            </div>
            {/* Incoming short message (grouped) */}
            <div className="flex items-end gap-2 max-w-[80%] ml-10">
                <div className="rounded-2xl rounded-bl-sm p-3 bg-gray-200 dark:bg-gray-700 w-40 h-10"></div>
            </div>

            {/* Outgoing short */}
            <div className="flex items-end gap-2 max-w-[80%] self-end flex-row-reverse">
                <div className="rounded-2xl rounded-br-sm p-3 bg-blue-100 dark:bg-blue-900/30 w-24 h-10"></div>
            </div>
        </div>
    );
};

export default MessageSkeleton;
