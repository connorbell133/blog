import { redirect } from 'next/navigation'
import { getBlogPosts } from 'app/blog/utils'

export async function generateStaticParams() {
  let posts = await getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Blog({ params }) {
  let posts = await getBlogPosts()
  let post = posts.find((post) => post.slug === params.slug)

  if (!post || !post.link) {
    redirect('https://medium.com/@connor.m.bell13')
  }

  redirect(post.link)
}
