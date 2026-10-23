import type { PermissionStatus } from "@/features/notifications/types/permission-status";
import type { AppPermission } from "@/features/permissions/types/app-permission";

/** Where each permission stands — null until the system has said. */
export type PermissionsState = Record<AppPermission, PermissionStatus | null>;
