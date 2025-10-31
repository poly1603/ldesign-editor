/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-10-30 16:01:17 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { EventEmitter } from '../../utils/event.js';
import { createLogger } from '../../utils/logger.js';

/**
 * SSO管理器
 * 支持OAuth2、SAML、OIDC、LDAP等多种SSO协议
 */
const logger = createLogger('SSOManager');
class SSOManager extends EventEmitter {
    constructor(config) {
        super();
        this.status = 'unauthenticated';
        this.config = config;
    }
    /**
     * 登录
     */
    async login() {
        this.setStatus('authenticating');
        try {
            logger.info(`Authenticating with ${this.config.provider}`);
            let result;
            switch (this.config.provider) {
                case 'oauth2':
                case 'oidc':
                    result = await this.loginOAuth2();
                    break;
                case 'saml':
                    result = await this.loginSAML();
                    break;
                case 'ldap':
                case 'ad':
                    result = await this.loginLDAP();
                    break;
                default:
                    throw new Error(`Unsupported SSO provider: ${this.config.provider}`);
            }
            if (result.success && result.user) {
                this.currentUser = result.user;
                this.currentToken = result.token;
                this.setStatus('authenticated');
                this.emit('login', result.user);
                // 启动token刷新
                if (result.token)
                    this.startTokenRefresh(result.token);
                logger.info(`Login successful: ${result.user.name}`);
            }
            else {
                this.setStatus('error');
                logger.error('Login failed:', result.error);
            }
            return result;
        }
        catch (error) {
            this.setStatus('error');
            this.emit('auth-error', error);
            logger.error('Login error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    /**
     * OAuth2/OIDC登录
     */
    async loginOAuth2() {
        // 构建授权URL
        const authUrl = new URL(this.config.authorizationUrl);
        authUrl.searchParams.set('client_id', this.config.clientId);
        authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', (this.config.scope || ['openid', 'profile', 'email']).join(' '));
        authUrl.searchParams.set('state', this.generateState());
        // 打开授权窗口
        const authWindow = window.open(authUrl.toString(), 'sso-auth', 'width=600,height=700');
        // 等待回调
        const code = await this.waitForCallback(authWindow);
        // 交换code获取token
        const tokenResponse = await fetch(this.config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                redirect_uri: this.config.redirectUri,
            }),
        });
        if (!tokenResponse.ok)
            throw new Error('Failed to exchange code for token');
        const tokenData = await tokenResponse.json();
        const token = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenType: tokenData.token_type || 'Bearer',
            expiresIn: tokenData.expires_in || 3600,
            scope: tokenData.scope,
            expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000,
        };
        // 获取用户信息
        const userResponse = await fetch(this.config.userInfoUrl, {
            headers: {
                Authorization: `${token.tokenType} ${token.accessToken}`,
            },
        });
        if (!userResponse.ok)
            throw new Error('Failed to fetch user info');
        const userData = await userResponse.json();
        const user = {
            id: userData.sub || userData.id,
            name: userData.name || userData.username,
            email: userData.email,
            avatar: userData.picture || userData.avatar,
        };
        return {
            success: true,
            user,
            token,
        };
    }
    /**
     * SAML登录
     */
    async loginSAML() {
        // SAML登录流程
        logger.info('SAML login not fully implemented in this demo');
        // 简化实现：重定向到SAML IdP
        if (this.config.saml?.singleSignOnServiceUrl)
            window.location.href = this.config.saml.singleSignOnServiceUrl;
        return {
            success: false,
            error: 'SAML authentication requires server-side implementation',
        };
    }
    /**
     * LDAP登录
     */
    async loginLDAP() {
        // LDAP认证需要服务器端支持
        logger.info('LDAP authentication requires server-side support');
        // 调用后端API进行LDAP认证
        const response = await fetch('/api/auth/ldap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: prompt('用户名:'),
                password: prompt('密码:'),
            }),
        });
        if (!response.ok)
            throw new Error('LDAP authentication failed');
        const data = await response.json();
        return {
            success: true,
            user: data.user,
            token: data.token,
        };
    }
    /**
     * 登出
     */
    async logout() {
        logger.info('Logging out');
        this.stopTokenRefresh();
        this.currentUser = undefined;
        this.currentToken = undefined;
        this.setStatus('unauthenticated');
        this.emit('logout');
        logger.info('Logged out successfully');
    }
    /**
     * 刷新Token
     */
    async refreshToken() {
        if (!this.currentToken?.refreshToken)
            throw new Error('No refresh token available');
        logger.info('Refreshing token');
        const response = await fetch(this.config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.currentToken.refreshToken,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
            }),
        });
        if (!response.ok)
            throw new Error('Failed to refresh token');
        const data = await response.json();
        const newToken = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || this.currentToken.refreshToken,
            tokenType: data.token_type || 'Bearer',
            expiresIn: data.expires_in || 3600,
            expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
        };
        this.currentToken = newToken;
        this.emit('token-refreshed', newToken);
        logger.info('Token refreshed successfully');
        return newToken;
    }
    /**
     * 启动Token自动刷新
     */
    startTokenRefresh(token) {
        // 在过期前5分钟刷新
        const refreshTime = token.expiresAt - Date.now() - 5 * 60 * 1000;
        if (refreshTime > 0) {
            this.refreshTimer = window.setTimeout(async () => {
                try {
                    await this.refreshToken();
                }
                catch (error) {
                    logger.error('Token refresh failed:', error);
                    this.emit('auth-error', error);
                }
            }, refreshTime);
        }
    }
    /**
     * 停止Token刷新
     */
    stopTokenRefresh() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = undefined;
        }
    }
    /**
     * 等待OAuth回调
     */
    async waitForCallback(authWindow) {
        return new Promise((resolve, reject) => {
            // 监听消息事件
            const messageHandler = (event) => {
                if (event.data.type === 'oauth-callback') {
                    window.removeEventListener('message', messageHandler);
                    authWindow?.close();
                    if (event.data.code)
                        resolve(event.data.code);
                    else
                        reject(new Error(event.data.error || 'Authentication failed'));
                }
            };
            window.addEventListener('message', messageHandler);
            // 超时处理
            setTimeout(() => {
                window.removeEventListener('message', messageHandler);
                authWindow?.close();
                reject(new Error('Authentication timeout'));
            }, 60000);
        });
    }
    /**
     * 生成state参数
     */
    generateState() {
        return Math.random().toString(36).substring(2, 15);
    }
    /**
     * 设置状态
     */
    setStatus(status) {
        this.status = status;
        this.emit('auth-status', status);
    }
    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    }
    /**
     * 获取当前Token
     */
    getCurrentToken() {
        return this.currentToken;
    }
    /**
     * 获取认证状态
     */
    getStatus() {
        return this.status;
    }
    /**
     * 是否已认证
     */
    isAuthenticated() {
        return this.status === 'authenticated' && !!this.currentUser;
    }
    /**
     * 销毁
     */
    destroy() {
        this.stopTokenRefresh();
        this.removeAllListeners();
        logger.info('SSO manager destroyed');
    }
}

export { SSOManager };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=SSOManager.js.map
