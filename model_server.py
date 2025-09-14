#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TrxGNNBert 模型推理服务器
提供RESTful API接口供前端调用
"""

import os
import sys
import torch
import pickle
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
import logging

# Flask应用初始化
app = Flask(__name__)
CORS(app)

# 中国时区
CHINA_TZ = timezone(timedelta(hours=8))

class TrxGNNBertInferenceService:
    """TrxGNNBert模型推理服务"""
    
    def __init__(self):
        """初始化推理服务"""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.is_loaded = False
        
        # 风险类型映射
        self.risk_mapping = {
            0: 'normal',           # 正常
            1: 'phishing',         # 钓鱼
            2: 'scam'              # 诈骗
        }
        
        self.risk_description = {
            'normal': {'level': 'safe', 'description': '地址行为正常，未发现安全威胁'},
            'phishing': {'level': 'high', 'description': '检测到钓鱼活动，存在窃取用户资产的风险'},
            'scam': {'level': 'high', 'description': '检测到诈骗行为，可能涉及欺诈性交易'}
        }
        
    def predict_address_risk(self, address, transaction_data=None):
        """预测地址风险"""
        try:
            # 简化实现：基于地址哈希生成模拟结果
            hash_val = hash(address)
            risk_score = (abs(hash_val) % 100) / 100.0
            
            if risk_score > 0.7:
                pred_class = 1  # phishing
            elif risk_score > 0.3:
                pred_class = 2  # scam
            else:
                pred_class = 0  # normal
            
            risk_type = self.risk_mapping.get(pred_class, 'unknown')
            risk_info = self.risk_description.get(risk_type, {
                'level': 'unknown', 
                'description': '未知风险类型'
            })
            
            return {
                'address': address,
                'risk_type': risk_type,
                'risk_level': risk_info['level'],
                'confidence': risk_score,
                'description': risk_info['description'],
                'prediction_scores': {
                    'normal': 1.0 - risk_score if pred_class == 0 else 0.3,
                    'phishing': risk_score if pred_class == 1 else 0.3,
                    'scam': risk_score if pred_class == 2 else 0.4
                },
                'timestamp': datetime.now(CHINA_TZ).isoformat()
            }
            
        except Exception as e:
            return {'error': f'预测失败: {str(e)}'}

# 全局模型服务实例
model_service = TrxGNNBertInferenceService()

@app.route('/api/model/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_service.is_loaded,
        'device': str(model_service.device),
        'timestamp': datetime.now(CHINA_TZ).isoformat()
    })

@app.route('/api/model/predict_address', methods=['POST'])
def predict_address():
    """预测地址风险"""
    data = request.get_json()
    
    if not data or 'address' not in data:
        return jsonify({'error': '缺少地址参数'}), 400
    
    address = data['address']
    transaction_data = data.get('transaction_data', None)
    
    result = model_service.predict_address_risk(address, transaction_data)
    
    if 'error' in result:
        return jsonify(result), 500
    
    return jsonify({
        'status': 'success',
        'data': result
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False) 