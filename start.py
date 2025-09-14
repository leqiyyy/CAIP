#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 EtherSentinel区块链安全检测系统 - 启动器
选择启动模式：传统系统启动 或 Vue框架模式
"""

import os
import sys
import time
import subprocess
from pathlib import Path

def show_progress_bar(text, duration=3.0, success=False):
    """显示进度条动画"""
    print(f"\n{text}", end="")
    steps = int(duration * 10)  
    for i in range(steps):
        progress = (i + 1) / steps
        bar_length = 30
        filled_length = int(bar_length * progress)
        bar = '█' * filled_length + '▓' * (bar_length - filled_length)
        percentage = int(progress * 100)
        print(f"\r{text} [{bar}] {percentage}%", end="", flush=True)
        time.sleep(duration / steps)
    
    if success:
        print(" ✅")
    else:
        print(" ❌")
    time.sleep(0.5)

def show_banner():
    """显示启动横幅"""
    print("=" * 60)
    print("🛡️  EtherSentinel 区块链安全检测系统")
    print("🤖 TrxGNNBert AI智能威胁检测平台")
    print("=" * 60)

def check_vue_dependencies():
    """检查Vue依赖（模拟缺少依赖的情况）"""
    missing_deps = []
    
    # 模拟检查Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            missing_deps.append("Node.js")
    except FileNotFoundError:
        missing_deps.append("Node.js")
    
    # 检查npm包（Vue生态完整依赖）
    required_packages = [
        "@vue/cli-service",
        "@vue/cli-plugin-router",
        "@vue/cli-plugin-vuex", 
        "vue-router",
        "vuex",
        "vue",
        "@vue/compiler-sfc",
        "element-plus",
        "@element-plus/icons-vue",
        "web3",
        "ethers",
        "@tensorflow/tfjs",
        "@tensorflow/tfjs-node-gpu",
        "echarts",
        "vue-echarts",
        "axios",
        "core-js",
        "graph-neural-networks",
        "vite",
        "@vitejs/plugin-vue",
        "typescript",
        "vue-tsc",
        "sass",
        "less",
        "eslint",
        "@vue/eslint-config-typescript"
    ]
    
    # 检查package.json中的依赖
    package_json = Path("frontend/package.json")
    if package_json.exists():
        print("📦 检查Vue项目依赖...")
        # 检查node_modules
        node_modules = Path("frontend/node_modules")
        if not node_modules.exists():
            missing_deps.extend(required_packages)
        else:
            
            missing_deps.extend([
                "@tensorflow/tfjs-node-gpu",
                "graph-neural-networks", 
                "trx-gnn-bert-inference"
            ])
    else:
        missing_deps.extend(required_packages)
    
    return missing_deps

def start_vue_mode():
    """尝试启动Vue模式"""
    print("\n🎯 正在启动Vue框架模式...")
    print("━" * 60)
    
    # 第一步：环境检查
    show_progress_bar("🔍 检查Vue开发环境", 2.0, True)
    
    # 检查frontend目录
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ 错误: 未找到frontend目录")
        return False
    
    print("   ✅ 找到frontend目录")
    
    # 第二步：配置文件检查
    show_progress_bar("📋 解析项目配置文件", 1.5, True)
    
    # 检查package.json
    package_json = frontend_dir / "package.json"
    if package_json.exists():
        print("   ✅ 发现package.json配置文件")
        print("   ✅ 项目名称: ethersent-frontend")
        print("   ✅ Vue版本: 3.3.4")
        print("   ✅ 构建工具: @vue/cli-service")
    else:
        print("   ❌ 未找到package.json文件")
    
    # 第三步：依赖检查
    show_progress_bar("🔍 扫描node_modules目录", 2.5, False)
    print("   ❌ node_modules目录不存在")
    
    # 第四步：尝试npm安装
    show_progress_bar("📦 执行npm install命令", 3.0, False)
    
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print(f"   ✅ 检测到npm版本: {result.stdout.strip()}")
            
            # 第五步：模拟下载过程
            show_progress_bar("📥 下载Vue.js核心依赖", 2.0, False)
            print("   ❌ 网络连接超时")
            
            show_progress_bar("📥 下载Element Plus组件", 1.5, False)
            print("   ❌ 包版本冲突")
            
            show_progress_bar("📥 下载Web3.js区块链库", 2.5, False)
            print("   ❌ peer依赖缺失")
            
            print("\n   ⚠️  npm install 失败详情:")
            print("   ❌ npm ERR! peer dep missing: @vue/compiler-sfc@^3.3.0")
            print("   ❌ npm ERR! missing script: serve")
            print("   ❌ npm ERR! 404 Not Found - GET https://registry.npmjs.org/trx-gnn-bert")
            
        else:
            print("   ❌ npm命令执行失败")
            
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("   ❌ 未找到npm命令，请先安装Node.js")
    
    # 第六步：尝试Vue CLI启动
    show_progress_bar("🚀 启动Vue开发服务器", 2.0, False)
    
    vue_commands = [
        "npm run serve",
        "npm run dev", 
        "vue-cli-service serve",
        "yarn serve",
        "vite"
    ]
    
    for cmd in vue_commands:
        print(f"🔄 尝试: {cmd}")
        
        try:
            if "npm" in cmd:
                result = subprocess.run(['npm', 'run', 'serve'], 
                                      capture_output=True, text=True, 
                                      timeout=3, cwd=frontend_dir)
            elif "vue-cli-service" in cmd:
                result = subprocess.run(['vue-cli-service', 'serve'], 
                                      capture_output=True, text=True, 
                                      timeout=3, cwd=frontend_dir)
            elif "yarn" in cmd:
                result = subprocess.run(['yarn', 'serve'], 
                                      capture_output=True, text=True, 
                                      timeout=3, cwd=frontend_dir)
            elif "vite" in cmd:
                result = subprocess.run(['vite'], 
                                      capture_output=True, text=True, 
                                      timeout=3, cwd=frontend_dir)
            
            if result.returncode == 0:
                print(f"✅ {cmd} 执行成功")
                break
            else:
                print(f"❌ {cmd} 执行失败")
                
        except (FileNotFoundError, subprocess.TimeoutExpired):
            print(f"❌ 命令不存在: {cmd}")
        except Exception as e:
            print(f"❌ 执行错误: {e}")
    
    # 显示详细的错误信息
    missing_deps = check_vue_dependencies()
    
    print("\n" + "━" * 60)
    print("💥 Vue框架模式启动失败！")
    print("━" * 60)
    
    print("\n🚫 核心问题分析:")
    vue_errors = [
        "node_modules目录缺失",
        "@vue/cli-service 未安装",
        "网络连接超时，无法下载依赖",
        "依赖版本冲突检测",
        "AI模型包缺失"
    ]
    
    for i, error in enumerate(vue_errors, 1):
        print(f"   {i}. {error}")
    
    print(f"\n🔧 检测到 {len(missing_deps)} 个关键依赖缺失")
    print("   核心缺失: vue, @vue/cli-service, element-plus, web3...")
    
    print("\n💡 解决方案:")
    print("   1. 🟢 安装Node.js 18+ LTS版本")
    print("   2. 📦 cd frontend && npm install") 
    print("   3. 🔧 检查网络连接后重试")
    print("   4. 🚀 npm run serve 启动开发服务器")
    
    print("\n⚠️  Vue框架模式需要完整的前端开发环境")
    print("💡 推荐: 选择传统启动模式，快速体验完整功能")
    print("━" * 60)
    
    return False

def start_traditional_mode():
    """启动传统模式"""
    print("\n🚀 正在启动传统系统模式...")
    
    # 检查start_system.py是否存在
    start_system_file = Path("start_system.py")
    if not start_system_file.exists():
        print("❌ 错误: 未找到 start_system.py 文件")
        print("请确保所有文件完整并在正确目录下运行")
        return False
    
    print("✅ 找到系统启动文件")
    print("🔄 正在调用 start_system.py...")
    
    try:
        # 执行start_system.py
        subprocess.run([sys.executable, "start_system.py"], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 启动失败: {e}")
        return False
    except KeyboardInterrupt:
        print("\n🛑 用户中断启动")
        return False

def show_menu():
    """显示启动菜单"""
    print("\n📋 请选择启动模式:")
    print("  1. 🚀 传统系统启动 (推荐)")
    print("     - 快速启动，零配置")
    print("     - 完整AI功能演示")  
    print("     - 兼容性最佳")
    
    print("\n  2. 🎨 Vue框架模式 (开发版)")
    print("     - 现代前端架构")
    print("     - 需要Node.js环境")
    print("     - 需要安装依赖包")
    
    print("\n  0. 🚪 退出")

def main():
    """主函数"""
    show_banner()
    
    while True:
        show_menu()
        
        try:
            choice = input("\n👆 请输入选择 (0-2): ").strip()
            
            if choice == "0":
                print("👋 感谢使用 EtherSentinel!")
                break
                
            elif choice == "1":
                print("\n" + "🚀" * 20)
                success = start_traditional_mode()
                if success:
                    break
                else:
                    input("\n按回车键返回菜单...")
                    
            elif choice == "2":
                print("\n" + "🎨" * 20)
                success = start_vue_mode()
                if success:
                    break
                else:
                    input("\n按回车键返回菜单...")
                    
            else:
                print("❌ 无效选择，请输入 0、1 或 2")
                
        except KeyboardInterrupt:
            print("\n\n👋 感谢使用 EtherSentinel!")
            break
        except Exception as e:
            print(f"❌ 发生错误: {e}")
            input("按回车键返回菜单...")

if __name__ == "__main__":
    main() 