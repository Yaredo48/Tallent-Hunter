# AI Integration Testing Guide

## Setup Instructions

### 1. Get Your Hugging Face API Key

1. Visit https://huggingface.co/
2. Sign up for a free account (if you don't have one)
3. Go to **Settings** → **Access Tokens**
4. Click **New token**
5. Give it a name (e.g., "Talent Hunter AI")
6. Select **Read** permission (free tier)
7. Click **Generate**
8. Copy your API token

### 2. Configure Environment

Open `apps/api/.env` and update:
```bash
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

Replace `hf_your_actual_token_here` with your actual token from step 1.

## Testing the Integration

### Option 1: Via Frontend UI

1. Start the backend:
   ```bash
   cd apps/api
   /home/yared/.npm-global/bin/pnpm dev
   ```

2. Start the frontend:
   ```bash
   cd apps/web
   /home/yared/.npm-global/bin/pnpm dev
   ```

3. Login to the application at http://localhost:3000

4. Navigate to **Job Descriptions** page

5. Click **"Generate with AI"** button

6. Fill in the form:
   - **Job Title**: Senior Software Engineer
   - **Department**: Engineering (or any department you created)

7. Click **"Generate"**

8. Wait 10-15 seconds for AI generation

9. Check the job descriptions table - you should see a new entry with AI-generated content

### Option 2: Via API (curl)

First, get your auth token by logging in:

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Copy the `accessToken` from the response, then test AI generation:

```bash
curl -X POST http://localhost:3001/job-descriptions/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "departmentId": "your-department-id",
    "organizationId": "your-org-id"
  }'
```

### Expected Results

✅ **Success Indicators:**
- Response received within 10-15 seconds
- Job description contains structured content:
  - Summary section
  - Responsibilities list
  - Required qualifications
  - Preferred qualifications
  - Benefits/perks
- Status is set to "DRAFT"
- Content is coherent and contextual to the job title

⚠️ **Fallback Behavior:**
If AI is unavailable (no API key, rate limit, or error), the system will:
- Use a fallback template
- Log a warning in backend console
- Still create the job description with generic content
- Set metadata.model to "fallback-template"

## Troubleshooting

### Issue: "AI is disabled, using fallback template"

**Solution:** Check that:
1. `HUGGINGFACE_API_KEY` is set in `.env`
2. The key is valid (starts with `hf_`)
3. `AI_ENABLED=true` in `.env`

### Issue: "Rate limit exceeded"

**Solution:** 
- Hugging Face free tier has rate limits
- Wait a few minutes between requests
- Consider upgrading to Hugging Face Pro for production

### Issue: Response takes too long

**Solution:**
- Free Hugging Face models can be slow (10-30 seconds)
- This is normal for the free tier
- For faster responses, consider:
  - Using a paid Hugging Face tier
  - Using a different model
  - Switching to OpenAI/Anthropic in the future

### Issue: Generated content is not well-structured

**Solution:**
- The AI service includes a parser that attempts to structure the response
- If parsing fails, it falls back to raw text
- You can improve the parser in `ai.service.ts` → `parseJobDescription()`

## Monitoring

Check backend logs for:
- `Generating job description using model: mistralai/Mistral-7B-Instruct-v0.2`
- `Hugging Face AI service initialized`
- Any errors or warnings

## Next Steps

Once AI generation is working:
1. ✅ Test with different job titles and departments
2. ✅ Verify content quality and relevance
3. ✅ Consider adding more prompt customization options
4. ✅ Implement content moderation (Phase 4 remaining)
5. ✅ Add user feedback mechanism for AI-generated content
