import { useState } from "react";
import { Bike, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log("登录:", { email, password });
    } else {
      console.log("注册:", { name, email, password });
    }
  };

  return (
    <div className="size-full flex">
      {/* 左侧背景图片区域 */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1772456595053-98eb00580bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5JTIwc3RyZWV0fGVufDF8fHx8MTc3MzE5NTUxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="电动滑板车背景"
          className="w-full h-full object-cover"
        />
        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        
        {/* 品牌标语 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <Bike className="w-24 h-24 mb-6 drop-shadow-2xl" strokeWidth={1.5} />
          <h1 className="text-5xl mb-4 drop-shadow-lg">WheelyGood</h1>
          <p className="text-xl opacity-90 text-center max-w-md drop-shadow-lg">
            现代化的智能滑板车服务
            <br />
            开启您的绿色出行之旅
          </p>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo 和标题 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4">
              <Bike className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl mb-2">
              {isLogin ? "欢迎回来" : "创建账户"}
            </h2>
            <p className="text-gray-500">
              {isLogin ? "登录以继续您的旅程" : "加入我们，开始便捷出行"}
            </p>
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-3xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-3xl transition-all duration-300 ${
                isLogin
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-3xl transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 姓名输入框 - 仅注册时显示 */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 border-0 rounded-3xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  required={!isLogin}
                />
              </div>
            )}

            {/* 邮箱输入框 */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-gray-50 border-0 rounded-3xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                required
              />
            </div>

            {/* 密码输入框 */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-gray-50 border-0 rounded-3xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* 忘记密码 - 仅登录时显示 */}
            {isLogin && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1.5 group"
                >
                  <span>忘记密码？</span>
                  <Bike className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-3xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">
                {isLogin ? "立即登录" : "立即注册"}
              </span>
              <Bike className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 社交登录分隔线 */}
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">或者</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* 社交登录按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                className="py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            </div>
          </form>

          {/* 底部链接 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              继续即表示您同意我们的
              <button
                type="button"
                className="text-purple-600 hover:underline ml-1"
              >
                服务条款
              </button>
              和
              <button
                type="button"
                className="text-purple-600 hover:underline ml-1"
              >
                隐私政策
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}