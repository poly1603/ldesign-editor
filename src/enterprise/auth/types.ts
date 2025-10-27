/**
 * 企业级认证类型定义
 */

/**
 * 用户
 */
export interface User {
  /** 用户ID */
  id: string
  /** 用户名 */
  name: string
  /** 邮箱 */
  email?: string
  /** 头像 */
  avatar?: string
  /** 角色列表 */
  roles?: string[]
  /** 所属部门 */
  department?: string
  /** 自定义属性 */
  metadata?: Record<string, any>
}

/**
 * 角色
 */
export interface Role {
  /** 角色ID */
  id: string
  /** 角色名称 */
  name: string
  /** 描述 */
  description?: string
  /** 权限列表 */
  permissions: string[]
  /** 继承的角色 */
  inherits?: string[]
  /** 优先级 */
  priority?: number
  /** 是否为系统角色 */
  system?: boolean
}

/**
 * 权限
 */
export interface Permission {
  /** 权限ID */
  id: string
  /** 权限名称 */
  name: string
  /** 资源类型 */
  resource: string
  /** 操作类型 */
  action: string
  /** 描述 */
  description?: string
  /** 条件 */
  conditions?: PermissionCondition[]
}

/**
 * 权限条件
 */
export interface PermissionCondition {
  /** 条件类型 */
  type: 'time' | 'ip' | 'attribute' | 'custom'
  /** 条件参数 */
  params: any
  /** 条件函数 */
  evaluate?: (context: any) => boolean
}

/**
 * 权限配置
 */
export interface PermissionConfig {
  /** 严格模式（默认拒绝） */
  strictMode?: boolean
  /** 缓存权限检查结果 */
  cachePermissions?: boolean
  /** 是否启用角色继承 */
  inheritRoles?: boolean
}

/**
 * 权限事件
 */
export interface PermissionEvents {
  /** 用户变更 */
  'user-changed': (user: User) => void
  /** 角色分配 */
  'role-assigned': (data: { userId: string; roleId: string }) => void
  /** 角色移除 */
  'role-removed': (data: { userId: string; roleId: string }) => void
  /** 权限拒绝 */
  'permission-denied': (data: { permissionId: string; userId?: string }) => void
}

/**
 * SSO提供商
 */
export type SSOProvider =
  | 'oauth2'
  | 'saml'
  | 'oidc'
  | 'ldap'
  | 'ad'
  | 'cas'
  | 'custom'

/**
 * SSO配置
 */
export interface SSOConfig {
  /** 提供商类型 */
  provider: SSOProvider
  /** 客户端ID */
  clientId?: string
  /** 客户端密钥 */
  clientSecret?: string
  /** 授权URL */
  authorizationUrl?: string
  /** Token URL */
  tokenUrl?: string
  /** 用户信息URL */
  userInfoUrl?: string
  /** 回调URL */
  redirectUri?: string
  /** 作用域 */
  scope?: string[]
  /** LDAP配置 */
  ldap?: LDAPConfig
  /** SAML配置 */
  saml?: SAMLConfig
  /** 自定义配置 */
  custom?: Record<string, any>
}

/**
 * LDAP配置
 */
export interface LDAPConfig {
  /** LDAP服务器URL */
  url: string
  /** 基础DN */
  baseDN: string
  /** 绑定DN */
  bindDN?: string
  /** 绑定密码 */
  bindPassword?: string
  /** 用户搜索过滤器 */
  userSearchFilter?: string
  /** 用户属性映射 */
  userAttributes?: {
    id: string
    username: string
    email: string
    name: string
  }
}

/**
 * SAML配置
 */
export interface SAMLConfig {
  /** 实体ID */
  entityId: string
  /** 断言消费服务URL */
  assertionConsumerServiceUrl: string
  /** 单点登录URL */
  singleSignOnServiceUrl: string
  /** 证书 */
  cert: string
  /** 私钥 */
  privateKey?: string
}

/**
 * OAuth2 Token
 */
export interface OAuth2Token {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken?: string
  /** Token类型 */
  tokenType: string
  /** 过期时间（秒） */
  expiresIn: number
  /** 作用域 */
  scope?: string
  /** 过期时间戳 */
  expiresAt: number
}

/**
 * 认证状态
 */
export type AuthStatus =
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated'
  | 'error'

/**
 * 认证结果
 */
export interface AuthResult {
  /** 是否成功 */
  success: boolean
  /** 用户信息 */
  user?: User
  /** Token */
  token?: OAuth2Token
  /** 错误信息 */
  error?: string
}

/**
 * 认证事件
 */
export interface AuthEvents {
  /** 登录成功 */
  'login': (user: User) => void
  /** 登出 */
  'logout': () => void
  /** 认证状态变化 */
  'auth-status': (status: AuthStatus) => void
  /** Token刷新 */
  'token-refreshed': (token: OAuth2Token) => void
  /** 认证错误 */
  'auth-error': (error: Error) => void
}

/**
 * 会话信息
 */
export interface Session {
  /** 会话ID */
  id: string
  /** 用户ID */
  userId: string
  /** 创建时间 */
  createdAt: number
  /** 过期时间 */
  expiresAt: number
  /** 最后活动时间 */
  lastActivity: number
  /** IP地址 */
  ip?: string
  /** User Agent */
  userAgent?: string
  /** 自定义数据 */
  data?: Record<string, any>
}

