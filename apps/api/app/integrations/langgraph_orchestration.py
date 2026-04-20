"""
LangGraph Integration for AI Agent Orchestration
Multi-step conversations with state management
"""
from langgraph.graph import StateGraph, END
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import json

@dataclass
class AgentState:
    """State for agent graph"""
    messages: List[Dict[str, str]]
    context: Dict[str, Any]
    current_step: str
    result: Optional[str] = None

class PropertyAgentGraph:
    """LangGraph for property qualification agent"""
    
    def __init__(self):
        self.graph = StateGraph(AgentState)
        self._build_graph()
    
    def _build_graph(self):
        """Build the agent workflow graph"""
        # Define nodes
        self.graph.add_node("greet", self.greeting_node)
        self.graph.add_node("qualify", self.qualify_node)
        self.graph.add_node("schedule", self.schedule_node)
        self.graph.add_node("end", self.end_node)
        
        # Define edges
        self.graph.add_edge("greet", "qualify")
        self.graph.add_conditional_edges(
            "qualify",
            self.should_schedule,
            {
                "yes": "schedule",
                "no": "end"
            }
        )
        self.graph.add_edge("schedule", "end")
        
        # Set entry point
        self.graph.set_entry_point("greet")
    
    def greeting_node(self, state: AgentState) -> AgentState:
        """Initial greeting"""
        state.messages.append({
            "role": "agent",
            "content": "Hello! Welcome to K-IREA. How can I help you with your property search today?",
            "step": "greeting"
        })
        state.current_step = "greeting"
        return state
    
    def qualify_node(self, state: AgentState) -> AgentState:
        """Qualify the lead"""
        # In real implementation, use LLM
        user_message = state.messages[-1].get("content", "")
        
        state.context["qualified"] = any(
            keyword in user_message.lower()
            for keyword in ["interested", "property", "rent", "buy", "sale"]
        )
        
        state.messages.append({
            "role": "agent",
            "content": "Great! Let me help you find the perfect property. What's your budget range?",
            "step": "qualify"
        })
        state.current_step = "qualify"
        return state
    
    def schedule_node(self, state: AgentState) -> AgentState:
        """Schedule a tour"""
        state.messages.append({
            "role": "agent",
            "content": "Perfect! Let's schedule a property tour. What time works best for you?",
            "step": "schedule"
        })
        state.current_step = "schedule"
        state.context["tour_scheduled"] = True
        return state
    
    def end_node(self, state: AgentState) -> AgentState:
        """End conversation"""
        state.messages.append({
            "role": "agent",
            "content": "Thank you for chatting with K-IREA. Feel free to reach out anytime!",
            "step": "end"
        })
        state.current_step = "end"
        state.result = json.dumps({
            "qualified": state.context.get("qualified", False),
            "tour_scheduled": state.context.get("tour_scheduled", False),
            "conversation_length": len(state.messages)
        })
        return state
    
    def should_schedule(self, state: AgentState) -> str:
        """Determine if should schedule"""
        return "yes" if state.context.get("qualified", False) else "no"
    
    def compile(self):
        """Compile the graph"""
        return self.graph.compile()

class LeadQualificationGraph:
    """LangGraph for lead qualification workflow"""
    
    def __init__(self):
        self.graph = StateGraph(AgentState)
        self._build_graph()
    
    def _build_graph(self):
        """Build the qualification workflow"""
        self.graph.add_node("collect_info", self.collect_info)
        self.graph.add_node("assess_budget", self.assess_budget)
        self.graph.add_node("check_timeline", self.check_timeline)
        self.graph.add_node("assign_agent", self.assign_agent)
        self.graph.add_edge("collect_info", "assess_budget")
        self.graph.add_edge("assess_budget", "check_timeline")
        self.graph.add_edge("check_timeline", "assign_agent")
        self.graph.set_entry_point("collect_info")
    
    def collect_info(self, state: AgentState) -> AgentState:
        """Collect basic info"""
        state.messages.append({
            "role": "agent",
            "content": "Let me gather some information about your ideal property.",
            "step": "collect_info"
        })
        return state
    
    def assess_budget(self, state: AgentState) -> AgentState:
        """Assess budget"""
        state.context["budget"] = "high"  # Would come from LLM analysis
        state.messages.append({
            "role": "agent",
            "content": "Thank you! What's your budget range?",
            "step": "assess_budget"
        })
        return state
    
    def check_timeline(self, state: AgentState) -> AgentState:
        """Check timeline"""
        state.context["timeline"] = "urgent"  # Would come from LLM analysis
        state.messages.append({
            "role": "agent",
            "content": "How soon are you looking to move?",
            "step": "check_timeline"
        })
        return state
    
    def assign_agent(self, state: AgentState) -> AgentState:
        """Assign to agent"""
        state.context["assigned_agent"] = "John Smith"
        state.messages.append({
            "role": "agent",
            "content": "I'll connect you with John Smith, our top agent for your needs.",
            "step": "assign_agent"
        })
        state.result = json.dumps(state.context)
        return state
    
    def compile(self):
        """Compile the graph"""
        return self.graph.compile()

# Global instances
property_agent = PropertyAgentGraph()
lead_qualification = LeadQualificationGraph()

# Compile graphs
property_graph_compiled = property_agent.compile()
lead_graph_compiled = lead_qualification.compile()
