/**
 * 企业级认证模块导出
 */

export { PermissionManager } from './PermissionManager'
export { SSOManager } from './SSOManager'

export type {
  User,
  Role,
  Permission,
  PermissionConfig,
  PermissionEvents,
  PermissionCondition,
  SSOProvider,
  SSOConfig,
  LDAPConfig,
  SAMLConfig,
  OAuth2Token,
  AuthStatus,
  AuthResult,
  AuthEvents,
  Session
} from './types'

