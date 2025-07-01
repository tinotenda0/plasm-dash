import { PostsList } from '@/components/posts-list'
import { PostsHeader } from '@/components/posts-header'

export default function PostsPage() {
  return (
    <div className="flex flex-col h-full">
      <PostsHeader />
      <div className="flex-1 overflow-auto">
        <PostsList />
      </div>
    </div>
  )
}
