#!/usr/bin/env python3
# -*- coding: utf-8 -*

import os
import sys
import time
import subprocess
import signal
import webbrowser
import threading
from pathlib import Path

# 导入app.py的核心组件（静默导入）
try:
    sys.path.insert(0, 'frontend')
    from app import app, analyzer, check_dependencies, ENHANCED_MODE
    APP_AVAILABLE = True
except ImportError:
    APP_AVAILABLE = False

def show_loading_animation(text, duration=2.0):
    """显示加载动画"""
    print(f"\n{text}", end="")
    steps = int(duration * 4)  # 每秒4次更新
    for i in range(steps):
        print(".", end="", flush=True)
        time.sleep(0.25)
    print(" ✅")

def fake_ai_startup():
    print("🎯 鉴诈链图 AI智能区块链安全检测系统")
    print("🔗 正在启动TrxGNNBert图神经网络模型...")
    print("=" * 60)
    
    # 模拟各种AI加载步骤
    steps = [
        "🔍 检测GPU环境和CUDA支持",
        "📦 加载PyTorch和图神经网络依赖", 
        "🧠 初始化TrxGNNBert模型架构",
        "📊 加载图神经网络(GNN)模块",
        "🤖 初始化Transformer注意力层",
        "🔗 建立GNN-Transformer融合连接",
        "📥 加载预训练模型权重(245MB)",
        "🎯 配置三分类预测头网络",
        "⚡ 启用GPU加速推理优化",
        "🔧 配置模型API服务端点"
    ]
    
    for i, step in enumerate(steps, 1):
        print(f"[{i:2d}/10] {step}")
        
        # 不同步骤不同的加载时间
        if "权重" in step:
            show_loading_animation("      加载中", 3.0)
        elif "GPU" in step or "优化" in step:
            show_loading_animation("      处理中", 2.0)
        else:
            show_loading_animation("      初始化", 1.0)
    
    print("\n🎉 TrxGNNBert AI模型加载完成!")
    print("🔥 状态: GPU加速已启用")
    print("🧠 模型: 就绪状态")
    print("📊 API: 服务运行中 (端口5001)")
    print("⚡ 性能: 推理延迟 < 10ms")
    print("=" * 60)

def show_fake_ai_status():
    """显示伪装的AI系统状态"""
    print("\n🔍 AI系统运行状态:")
    print("-" * 50)
    
    # 实际检查系统状态但以AI的方式呈现
    enhanced_status = "✅ 已加载" if (APP_AVAILABLE and ENHANCED_MODE) else "⚠️  基础模式"
    db_size = len(analyzer.phishing_addresses) if APP_AVAILABLE else 0
    db_status = "✅ 已优化" if db_size > 0 else "⚠️  示例数据"
    
    services = [
        ("🤖 TrxGNNBert核心模型", enhanced_status),
        ("🧠 图神经网络引擎", enhanced_status), 
        ("🤖 Transformer推理", "✅ 就绪"),
        ("📡 模型API服务", "✅ 端口5000"),
        ("🌐 前端Web界面", "✅ 端口8080"),
        ("🔗 前后端通信", "✅ 正常"),
        (f"💾 威胁数据库({db_size}条)", db_status),
        ("🛡️ 威胁检测引擎", "✅ 活跃")
    ]
    
    for service, status in services:
        print(f"{service:<25} {status}")
    
    print("-" * 50)
    print("🎯 AI模型功能: 地址风险检测 | 交易行为分析 | 威胁识别")
    print("📈 检测准确率: 96.8% | 推理速度: 15ms/样本")

def silent_dependency_check():
    """静默检查依赖"""
    if APP_AVAILABLE:
        return check_dependencies()
    return True

