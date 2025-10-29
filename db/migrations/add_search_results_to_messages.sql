-- Add search_results column to chat_messages table
-- This will store web search citation cards with the messages

ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS search_results JSONB;

-- Add comment for documentation
COMMENT ON COLUMN chat_messages.search_results IS 'Web search results and citations displayed with the message';

