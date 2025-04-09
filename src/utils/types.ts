export interface FileItem {
    id: string;
    name: string;
    size: number;
    lastModified: string;
    mimeType: string;
    isFolder: boolean;
    downloadUrl: string;
    viewUrl?: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    webUrl?: string;
    isProtected?: boolean;
}

export interface User {
    id: string;
    displayName: string;
    email: string;
    avatar?: string;
}

export interface FetchFilesResult {
    files: FileItem[];
    total: number;
    hasMore: boolean;
    nextPageToken: string | null;
}
