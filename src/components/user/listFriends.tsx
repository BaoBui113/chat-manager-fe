import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserWithLastMessage } from "@/types/auth";
export default function ListFriends({
  friends,
  setSelectedFriend,
  selectedFriend,
}: {
  friends: UserWithLastMessage[];
  setSelectedFriend: (friend: UserWithLastMessage) => void;
  selectedFriend: UserWithLastMessage | null;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => setSelectedFriend(friend)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedFriend?.id === friend.id
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={friend.avatar || "/placeholder.svg"}
                  alt={friend.username}
                />
                <AvatarFallback>{friend.username.charAt(0)}</AvatarFallback>
              </Avatar>
              {/* {friend.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
              )} */}
            </div>
            <div className="m-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {friend.username}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(friend.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {friend.lastMessage?.content || ""}
                </p>
                {/* {friend.unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {friend.unreadCount}
                  </Badge>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
