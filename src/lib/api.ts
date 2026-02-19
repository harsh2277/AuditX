import { supabase } from './supabase';
import type { Audit, Issue } from './supabase';

/**
 * API utilities for interacting with Supabase database
 */

// ============================================================================
// AUDIT OPERATIONS
// ============================================================================

/**
 * Create a new audit record
 */
export async function createAudit(auditData: {
    title: string;
    design_type: 'figma' | 'png' | 'pdf' | 'url';
    design_url?: string;
    design_image_url?: string;
    audit_depth: 'Quick' | 'Standard' | 'Deep';
    audit_score?: number;
}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated to create an audit');
    }

    const { data, error } = await supabase
        .from('audits')
        .insert({
            user_id: user.id,
            ...auditData,
            status: 'pending',
        })
        .select()
        .single();

    if (error) throw error;
    return data as Audit;
}

/**
 * Get all audits for the current user
 */
export async function getUserAudits() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
        .from('audits')
        .select('*, issues(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get a specific audit by ID
 */
export async function getAuditById(auditId: string) {
    const { data, error } = await supabase
        .from('audits')
        .select('*, issues(*)')
        .eq('id', auditId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Get a shared audit by share token
 */
export async function getSharedAudit(shareToken: string) {
    const { data, error } = await supabase
        .from('audits')
        .select('*, issues(*)')
        .eq('share_token', shareToken)
        .eq('is_shared', true)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update an audit
 */
export async function updateAudit(auditId: string, updates: Partial<Audit>) {
    const { data, error } = await supabase
        .from('audits')
        .update(updates)
        .eq('id', auditId)
        .select()
        .single();

    if (error) throw error;
    return data as Audit;
}

/**
 * Delete an audit
 */
export async function deleteAudit(auditId: string) {
    const { error } = await supabase
        .from('audits')
        .delete()
        .eq('id', auditId);

    if (error) throw error;
}

/**
 * Generate a share token and enable sharing for an audit
 */
export async function shareAudit(auditId: string) {
    const shareToken = crypto.randomUUID();

    const { data, error } = await supabase
        .from('audits')
        .update({
            is_shared: true,
            share_token: shareToken,
        })
        .eq('id', auditId)
        .select()
        .single();

    if (error) throw error;
    return { audit: data as Audit, shareUrl: `${window.location.origin}/audit/shared?token=${shareToken}` };
}

/**
 * Disable sharing for an audit
 */
export async function unshareAudit(auditId: string) {
    const { data, error } = await supabase
        .from('audits')
        .update({
            is_shared: false,
            share_token: null,
        })
        .eq('id', auditId)
        .select()
        .single();

    if (error) throw error;
    return data as Audit;
}

// ============================================================================
// ISSUE OPERATIONS
// ============================================================================

/**
 * Create multiple issues for an audit
 */
export async function createIssues(auditId: string, issues: Array<{
    title: string;
    category: 'Accessibility' | 'UX' | 'UI' | 'Layout' | 'Content';
    severity: 'High' | 'Medium' | 'Low';
    explanation: string;
    how_to_fix: string;
    suggestion: string;
    position_x: number;
    position_y: number;
}>) {
    const issuesWithAuditId = issues.map(issue => ({
        audit_id: auditId,
        ...issue,
        status: 'open' as const,
    }));

    const { data, error } = await supabase
        .from('issues')
        .insert(issuesWithAuditId)
        .select();

    if (error) throw error;
    return data as Issue[];
}

/**
 * Update an issue status
 */
export async function updateIssueStatus(issueId: string, status: 'open' | 'resolved') {
    const { data, error } = await supabase
        .from('issues')
        .update({ status })
        .eq('id', issueId)
        .select()
        .single();

    if (error) throw error;
    return data as Issue;
}

/**
 * Delete an issue
 */
export async function deleteIssue(issueId: string) {
    const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', issueId);

    if (error) throw error;
}

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get the current user's profile
 */
export async function getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: {
    full_name?: string;
    avatar_url?: string;
}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
