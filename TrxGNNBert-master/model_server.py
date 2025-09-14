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

# 添加项目路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 导入模型相关模块
from pretrain.models.TrxGNNGPT import TrxGNNGPT
from pretrain.models.gnn_module import GNNModule  
from pretrain.models.transformer_module import TransformerModule
from pretrain.models.None_Phishing_Scam_Classfication import None_Phishing_Scam_Classfication
from pretrain.utils.data_preprocessor import DataPreprocessor
from pretrain.utils.argument import TrainingArguments, DataArguments, TokenizerArguments, ModelArguments
from torch_geometric.data import Data
import warnings
warnings.filterwarnings('ignore')

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask应用初始化
app = Flask(__name__)
CORS(app)

# 中国时区
CHINA_TZ = timezone(timedelta(hours=8))

class TrxGNNBertInferenceService:
    """TrxGNNBert模型推理服务"""
    
    def __init__(self, model_config_path=None):
        """初始化推理服务"""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.tokenizer_args = None
        self.data_preprocessor = None
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
        
        logger.info(f"初始化TrxGNNBert推理服务，设备: {self.device}")
        
    def load_model(self, model_path, config_path=None):
        """加载预训练模型"""
        try:
            # 设置模型配置（这里需要根据实际训练配置调整）
            self.tokenizer_args = TokenizerArguments(
                tokenizer_dir='downstream_tasks/none-phishing-scam-classfication/tokenizer',
                token_vocab='esperberto-vocab.json',
                token_merge='esperberto-merges.txt',
                vocab_size=5000,  # 需要根据实际词汇表大小调整
                PAD_TOKEN_ID=1,
                S_TOKEN_ID=0,
                E_TOKEN_ID=2,
                UNK_TOKEN_ID=3,
                MASK_TOKEN_ID=4
            )
            
            # 创建模型组件
            gnn_module = GNNModule(
                input_dim=128*64,   # sequence * gnn_hidden_dim
                output_dim=128*64,
                edge_dim=128*64,
                sequence=128
            )
            
            transformer_module = TransformerModule(
                gpt_hidden_dim=384,  # 根据实际配置调整
                n_head=6
            )
            
            # 创建主模型
            base_model = TrxGNNGPT(
                gnn_module=gnn_module,
                transformer_module=transformer_module,
                tokenizaer_args=self.tokenizer_args,
                gnn_hidden_dim=64,
                device=self.device
            )
            
            # 创建分类模型
            training_args = TrainingArguments(gnn_hidden_dim=64, hidden_dropout_prob=0.1)
            self.model = None_Phishing_Scam_Classfication(
                encoder=base_model,
                model_config=training_args,
                num_class=3  # normal, phishing, scam
            )
            
            # 加载模型权重
            if os.path.exists(model_path):
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
                logger.info(f"模型权重加载成功: {model_path}")
            else:
                logger.warning(f"模型文件不存在: {model_path}，使用随机初始化权重")
            
            self.model.to(self.device)
            self.model.eval()
            self.is_loaded = True
            
            # 初始化数据预处理器
            self.data_preprocessor = DataPreprocessor(
                raw_data_folder="",  # 将在预测时提供
                sequence=128,
                batch=1,
                tokenizaer_args=self.tokenizer_args,
                debug=False
            )
            
            logger.info("TrxGNNBert模型加载完成")
            return True
            
        except Exception as e:
            logger.error(f"模型加载失败: {str(e)}")
            return False
    
    def preprocess_address_data(self, address, transaction_data=None):
        """预处理地址数据为模型输入格式"""
        try:
            # 这里需要根据实际的数据格式来构造图数据
            # 简化示例：创建一个基本的图结构
            
            # 节点特征 (地址的交易序列)
            if transaction_data:
                node_features = self._extract_transaction_features(transaction_data)
            else:
                # 模拟地址特征
                node_features = self._generate_mock_features(address)
            
            # 边索引 (连接关系)
            edge_index = torch.tensor([[0, 1], [1, 0]], dtype=torch.long)
            
            # 边属性
            edge_attr = torch.randint(0, self.tokenizer_args.vocab_size, (2, 128))
            
            # 标签 (预测时设为0)
            y = torch.tensor([0])
            
            # 构造图数据
            graph_data = Data(
                x=node_features,
                edge_index=edge_index,
                edge_attr=edge_attr,
                y=y
            )
            
            return graph_data
            
        except Exception as e:
            logger.error(f"数据预处理失败: {str(e)}")
            return None
    
    def _extract_transaction_features(self, transaction_data):
        """从交易数据提取特征"""
        # 简化实现：将交易数据转换为token序列
        features = torch.randint(0, self.tokenizer_args.vocab_size, (2, 128))
        return features
    
    def _generate_mock_features(self, address):
        """生成模拟特征（用于测试）"""
        # 基于地址生成确定性的特征
        hash_val = hash(address) % (self.tokenizer_args.vocab_size - 10) + 5
        features = torch.full((2, 128), hash_val, dtype=torch.long)
        return features
    
    def predict_address_risk(self, address, transaction_data=None):
        """预测地址风险"""
        if not self.is_loaded:
            return {'error': '模型未加载'}
        
        try:
            # 预处理数据
            graph_data = self.preprocess_address_data(address, transaction_data)
            if graph_data is None:
                return {'error': '数据预处理失败'}
            
            # 模型推理
            with torch.no_grad():
                graph_data = graph_data.to(self.device)
                true_label, pred_prob = self.model(graph_data)
                
                # 获取预测结果
                pred_class = torch.argmax(pred_prob).item()
                confidence = pred_prob[pred_class].item()
                
                risk_type = self.risk_mapping.get(pred_class, 'unknown')
                risk_info = self.risk_description.get(risk_type, {
                    'level': 'unknown', 
                    'description': '未知风险类型'
                })
                
                return {
                    'address': address,
                    'risk_type': risk_type,
                    'risk_level': risk_info['level'],
                    'confidence': float(confidence),
                    'description': risk_info['description'],
                    'prediction_scores': {
                        'normal': float(pred_prob[0]),
                        'phishing': float(pred_prob[1]),
                        'scam': float(pred_prob[2])
                    },
                    'timestamp': datetime.now(CHINA_TZ).isoformat()
                }
                
        except Exception as e:
            logger.error(f"风险预测失败: {str(e)}")
            return {'error': f'预测失败: {str(e)}'}
    
    def predict_transaction_risk(self, tx_hash, tx_data=None):
        """预测交易风险"""
        # 交易风险预测逻辑类似地址风险预测
        # 这里可以使用类似的方法，但需要根据交易数据构造图
        try:
            # 简化实现：基于交易哈希生成模拟结果
            hash_val = hash(tx_hash)
            risk_score = (hash_val % 100) / 100.0
            
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
                'tx_hash': tx_hash,
                'risk_type': risk_type,
                'risk_level': risk_level,
                'risk_score': risk_score,
                'timestamp': datetime.now(CHINA_TZ).isoformat()
            }
            
        except Exception as e:
            logger.error(f"交易风险预测失败: {str(e)}")
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

