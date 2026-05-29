// Bangumi types

export interface BangumiSubject {
    id: number;
    type: number;
    name: string;
    name_cn: string;
    date: string | null;
    images: {
        small: string;
        medium: string;
        large: string;
        grid: string;
        common: string;
    };
    short_summary: string;
    score: number;
    rank: number;
    eps: number;
    volumes: number;
    collection_total: number;
    tags: Array<{
        name: string;
        count: number;
        total_cont: number;
    }>;
}

export interface UserSubjectCollection {
    type: number;
    subject: BangumiSubject;
    rate: number | null;
    comment: string | null;
    tags: string[];
    ep_status: number;
    vol_status: number;
    subject_id: number;
    subject_type: number;
    updated_at: string;
    private: boolean;
}
