-- ==============================================================================
-- Migration: Notifications Table with Row-Level Security (RLS)
-- Columns: id, user_id, title, message, type, is_read, reference_id, created_at
-- ==============================================================================

-- 1. Helper function for auth.uid() to support standard PostgreSQL / Neon as well as Supabase
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        NULLIF(current_setting('request.jwt.claim.sub', true), ''),
        NULLIF(current_setting('app.current_user_id', true), '')
    );
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Create notifications table if it does not already exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. If table already existed from an earlier revision, ensure all required columns exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'user_id') THEN
        ALTER TABLE notifications ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'is_read') THEN
        ALTER TABLE notifications ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'reference_id') THEN
        ALTER TABLE notifications ADD COLUMN reference_id UUID;
    END IF;
END $$;

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- 5. Enable Row-Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 6. Clean up any existing policies with the same names
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
DROP POLICY IF EXISTS "System and admins can insert notifications" ON notifications;

-- 7. RLS Policy: Users can only access their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT
    USING (
        user_id::text = auth.uid()::text
        OR user_id::text = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        OR user_id::text = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 8. RLS Policy: Users can only update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE
    USING (
        user_id::text = auth.uid()::text
        OR user_id::text = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        OR user_id::text = NULLIF(current_setting('app.current_user_id', true), '')
    )
    WITH CHECK (
        user_id::text = auth.uid()::text
        OR user_id::text = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        OR user_id::text = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 9. RLS Policy: Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE
    USING (
        user_id::text = auth.uid()::text
        OR user_id::text = NULLIF(current_setting('request.jwt.claim.sub', true), '')
        OR user_id::text = NULLIF(current_setting('app.current_user_id', true), '')
    );

-- 10. RLS Policy: System services and admins can insert notifications
CREATE POLICY "System and admins can insert notifications" ON notifications
    FOR INSERT
    WITH CHECK (true);
