import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { content, apiKey, provider = 'deepseek' } = await request.json();

        if (!content) {
            return new Response(JSON.stringify({ error: '缺少文章内容' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!apiKey) {
            return new Response(JSON.stringify({ error: '缺少 API Key' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let summary = '';

        if (provider === 'deepseek') {
            summary = await generateDeepSeekSummary(content, apiKey);
        } else if (provider === 'qwen') {
            summary = await generateQwenSummary(content, apiKey);
        } else if (provider === 'wenxin') {
            summary = await generateWenxinSummary(content, apiKey);
        } else {
            return new Response(JSON.stringify({ error: '不支持的 AI 服务商' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ summary }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('AI Summary Error:', error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : '生成摘要失败' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};

async function generateDeepSeekSummary(content: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的文章摘要生成助手。请用简洁的语言总结文章的核心内容,控制在 150-200 字以内。'
                },
                {
                    role: 'user',
                    content: `请为以下文章生成摘要:\n\n${content.slice(0, 3000)}`
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`DeepSeek API 错误: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateQwenSummary(content: string, apiKey: string): Promise<string> {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'qwen-turbo',
            input: {
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的文章摘要生成助手。请用简洁的语言总结文章的核心内容,控制在 150-200 字以内。'
                    },
                    {
                        role: 'user',
                        content: `请为以下文章生成摘要:\n\n${content.slice(0, 3000)}`
                    }
                ]
            },
            parameters: {
                result_format: 'message'
            }
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`通义千问 API 错误: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.output.choices[0].message.content;
}

async function generateWenxinSummary(content: string, apiKey: string): Promise<string> {
    const [apiKeyPart, secretKey] = apiKey.split(':');
    
    if (!apiKeyPart || !secretKey) {
        throw new Error('文心一言需要 API Key 和 Secret Key,格式: apiKey:secretKey');
    }

    const tokenResponse = await fetch(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKeyPart}&client_secret=${secretKey}`,
        { method: 'POST' }
    );

    if (!tokenResponse.ok) {
        throw new Error('获取文心一言 access_token 失败');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const response = await fetch(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${accessToken}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: `请为以下文章生成一个简洁的摘要(150-200字):\n\n${content.slice(0, 3000)}`
                    }
                ]
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`文心一言 API 错误: ${error.error_msg || response.statusText}`);
    }

    const data = await response.json();
    return data.result;
}
