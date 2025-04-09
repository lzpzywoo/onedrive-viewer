import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import FormData from "form-data";
import querystring from 'querystring';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {code, state, error} = req.query;

    // 创建日志对象，我们将收集所有日志并返回给前端
    const logs: string[] = [];
    const addLog = (message: string) => {
        console.log(message); // 服务器端日志
        logs.push(message); // 给前端的日志
    };

    addLog(`认证回调被触发 - 时间: ${new Date().toISOString()}`);
    addLog(`请求参数: ${JSON.stringify(req.query)}`);

    // 检查错误
    if (error) {
        addLog(`收到错误: ${error}`);
        return sendErrorPage(res, `认证错误: ${error}`, logs);
    }

    // 检查是否有code
    if (!code) {
        addLog('没有收到授权码');
        return sendErrorPage(res, '没有收到授权码', logs);
    }

    // 记录state检查情况
    if (state) {
        addLog(`收到state: ${state}`);
    } else {
        addLog('警告: 没有收到state参数');
    }

    // 获取环境配置
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || '';

    // 记录配置情况
    if (!clientId) addLog('错误: 未配置客户端ID');

    if (!clientId) {
        return sendErrorPage(res, '缺少OAuth配置: 客户端ID', logs);
    }

    // 构建回调URL (与获取code时使用的URL必须完全匹配)
    const host = req.headers.host || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;
    addLog(`使用回调URL: ${redirectUri}`);

    // 尝试获取令牌
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            addLog(`尝试获取访问令牌... (尝试 ${retryCount + 1}/${maxRetries})`);

            const formData = new FormData()
            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', clientId);
            formData.append('client_secret', '');
            formData.append('code', code as string);
            formData.append('redirect_uri', redirectUri);

            addLog('准备发送令牌请求...');

            // 设置更长的超时时间
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: formData
            };

            const tokenResponse = await axios.request(config);
            addLog('✅ 成功获取令牌');

            const {access_token, refresh_token, expires_in} = tokenResponse.data;

            // 获取用户信息
            addLog('获取用户信息...');
            const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                timeout: 10000 // 10秒超时
            });

            addLog(`✅ 获取到用户: ${graphResponse.data.displayName}`);

            // 创建用户对象
            const user = {
                id: graphResponse.data.id,
                displayName: graphResponse.data.displayName,
                email: graphResponse.data.userPrincipalName,
                photo: null
            };

            // 设置会话cookie
            res.setHeader('Set-Cookie', [
                `access_token=${access_token}; HttpOnly; Path=/; Max-Age=${expires_in}; SameSite=Lax`,
                `refresh_token=${refresh_token}; HttpOnly; Path=/; Max-Age=7776000; SameSite=Lax`, // 90天
            ]);

            addLog('✅ 已设置认证cookie');

            // 渲染成功页面并自动重定向到首页
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>登录成功</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 40px 20px;
                max-width: 700px;
                margin: 0 auto;
                line-height: 1.5;
              }
              .card {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 20px;
                margin-bottom: 20px;
              }
              h1 { color: #0078d4; }
              .success-icon {
                color: #107C10;
                font-size: 48px;
                margin-bottom: 16px;
              }
              .user-info {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .redirect-message {
                font-size: 14px;
                color: #666;
                margin-top: 20px;
              }
              .debug {
                background: #333;
                color: #0f0;
                font-family: monospace;
                padding: 15px;
                border-radius: 4px;
                font-size: 12px;
                max-height: 200px;
                overflow-y: auto;
                margin-top: 30px;
              }
              .debug-line {
                margin-bottom: 4px;
              }
            </style>
            <script>
              // 保存用户信息到localStorage
              const user = ${JSON.stringify(user)};
              localStorage.setItem('onedrive-viewer-user', JSON.stringify(user));
              
              // 5秒后重定向到首页
              setTimeout(() => {
                window.location.href = '/?auth=success';
              }, 5000);
            </script>
          </head>
          <body>
            <div class="card">
              <div class="success-icon">✓</div>
              <h1>登录成功!</h1>
              <p>您已成功登录到OneDrive文件浏览器。</p>
              
              <div class="user-info">
                <strong>用户名:</strong> ${user.displayName}<br>
                <strong>邮箱:</strong> ${user.email}
              </div>
              
              <p class="redirect-message">页面将在5秒内自动跳转到首页...</p>
            </div>
            
            <div class="debug">
              <div style="font-weight: bold; margin-bottom: 8px;">调试日志:</div>
              ${logs.map(log => `<div class="debug-line">${log}</div>`).join('')}
            </div>
          </body>
        </html>
      `);

            // 成功获取令牌并设置cookie，跳出循环
            break;

        } catch (error: any) {
            addLog(`❌ 尝试 ${retryCount + 1} 失败:`);
            console.log(error);
            if (error.response) {
                addLog(`状态码: ${error.response.status}`);
                addLog(`错误信息: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                addLog(`请求失败: ${error.message}`);
                if (error.code === 'ECONNABORTED') {
                    addLog('请求超时');
                }
            } else {
                addLog(`错误: ${error.message || '未知错误'}`);
            }

            retryCount++;

            if (retryCount < maxRetries) {
                const delayMs = 1000 * retryCount; // 逐渐增加重试等待时间
                addLog(`等待 ${delayMs}ms 后重试...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                addLog('所有重试尝试都失败了');
                return sendErrorPage(res, '获取令牌失败，请稍后重试', logs);
            }
        }
    }
}

function sendErrorPage(res: NextApiResponse, errorMessage: string, logs: string[]) {
    res.setHeader('Content-Type', 'text/html');
    res.status(400).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>登录失败</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 40px 20px;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.5;
          }
          .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
          }
          h1 { color: #d83b01; }
          .error-icon {
            color: #d83b01;
            font-size: 48px;
            margin-bottom: 16px;
          }
          .error-message {
            background: #FEF0F0;
            color: #d83b01;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .redirect-message {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
          }
          .debug {
            background: #333;
            color: #0f0;
            font-family: monospace;
            padding: 15px;
            border-radius: 4px;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 30px;
          }
          .debug-line {
            margin-bottom: 4px;
          }
          .actions {
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            background: #0078d4;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            margin-right: 10px;
          }
        </style>
        <script>
          // 10秒后重定向到首页
          setTimeout(() => {
            window.location.href = '/?auth=failed';
          }, 10000);
        </script>
      </head>
      <body>
        <div class="card">
          <div class="error-icon">✗</div>
          <h1>登录失败</h1>
          <p>在认证过程中遇到了问题。</p>
          
          <div class="error-message">
            <strong>错误:</strong> ${errorMessage}
          </div>
          
          <div class="actions">
            <a href="/api/auth/login" class="button">重试登录</a>
            <a href="/" class="button" style="background: #f0f0f0; color: #333;">返回首页</a>
          </div>
          
          <p class="redirect-message">页面将在10秒内自动跳转到首页...</p>
        </div>
        
        <div class="debug">
          <div style="font-weight: bold; margin-bottom: 8px;">调试日志:</div>
          ${logs.map(log => `<div class="debug-line">${log}</div>`).join('')}
        </div>
      </body>
    </html>
  `);
}
