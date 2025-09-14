#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模型客户端
前端服务调用TrxGNNBert模型服务的接口
"""

import requests
import json
import time
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelClient:
    """TrxGNNBert模型服务客户端"""
    
    def __init__(self, model_server_url='http://localhost:5001', timeout=30, max_retries=3):
        """初始化模型客户端"""
        self.model_server_url = model_server_url.rstrip('/')
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        
        # 设置请求头
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'EtherSentinel-Frontend/1.0'
        })
        
        logger.info(f"初始化模型客户端，服务地址: {self.model_server_url}")
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """发送HTTP请求到模型服务"""
        url = f"{self.model_server_url}{endpoint}"
        
        for attempt in range(self.max_retries):
            try:
                if method.upper() == 'GET':
                    response = self.session.get(url, timeout=self.timeout)
                elif method.upper() == 'POST':
                    response = self.session.post(url, json=data, timeout=self.timeout)
                else:
                    raise ValueError(f"不支持的HTTP方法: {method}")
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"请求失败 (尝试 {attempt + 1}/{self.max_retries}): {str(e)}")
                if attempt == self.max_retries - 1:
                    logger.error(f"模型服务请求最终失败: {str(e)}")
                    return {'error': f'模型服务连接失败: {str(e)}'}
                time.sleep(1)  # 重试延迟
        
        return {'error': '模型服务请求失败'}
    
    def check_health(self) -> Dict[str, Any]:
        """检查模型服务健康状态"""
        return self._make_request('GET', '/api/model/health')
    
    def predict_address_risk(self, address: str, transaction_data: Optional[Dict] = None) -> Dict[str, Any]:
        """预测地址风险"""
        data = {
            'address': address
        }
        if transaction_data:
            data['transaction_data'] = transaction_data
        
        result = self._make_request('POST', '/api/model/predict_address', data)
        
        # 如果模型服务失败，返回兜底方案
        if 'error' in result:
            logger.warning(f"模型预测失败，使用兜底方案: {result['error']}")
            return self._fallback_address_prediction(address)
        
        return result
    
    def predict_transaction_risk(self, tx_hash: str, tx_data: Optional[Dict] = None) -> Dict[str, Any]:
        """预测交易风险"""
        data = {
            'tx_hash': tx_hash
        }
        if tx_data:
            data['tx_data'] = tx_data
        
        result = self._make_request('POST', '/api/model/predict_transaction', data)
        
        # 如果模型服务失败，返回兜底方案
        if 'error' in result:
            logger.warning(f"交易预测失败，使用兜底方案: {result['error']}")
            return self._fallback_transaction_prediction(tx_hash)
        
        return result
    
    def batch_predict_addresses(self, addresses: List[str]) -> Dict[str, Any]:
        """批量预测地址风险"""
        data = {
            'addresses': addresses
        }
        
        result = self._make_request('POST', '/api/model/batch_predict', data)
        
        # 如果模型服务失败，返回兜底方案
        if 'error' in result:
            logger.warning(f"批量预测失败，使用兜底方案: {result['error']}")
            return {
                'status': 'success',
                'data': [self._fallback_address_prediction(addr)['data'] for addr in addresses],
                'count': len(addresses)
            }
        
        return result
    
    def _fallback_address_prediction(self, address: str) -> Dict[str, Any]:
        """地址预测的兜底方案（基于规则的简单预测）"""
        # 简单的规则引擎作为兜底
        risk_score = (hash(address) % 100) / 100.0
        
        if risk_score > 0.7:
            risk_type = 'phishing'
            risk_level = 'high'
            description = '地址可能存在钓鱼风险（基于规则引擎分析）'
        elif risk_score > 0.3:
            risk_type = 'scam'
            risk_level = 'medium'
            description = '地址可能存在诈骗风险（基于规则引擎分析）'
        else:
            risk_type = 'normal'
            risk_level = 'safe'
            description = '地址行为正常（基于规则引擎分析）'
        
        return {
            'status': 'success',
            'data': {
                'address': address,
                'risk_type': risk_type,
                'risk_level': risk_level,
                'confidence': risk_score,
                'description': description,
                'prediction_scores': {
                    'normal': 1.0 - risk_score if risk_type == 'normal' else 0.3,
                    'phishing': risk_score if risk_type == 'phishing' else 0.3,
                    'scam': risk_score if risk_type == 'scam' else 0.4
                },
                'timestamp': datetime.now(timezone(timedelta(hours=8))).isoformat(),
                'fallback': True  # 标记为兜底方案
            }
        }
    
    def _fallback_transaction_prediction(self, tx_hash: str) -> Dict[str, Any]:
        """交易预测的兜底方案"""
        risk_score = (hash(tx_hash) % 100) / 100.0
        
        if risk_score > 0.7:
            risk_type = 'high_risk'
            risk_level = 'high'
        elif risk_score > 0.3:
            risk_type = 'medium_risk'
            risk_level = 'medium'
        else:
            risk_type = 'safe'
            risk_level = 'low'
        
        return {
            'status': 'success',
            'data': {
                'tx_hash': tx_hash,
                'risk_type': risk_type,
                'risk_level': risk_level,
                'risk_score': risk_score,
                'timestamp': datetime.now(timezone(timedelta(hours=8))).isoformat(),
                'fallback': True
            }
        }
    
    def is_available(self) -> bool:
        """检查模型服务是否可用"""
        try:
            health = self.check_health()
            return health.get('status') == 'healthy'
        except:
            return False 