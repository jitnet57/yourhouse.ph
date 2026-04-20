"""
Database Models for K-IREA Admin Platform
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Text, JSON, Enum, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(Enum('admin', 'manager', 'agent', 'viewer', name='user_role'), default='viewer')
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    properties = relationship("Property", back_populates="agent", foreign_keys="Property.agent_id")
    leads = relationship("Lead", back_populates="assigned_agent", foreign_keys="Lead.assigned_agent_id")

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    description = Column(Text)
    address = Column(String)
    city = Column(String, index=True)
    price = Column(Float)
    property_type = Column(Enum('residential', 'condo', 'commercial', 'industrial', name='property_type'))
    status = Column(Enum('active', 'sold', 'draft', name='property_status'), default='draft')
    owner_id = Column(String, ForeignKey('users.id'))
    agent_id = Column(String, ForeignKey('users.id'), nullable=True)
    ai_verification_score = Column(Float, default=0.0)
    images_array = Column(JSON, default=[])
    views_count = Column(Integer, default=0)
    inquiries_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    
    owner = relationship("User", foreign_keys=[owner_id])
    agent = relationship("User", foreign_keys=[agent_id], back_populates="properties")
    leads = relationship("Lead", back_populates="property")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    email = Column(String)
    phone = Column(String)
    property_id = Column(String, ForeignKey('properties.id'), nullable=True)
    status = Column(Enum('new', 'contacted', 'interested', 'negotiating', 'closed', name='lead_status'), default='new')
    source = Column(Enum('organic', 'ai_chatbot', 'referral', 'api', name='lead_source'))
    assigned_agent_id = Column(String, ForeignKey('users.id'), nullable=True)
    interaction_count = Column(Integer, default=0)
    last_interaction_at = Column(DateTime, nullable=True)
    ai_transcript = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    property = relationship("Property", back_populates="leads")
    assigned_agent = relationship("User", foreign_keys=[assigned_agent_id], back_populates="leads")
    messages = relationship("Message", back_populates="lead")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lead_id = Column(String, ForeignKey('leads.id'))
    channel = Column(Enum('sms', 'whatsapp', 'voice', 'email', name='channel_type'))
    sender_type = Column(Enum('user', 'ai_agent', 'system', name='sender_type'))
    content = Column(Text)
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    delivery_status = Column(Enum('pending', 'sent', 'delivered', 'failed', name='delivery_status'), default='pending')
    
    lead = relationship("Lead", back_populates="messages")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_type = Column(String, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    property_id = Column(String, ForeignKey('properties.id'), nullable=True)
    lead_id = Column(String, ForeignKey('leads.id'), nullable=True)
    metadata = Column(JSON, default={})
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source = Column(String)
