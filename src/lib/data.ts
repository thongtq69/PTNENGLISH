import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/issues.json');
const ABOUT_DATA_PATH = path.join(process.cwd(), 'data/about-us.json');
const MOCK_TESTS_PATH = path.join(process.cwd(), 'data/mock-tests.json');
const SITE_SETTINGS_PATH = path.join(process.cwd(), 'data/site-settings.json');
const ACHIEVEMENTS_PATH = path.join(process.cwd(), 'data/achievements.json');
const TESTIMONIALS_PATH = path.join(process.cwd(), 'data/testimonials.json');
const POSTS_PATH = path.join(process.cwd(), 'data/posts.json');
const COURSES_PATH = path.join(process.cwd(), 'data/courses.json');
const SCHEDULES_PATH = path.join(process.cwd(), 'data/schedules.json');
const GLOBAL_SETTINGS_PATH = path.join(process.cwd(), 'data/global-settings.json');

export interface Issue {
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string;
  course?: string;
  description?: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
}

export function getIssues(): Issue[] {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }
  const data = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(data);
}

export function saveIssue(issue: Issue) {
  const issues = getIssues();
  issues.push(issue);
  fs.writeFileSync(DATA_PATH, JSON.stringify(issues, null, 2));
}

export function updateIssueStatus(id: string, status: Issue['status']) {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    issues[index].status = status;
    fs.writeFileSync(DATA_PATH, JSON.stringify(issues, null, 2));
    return true;
  }
  return false;
}

export function getAboutUs(): any {
  if (!fs.existsSync(ABOUT_DATA_PATH)) {
    return {};
  }
  const data = fs.readFileSync(ABOUT_DATA_PATH, 'utf8');
  return JSON.parse(data);
}

export function saveAboutUs(data: any) {
  fs.writeFileSync(ABOUT_DATA_PATH, JSON.stringify(data, null, 2));
}

export function getMockTests(): any[] {
  if (!fs.existsSync(MOCK_TESTS_PATH)) return [];
  return JSON.parse(fs.readFileSync(MOCK_TESTS_PATH, 'utf8'));
}

export function saveMockTests(data: any[]) {
  fs.writeFileSync(MOCK_TESTS_PATH, JSON.stringify(data, null, 2));
}

export function getSiteSettings(): any {
  if (!fs.existsSync(SITE_SETTINGS_PATH)) return {};
  return JSON.parse(fs.readFileSync(SITE_SETTINGS_PATH, 'utf8'));
}

export function saveSiteSettings(data: any) {
  fs.writeFileSync(SITE_SETTINGS_PATH, JSON.stringify(data, null, 2));
}

export function getAchievements(): any[] {
  if (!fs.existsSync(ACHIEVEMENTS_PATH)) return [];
  return JSON.parse(fs.readFileSync(ACHIEVEMENTS_PATH, 'utf8'));
}

export function saveAchievements(data: any[]) {
  fs.writeFileSync(ACHIEVEMENTS_PATH, JSON.stringify(data, null, 2));
}

export function getTestimonials(): any[] {
  if (!fs.existsSync(TESTIMONIALS_PATH)) return [];
  return JSON.parse(fs.readFileSync(TESTIMONIALS_PATH, 'utf8'));
}

export function saveTestimonials(data: any[]) {
  fs.writeFileSync(TESTIMONIALS_PATH, JSON.stringify(data, null, 2));
}

export function getPosts(): any[] {
  if (!fs.existsSync(POSTS_PATH)) return [];
  return JSON.parse(fs.readFileSync(POSTS_PATH, 'utf8'));
}

export function savePosts(data: any[]) {
  fs.writeFileSync(POSTS_PATH, JSON.stringify(data, null, 2));
}

export function getCourses(): any[] {
  if (!fs.existsSync(COURSES_PATH)) return [];
  return JSON.parse(fs.readFileSync(COURSES_PATH, 'utf8'));
}

export function saveCourses(data: any[]) {
  fs.writeFileSync(COURSES_PATH, JSON.stringify(data, null, 2));
}

export function getSchedules(): any[] {
  if (!fs.existsSync(SCHEDULES_PATH)) return [];
  return JSON.parse(fs.readFileSync(SCHEDULES_PATH, 'utf8'));
}

export function saveSchedules(data: any[]) {
  fs.writeFileSync(SCHEDULES_PATH, JSON.stringify(data, null, 2));
}

export function getFullGlobalSettings(): any {
  if (!fs.existsSync(GLOBAL_SETTINGS_PATH)) return {};
  return JSON.parse(fs.readFileSync(GLOBAL_SETTINGS_PATH, 'utf8'));
}

export function saveFullGlobalSettings(data: any) {
  fs.writeFileSync(GLOBAL_SETTINGS_PATH, JSON.stringify(data, null, 2));
}
