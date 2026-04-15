import { supabaseClient } from "./supabaseClient";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

export const resolveAvatarUrl = (avatarUrl?: string | null): string | null => {
    if (!avatarUrl) return null;

    // Local/static and already-public URLs should be used as-is.
    if (avatarUrl.startsWith("/") || avatarUrl.startsWith("data:") || ABSOLUTE_URL_REGEX.test(avatarUrl)) {
        return avatarUrl;
    }

    return supabaseClient.storage.from("avatar").getPublicUrl(avatarUrl).data.publicUrl;
};
