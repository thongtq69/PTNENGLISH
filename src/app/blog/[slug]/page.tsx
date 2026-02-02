import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import BlogPostContent from "./BlogPostContent";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    await dbConnect();
    const { slug } = await params;
    const post = await Post.findOne({ slug });

    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            type: 'article',
            publishedTime: post.createdAt,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await dbConnect();
    const { slug } = await params;
    const post = await Post.findOne({ slug });

    if (!post) {
        notFound();
    }

    const postData = {
        title: post.title,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        author: post.author,
        image: post.image,
        content: post.content,
        excerpt: post.excerpt,
    };

    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            <Header />
            <BlogPostContent post={postData} />
            <Footer />
        </main>
    );
}
