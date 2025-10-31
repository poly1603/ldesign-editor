/**
 * 企业级功能导出
 */

// 审计日志
export { AuditLogger } from './audit'
export type {
  AuditConfig,
  AuditLog,
  AuditQuery,
  AuditReport,
} from './audit'

// 认证和权限
export { PermissionManager, SSOManager } from './auth'
export type {
  AuthResult,
  OAuth2Token,
  Permission,
  PermissionConfig,
  Role,
  SSOConfig,
  SSOProvider,
  User,
} from './auth'
