// Bangumi types

export interface BangumiSubject {
	id: number;
	url: string;
	type: number;
	name: string;
	name_cn: string;
	date: string;
	images: {
		small: string;
		medium: string;
		large: string;
		grid: string;
	};
	summary: string;
	score: string;
	rank: number;
	episode_count: number | null;
	episodes: number | null;
	aired_on: string;
	rated_rank: number;
	tag: Array<{
		name: string;
		count: number;
	}>;
	tags: Array<{
		name: string;
		count: number;
	}>;
}

export interface UserSubjectCollection {
	type: number;
	subject: BangumiSubject;
	rate: number | null;
	comment: string | null;
	episodes: number;
	volumes: number;
	finish_date: string | null;
	start_date: string | null;
	lasttouch: number;
	tags: string[];
}

export interface UserSubjectCollectionResponse {
	data: UserSubjectCollection[];
	total: number;
	limit: number;
	offset: number;
}