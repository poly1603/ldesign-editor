/**
 * 企业级功能导出
 */

// 认证和权限
export { PermissionManager, SSOManager } from './auth'
export type {
  User,
  Role,
  Permission,
  PermissionConfig,
  SSOConfig,
  SSOProvider,
  AuthResult,
  OAuth2Token
} from './auth'

// 审计日志
export { AuditLogger } from './audit'
export type {
  AuditLog,
  AuditConfig,
  AuditQuery,
  AuditReport
} from './audit'

