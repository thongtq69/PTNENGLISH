import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/issues.json');

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
