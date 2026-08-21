import inspect
from langchain_ollama import ChatOllama
print("ChatOllama init:", inspect.signature(ChatOllama.__init__))
print("ChatOllama module file:", ChatOllama.__module__)
print("ChatOllama dir:")
print([name for name in dir(ChatOllama) if name.startswith('_') is False][:20])
