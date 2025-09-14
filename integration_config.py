#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
前后端集成配置文件
定义模型服务和前端服务的配置
"""

import os

class IntegrationConfig:
    """前后端集成配置类"""
    
    # 模型服务配置
    MODEL_SERVER_HOST = 'localhost'
    MODEL_SERVER_PORT = 5001
    MODEL_SERVER_URL = f'http://{MODEL_SERVER_HOST}:{MODEL_SERVER_PORT}'
    
    # 前端服务配置  
    FRONTEND_HOST = 'localhost'
    FRONTEND_PORT = 5000
    FRONTEND_URL = f'http://{FRONTEND_HOST}:{FRONTEND_PORT}'
    
    # API路径配置
    MODEL_API_PATHS = {
        'health': '/api/model/health',
        'predict_address': '/api/model/predict_address',
        'predict_transaction': '/api/model/predict_transaction',
        'batch_predict': '/api/model/batch_predict'
    }
    
    # 模型文件路径
    MODEL_PATHS = {
        'trxgnnbert_model': 'TrxGNNBert-master/saved_models/best_model.pth',
        'tokenizer_dir': 'TrxGNNBert-master/downstream_tasks/none-phishing-scam-classfication/tokenizer',
        'config_dir': 'TrxGNNBert-master/configs'
    }
    
    # 超时设置
    REQUEST_TIMEOUT = 30  # 秒
    
    # 重试配置
    MAX_RETRIES = 3
    RETRY_DELAY = 1  # 秒
    
    # 日志配置
    LOG_LEVEL = 'INFO'
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    @classmethod
    def get_model_api_url(cls, endpoint):
        """获取模型API的完整URL"""
        return f"{cls.MODEL_SERVER_URL}{cls.MODEL_API_PATHS.get(endpoint, '')}"
    
    @classmethod
    def is_model_server_available(cls):
        """检查模型服务是否可用"""
        try:
            import requests
            response = requests.get(
                cls.get_model_api_url('health'), 
                timeout=5
            )
            return response.status_code == 200
        except:
            return False 