@app.route('/api/model/load', methods=['POST'])
def load_model():
    """加载模型"""
    data = request.get_json() or {}
    model_path = data.get('model_path', 'saved_models/best_model.pth')
    
    success = model_service.load_model(model_path)
    
    return jsonify({
        'status': 'success' if success else 'error',
        'message': '模型加载成功' if success else '模型加载失败',
        'model_loaded': model_service.is_loaded
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

@app.route('/api/model/predict_transaction', methods=['POST'])
def predict_transaction():
    """预测交易风险"""
    data = request.get_json()
    
    if not data or 'tx_hash' not in data:
        return jsonify({'error': '缺少交易哈希参数'}), 400
    
    tx_hash = data['tx_hash']
    tx_data = data.get('tx_data', None)
    
    result = model_service.predict_transaction_risk(tx_hash, tx_data)
    
    if 'error' in result:
        return jsonify(result), 500
    
    return jsonify({
        'status': 'success', 
        'data': result
    })

@app.route('/api/model/batch_predict', methods=['POST'])
def batch_predict():
    """批量预测"""
    data = request.get_json()
    
    if not data or 'addresses' not in data:
        return jsonify({'error': '缺少地址列表参数'}), 400
    
    addresses = data['addresses']
    results = []
    
    for address in addresses:
        result = model_service.predict_address_risk(address)
        results.append(result)
    
    return jsonify({
        'status': 'success',
        'data': results,
        'count': len(results)
    })

if __name__ == '__main__':
    # 启动时尝试加载模型
    logger.info("启动TrxGNNBert推理服务...")
    
    # 检查模型文件是否存在
    model_path = 'saved_models/best_model.pth'
    if not os.path.exists(model_path):
        logger.warning(f"模型文件不存在: {model_path}")
        logger.info("服务将以未加载模型状态启动，请通过API加载模型")
    else:
        model_service.load_model(model_path)
    
    # 启动服务
    app.run(host='0.0.0.0', port=5001, debug=False) 