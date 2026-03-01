import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft, Share2, Bookmark, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { getSheetData, parseSheetData, SHEETS, SCHEMAS } from '@/lib/google-sheets'
import { Blog } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const data = await getSheetData(SHEETS.BLOGS)
    const blogs = parseSheetData<Blog>(data, SCHEMAS[SHEETS.BLOGS])
    return blogs.find(b => b.slug === slug && b.status === 'published') || null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

async function getRelatedBlogs(category: string, currentSlug: string): Promise<Blog[]> {
  try {
    const data = await getSheetData(SHEETS.BLOGS)
    const blogs = parseSheetData<Blog>(data, SCHEMAS[SHEETS.BLOGS])
    return blogs
      .filter(b => b.status === 'published' && b.slug !== currentSlug && b.category === category)
      .slice(0, 3)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  
  if (!blog) {
    return { title: 'Blog Not Found' }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, slug)

  const readingTime = Math.ceil(blog.content.split(/\s+/).length / 200)

  return (
    <>
      <section className="gradient-hero text-white py-16">
        <div className="container-custom">
          <Link
            href="/blogs"
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-3xl">
            {blog.category && (
              <Badge variant="secondary" className="mb-4">
                {blog.category}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {blog.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2">
              {blog.coverImage && (
                <div className="rounded-xl overflow-hidden mb-8">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {blog.tags && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-text-muted mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.split(',').map(tag => (
                      <Badge key={tag.trim()} variant="secondary" size="sm">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {blog.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{blog.author}</p>
                      <p className="text-sm text-text-muted">AsterMed Healthcare</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {relatedBlogs.length > 0 && (
                  <Card>
                    <CardContent>
                      <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedBlogs.map(related => (
                          <Link
                            key={related.id}
                            href={`/blogs/${related.slug}`}
                            className="block group"
                          >
                            <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-sm text-text-muted mt-1">
                              {formatDate(related.publishedAt)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-primary text-white">
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Need Medical Advice?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Book an appointment with our expert doctors today.
                    </p>
                    <Link href="/appointment">
                      <Button variant="secondary" fullWidth>
                        Book Appointment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
