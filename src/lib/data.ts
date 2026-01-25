import fs from 'fs';
import path from 'path';
import dbConnect from './mongodb';
import Course from '@/models/Course';
import Post from '@/models/Post';
import Achievement from '@/models/Achievement';
import Testimonial from '@/models/Testimonial';
import MockTest from '@/models/MockTest';
import Page from '@/models/Page';
import SiteSettings from '@/models/SiteSettings';

export async function getAboutUs(): Promise<any> {
  await dbConnect();
  const page = await Page.findOne({ slug: 'about-us' });
  if (!page) return null;

  const data: any = {};
  page.sections.forEach((s: any) => {
    if (s.type === 'about-hero') data.hero = s.content;
    if (s.type === 'about-story') data.story = s.content;
    if (s.type === 'about-teachers') data.teachers = s.content.items;
    if (s.type === 'about-philosophy') data.philosophy = s.content.items;
    if (s.type === 'about-values') data.values = s.content.items;
    if (s.type === 'about-differences') data.differences = s.content.items;
  });
  return data;
}

export async function getMockTests(): Promise<any[]> {
  await dbConnect();
  return await MockTest.find({}).lean();
}

export async function getSiteSettings(): Promise<any> {
  await dbConnect();
  return await SiteSettings.findOne({}).lean();
}

export async function getAchievements(): Promise<any[]> {
  await dbConnect();
  return await Achievement.find({}).lean();
}

export async function getTestimonials(): Promise<any[]> {
  await dbConnect();
  return await Testimonial.find({}).lean();
}

export async function getPosts(): Promise<any[]> {
  await dbConnect();
  return await Post.find({}).lean();
}

export async function getCourses(): Promise<any[]> {
  await dbConnect();
  return await Course.find({}).lean();
}

import Issue from '@/models/Issue';

export async function getIssues(): Promise<any[]> {
  await dbConnect();
  return await Issue.find({}).sort({ createdAt: -1 }).lean();
}

export async function getFullGlobalSettings(): Promise<any> {
  await dbConnect();
  return await SiteSettings.findOne({}).lean();
}

export async function getPageData(slug: string): Promise<any> {
  await dbConnect();
  return await Page.findOne({ slug }).lean();
}
