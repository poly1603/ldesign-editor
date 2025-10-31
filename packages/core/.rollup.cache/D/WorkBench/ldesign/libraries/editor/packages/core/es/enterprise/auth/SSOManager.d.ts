/**
 * SSO管理器
 * 支持OAuth2、SAML、OIDC、LDAP等多种SSO协议
 */
import type { AuthEvents, AuthResult, AuthStatus, OAuth2Token, SSOConfig, User } from './types';
import { EventEmitter } from '../../core/EventEmitter';
export declare class SSOManager extends EventEmitter<AuthEvents> {
    private config;
    private status;
    private currentToken?;
    private currentUser?;
    private refreshTimer?;
    constructor(config: SSOConfig);
    /**
     * 登录
     */
    login(): Promise<AuthResult>;
    /**
     * OAuth2/OIDC登录
     */
    private loginOAuth2;
    /**
     * SAML登录
     */
    private loginSAML;
    /**
     * LDAP登录
     */
    private loginLDAP;
    /**
     * 登出
     */
    logout(): Promise<void>;
    /**
     * 刷新Token
     */
    refreshToken(): Promise<OAuth2Token>;
    /**
     * 启动Token自动刷新
     */
    private startTokenRefresh;
    /**
     * 停止Token刷新
     */
    private stopTokenRefresh;
    /**
     * 等待OAuth回调
     */
    private waitForCallback;
    /**
     * 生成state参数
     */
    private generateState;
    /**
     * 设置状态
     */
    private setStatus;
    /**
     * 获取当前用户
     */
    getCurrentUser(): User | undefined;
    /**
     * 获取当前Token
     */
    getCurrentToken(): OAuth2Token | undefined;
    /**
     * 获取认证状态
     */
    getStatus(): AuthStatus;
    /**
     * 是否已认证
     */
    isAuthenticated(): boolean;
    /**
     * 销毁
     */
    destroy(): void;
}
