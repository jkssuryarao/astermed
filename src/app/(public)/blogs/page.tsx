import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { formatDate, truncateText } from '@/lib/utils'
import { getSheetData, parseSheetData, SHEETS, SCHEMAS } from '@/lib/google-sheets'
import { Blog } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Health Blog',
  description: 'Stay informed with the latest health tips, medical insights, and wellness advice from AsterMed Healthcare experts.',
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const data = await getSheetData(SHEETS.BLOGS)
    const blogs = parseSheetData<Blog>(data, SCHEMAS[SHEETS.BLOGS])
    return blogs
      .filter(b => b.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs()
  const featuredBlog = blogs[0]
  const otherBlogs = blogs.slice(1)

  const categories = [...new Set(blogs.map(b => b.category).filter(Boolean))]

  return (
    <>
      <section className="gradient-hero text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Health & Wellness Blog
            </h1>
            <p className="text-xl text-white/80">
              Stay informed with expert health tips, medical insights, and the latest 
              updates from our healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-10 h-10 text-text-muted" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                No Blog Posts Yet
              </h2>
              <p className="text-text-secondary">
                Check back soon for health tips and medical insights from our experts.
              </p>
            </div>
          ) : (
            <>
              {featuredBlog && (
                <div className="mb-16">
                  <Link href={`/blogs/${featuredBlog.slug}`}>
                    <Card hover className="overflow-hidden">
                      <div className="grid md:grid-cols-2">
                        <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                          {featuredBlog.coverImage ? (
                            <img
                              src={featuredBlog.coverImage}
                              alt={featuredBlog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl font-bold text-primary/20">A</span>
                            </div>
                          )}
                          <Badge className="absolute top-4 left-4" variant="primary">
                            Featured
                          </Badge>
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          {featuredBlog.category && (
                            <Badge variant="secondary" size="sm" className="w-fit mb-3">
                              {featuredBlog.category}
                            </Badge>
                          )}
                          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                            {featuredBlog.title}
                          </h2>
                          <p className="text-text-secondary mb-4">
                            {featuredBlog.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {featuredBlog.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(featuredBlog.publishedAt)}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </div>
              )}

              {categories.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  <span className="text-text-muted text-sm py-2">Categories:</span>
                  {categories.map(category => (
                    <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-secondary/20">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherBlogs.map((blog) => (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                    <Card hover className="h-full overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary/20">A</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        {blog.category && (
                          <Badge variant="secondary" size="sm" className="mb-2">
                            {blog.category}
                          </Badge>
                        )}
                        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(blog.publishedAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section bg-muted">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest health tips and updates 
            directly in your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
