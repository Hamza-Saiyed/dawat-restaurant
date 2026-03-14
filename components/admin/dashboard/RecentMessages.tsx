import Badge from '@/components/admin/ui/Badge';
import { Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface MessageProps {
  _id: string;
  name: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

interface RecentMessagesProps {
  messages: MessageProps[];
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-[#21262D] rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-[#21262D] flex items-center justify-between">
        <div>
          <h3 className="text-[#E6EDF3] font-medium">Inbox Preview</h3>
          <p className="text-[#8B949E] text-xs mt-1">Latest contact messages</p>
        </div>
        <Link 
          href="/admin/messages" 
          className="text-xs flex items-center text-[#C9A84C] hover:text-[#E2C068] transition-colors"
        >
          Inbox <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="flex-1 p-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-[#8B949E]">
            <Mail className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm">Inbox is empty</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#21262D]/50">
            {messages.map((msg) => (
              <li key={msg._id}>
                <Link 
                  href={`/admin/messages?id=${msg._id}`}
                  className="block p-3 hover:bg-[#1C2128] rounded-lg transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center space-x-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0"></span>
                      )}
                      <span className={`text-sm ${!msg.isRead ? 'text-[#E6EDF3] font-semibold' : 'text-[#8B949E] font-medium'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#656D76] shrink-0 ml-2">
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className={`text-xs pl-${!msg.isRead ? '4' : '0'} ${!msg.isRead ? 'text-[#C9A84C]/90 font-medium' : 'text-[#656D76]'} truncate`}>
                    {msg.subject}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
