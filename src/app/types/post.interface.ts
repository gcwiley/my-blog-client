// ISO 8601 date/time string
export type ISODateString = string;

// define the post interface
export interface Post {
    id: string;
    title: string;
    author: string;
    body: string;
    category: string;
    favorite: boolean;
    date: ISODateString | null;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

// payload to create a post (client -> server)
// excludes server-generated fields like id, created, updatedAt
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

// --- HELPER INTERFACES FOR UI LIST ---

// define the post category interface
export interface PostCategory {
    value: string;
    viewValue: string;
}