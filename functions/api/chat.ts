interface ChatRequest {
  sessionId: string
  message: string
}

interface N8nResponse {
  output?: string
  response?: string
  [key: string]: unknown
}

const N8N_WEBHOOK_URL = 'https://n8ntb.sts.support/webhook/testbot'

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const body = await context.request.json() as ChatRequest

    if (!body.sessionId || !body.message) {
      return new Response(
        JSON.stringify({ error: 'sessionId and message are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Forward to n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: body.sessionId,
        message: body.message,
      }),
    })

    if (!n8nResponse.ok) {
      console.error('n8n webhook error:', n8nResponse.status, await n8nResponse.text())
      return new Response(
        JSON.stringify({ error: 'AI service unavailable' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await n8nResponse.json() as N8nResponse

    // n8n kann verschiedene Formate zurückgeben
    const responseText = data.output || data.response || JSON.stringify(data)

    return new Response(
      JSON.stringify({
        response: responseText,
        sessionId: body.sessionId,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