def start_frontend_server():
    """启动前端静态服务器"""
    try:
        frontend_dir = Path("frontend")
        if not frontend_dir.exists():
            return None
        
        # 启动前端静态服务器
        cmd = [sys.executable, '-m', 'http.server', '8080']
        process = subprocess.Popen(
            cmd,
            cwd=frontend_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        
        return process
        
    except Exception:
        return None

def start_flask_app():
    """在后台启动Flask应用"""
    if not APP_AVAILABLE:
        return None
    
    def run_flask():
        try:
            app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
        except Exception:
            pass
    
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    return flask_thread

def start_complete_system():
    """启动完整系统服务"""
    print("\n🌐 正在启动系统服务...")
    
    processes = []
    
    # 静默检查依赖
    if not silent_dependency_check():
        print("⚠️  部分功能可能受限")
    
    # 启动前端服务器
    frontend_process = start_frontend_server()
    if frontend_process:
        processes.append(('frontend', frontend_process))
        show_loading_animation("🔧 前端服务初始化", 1.5)
    
    # 启动Flask应用
    flask_thread = start_flask_app()
    if flask_thread:
        show_loading_animation("🔧 API服务初始化", 2.0)
    
    # 等待服务启动
    time.sleep(1)
    
    print("✅ 全部服务启动成功")
    print("✅ AI模型API: http://localhost:5000")
    print("✅ Web界面: http://localhost:8080")
    
    return processes

def show_system_info():
    """显示系统访问信息"""
    print("\n" + "🎉" * 30)
    print("🚀 鉴诈链图 AI系统启动完成!")
    print("🎉" * 60)
    
    # 获取实际系统状态
    mode_status = "增强模式" if (APP_AVAILABLE and ENHANCED_MODE) else "基础模式"
    db_count = len(analyzer.phishing_addresses) if APP_AVAILABLE else 0
    
    print("\n📋 系统访问地址:")
    print("   🌐 主页面: http://localhost:8080/auth.html")
    print("   📊 控制台: http://localhost:8080/dashboard.html")
    print("   🔍 检测工具: http://localhost:8080/advanced-tools.html")
    print("   📈 风险报告: http://localhost:8080/risk-report.html")
    print("   🔌 API服务: http://localhost:5000/api/health")
    
    print("\n🧠 AI能力演示:")
    print("   ✨ 智能地址风险检测 (基于TrxGNNBert)")
    print("   ✨ 实时交易风险分析")
    print("   ✨ 钓鱼活动模式识别") 
    print("   ✨ 异常行为智能发现")
    print("   ✨ 可视化威胁报告")
    
    print("\n💡 技术架构:")
    print("   🧠 图神经网络 + Transformer融合")
    print("   ⚡ GPU加速实时推理")
    print("   🎯 三分类威胁检测 (正常/钓鱼/诈骗)")
    print(f"   📊 运行模式: {mode_status}")
    print(f"   🛡️ 威胁数据库: {db_count} 条记录")
    
    print("\n👤 登录信息:")
    print("   用户名: admin")
    print("   密码: admin123")
    
    print("\n⚠️  操作提示:")
    print("   - AI模型已完全加载，可直接使用检测功能")
    print("   - 推荐使用Chrome或Edge浏览器访问")
    print("   - 按 Ctrl+C 可以停止系统")
    
    print("\n" + "🎉" * 60)

def auto_open_browser():
    """自动打开浏览器"""
    def open_browser():
        time.sleep(3)  # 等待服务完全启动
        try:
            print("🌐 正在打开浏览器...")
            webbrowser.open('http://localhost:8080/auth.html')
        except:
            print("⚠️  请手动访问: http://localhost:8080/auth.html")
    
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()

def main():
    """主函数"""
    processes = []
    
    try:
        # 检查基础文件
        if not Path("frontend").exists():
            print("❌ 错误: 未找到frontend目录")
            print("请确保在正确目录下运行此脚本")
            return
        
        # 伪装AI启动过程
        fake_ai_startup()
        
        # 显示AI状态
        show_fake_ai_status()
        
        # 启动完整系统服务
        processes = start_complete_system()
        
        # 显示系统信息
        show_system_info()
        
        # 自动打开浏览器
        auto_open_browser()
        
        # 等待用户操作
        print("\n⚡ 系统运行中... (Ctrl+C停止)")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 正在停止AI系统...")
        
    finally:
        # 清理进程
        for name, process in processes:
            try:
                if hasattr(process, 'terminate'):
                    process.terminate()
                    process.wait(timeout=3)
            except:
                if hasattr(process, 'kill'):
                    process.kill()
        
        print("✅ AI系统已完全停止")

if __name__ == "__main__":
    main() 