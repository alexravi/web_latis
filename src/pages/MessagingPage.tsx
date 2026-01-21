import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from '../components/messaging/ConversationList';
import ChatWindow from '../components/messaging/ChatWindow';

const MessagingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const id = searchParams.get('cid');
        if (id) {
            setSelectedConversationId(Number(id));
        }
    }, [searchParams]);

    const handleSelectConversation = (id: number) => {
        setSelectedConversationId(id);
        setSearchParams({ cid: id.toString() });
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className={`w-full md:w-1/3 lg:w-1/4 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                <ConversationList
                    onSelect={handleSelectConversation}
                    selectedId={selectedConversationId}
                    refreshTrigger={refreshTrigger}
                />
            </div>
            <div className={`w-full md:w-2/3 lg:w-3/4 ${!selectedConversationId ? 'hidden md:flex' : 'flex'} flex-col`}>
                {selectedConversationId ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                        onBack={() => {
                            setSelectedConversationId(null);
                            setSearchParams({});
                        }}
                        onMessageSent={() => setRefreshTrigger(prev => prev + 1)}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                            <h3 className="text-xl font-medium">Messages</h3>
                            <p className="mt-2">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingPage;
